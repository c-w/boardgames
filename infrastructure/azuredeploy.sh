#!/usr/bin/env bash

set -e

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
code_zip_path="$1"

# The login step assumes that a service principal has been created for non-interactive authentication, e.g. via:
# az ad sp create-for-rbac --name "${name}" --years 5
# az role assignment create --assignee "${name}" --role "User Access Administrator"
az login \
  --service-principal \
  --username "${SP_USERNAME}" \
  --password "${SP_PASSWORD}" \
  --tenant "${SP_TENANT}" \
> /dev/null

az group create \
  --location "${RG_LOCATION}" \
  --name "${RG_NAME}" \
> /dev/null

deployment="$(az deployment group create \
  --resource-group "${RG_NAME}" \
  --name "gh${GITHUB_RUN_ID}" \
  --template-file "${here}/azuredeploy.json" \
  --parameters frontendRoot="${FRONTEND_ROOT}" \
  --output json \
  --no-prompt)"

staging_slot_name="$(jq -r '.properties.outputs.stagingSlotName.value' <<< "${deployment}")"
website_name="$(jq -r '.properties.outputs.websiteName.value' <<< "${deployment}")"
state_container_name="$(jq -r '.properties.outputs.stateContainerName.value' <<< "${deployment}")"
code_container_name="$(jq -r '.properties.outputs.codeContainerName.value' <<< "${deployment}")"
storage_account_name="$(jq -r '.properties.outputs.storageAccountName.value' <<< "${deployment}")"
storage_account_key="$(az storage account keys list --resource-group "${RG_NAME}" --account-name "${storage_account_name}" --output tsv --query '[0].value')"

code_zip="$(basename "${code_zip_path}")"

if ! az storage blob upload \
  --account-key="${storage_account_key}" \
  --account-name="${storage_account_name}" \
  --container-name="${code_container_name}" \
  --file "${code_zip_path}" \
  --name "${code_zip}" \
  --if-none-match '*' \
  --no-progress \
> /dev/null; then
  exit 0
fi

sas="$(az storage blob generate-sas \
  --account-key="${storage_account_key}" \
  --account-name="${storage_account_name}" \
  --container-name="${code_container_name}" \
  --name "${code_zip}" \
  --permissions r \
  --start '2020-01-01T00:00:00Z' \
  --expiry '2222-01-01T00:00:00Z' \
  --output tsv)"

blob_url="$(az storage blob url \
  --account-key="${storage_account_key}" \
  --account-name="${storage_account_name}" \
  --container-name="${code_container_name}" \
  --name "${code_zip}" \
  --output tsv)"

az webapp config appsettings set \
  --resource-group "${RG_NAME}" \
  --name "${website_name}" \
  --slot "${staging_slot_name}" \
  --settings \
    WEBSITES_ENABLE_APP_SERVICE_STORAGE='false' \
    SCM_DO_BUILD_DURING_DEPLOYMENT='false' \
    SOCKET_PER_MESSAGE_DEFLATE='false' \
    AZURE_STORAGE_ACCOUNT="${storage_account_name}" \
    AZURE_STORAGE_CONTAINER="${state_container_name}" \
    FRONTEND_ROOT="${FRONTEND_ROOT}" \
    WEBSITE_RUN_FROM_PACKAGE="${blob_url}?${sas}" \
> /dev/null

az webapp restart \
  --resource-group "${RG_NAME}" \
  --name "${website_name}" \
  --slot "${staging_slot_name}" \
> /dev/null

deployed=

for _ in {1..30}; do
  if curl -o/dev/null -m60 -fsSL "https://${website_name}-${staging_slot_name}.azurewebsites.net/games"; then
    deployed="true"
    break
  else
    sleep 10s
  fi
done

if [ "${deployed}" != "true" ]; then
  exit 1
fi

az webapp deployment slot swap \
  --resource-group "${RG_NAME}" \
  --name "${website_name}" \
  --slot "${staging_slot_name}" \
  --action preview \
> /dev/null

az webapp deployment slot swap \
  --resource-group "${RG_NAME}" \
  --name "${website_name}" \
  --slot "${staging_slot_name}" \
  --action swap \
> /dev/null

curl -m60 -fsSL "https://${website_name}.azurewebsites.net/games"

az storage blob list \
  --account-key="${storage_account_key}" \
  --account-name="${storage_account_name}" \
  --container-name="${code_container_name}" \
  --output tsv \
  --query '[].name' \
| grep -v "^${code_zip}$" \
| while IFS= read -r blob_name; do
  az storage blob delete \
    --account-key="${storage_account_key}" \
    --account-name="${storage_account_name}" \
    --container-name="${code_container_name}" \
    --name "${blob_name}" \
  > /dev/null
done
