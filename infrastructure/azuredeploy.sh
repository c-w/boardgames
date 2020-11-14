#!/usr/bin/env bash

set -e

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
code_zip="$1"

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

website_name="$(jq -r '.properties.outputs.websiteName.value' <<< "${deployment}")"
code_container_name="$(jq -r '.properties.outputs.codeContainerName.value' <<< "${deployment}")"
storage_account_name="$(jq -r '.properties.outputs.storageAccountName.value' <<< "${deployment}")"
storage_account_key="$(az storage account keys list --resource-group "${RG_NAME}" --account-name "${storage_account_name}" --output tsv --query '[0].value')"

az storage blob upload \
  --account-key="${storage_account_key}" \
  --account-name="${storage_account_name}" \
  --container-name="${code_container_name}" \
  --file "${code_zip}" \
  --name "${code_zip}" \
  --no-progress \
> /dev/null

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
  --settings WEBSITE_RUN_FROM_PACKAGE="${blob_url}?${sas}" \
> /dev/null
