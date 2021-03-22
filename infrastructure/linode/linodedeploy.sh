#!/usr/bin/env bash

set -e

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
code_zip_path="$(readlink -f "$1")"

pushd "${here}" > /dev/null

terraform init -input=false
terraform apply -auto-approve -input=false
ip="$(terraform output -raw ip)"
fqdn="$(terraform output -raw fqdn)"

popd > /dev/null

echo > .ansible_inventory.yml "
ungrouped:
  hosts:
    ${ip}:
  vars:
    ansible_user: root
    ansible_ssh_pass: '${TF_VAR_root_password}'
"

echo > .ansible_vars.yml "
code_zip_path: '${code_zip_path}'
fqdn: '${fqdn}'
frontend_root: '${FRONTEND_ROOT}'
"

export ANSIBLE_CONFIG="${here}/../ansible/ansible.cfg"

ansible-playbook \
  --extra-vars @.ansible_vars.yml \
  --inventory .ansible_inventory.yml \
  "${here}/../ansible/server_setup.yml"
