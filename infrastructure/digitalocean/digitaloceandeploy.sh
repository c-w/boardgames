#!/usr/bin/env bash

set -e

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
code_zip_path="$(readlink -f "$1")"

ssh_key_dir="${here}/.ssh"
ssh_key_public="${ssh_key_dir}/id_rsa.pub"
ssh_key_private="${ssh_key_dir}/id_rsa"
mkdir -p "${ssh_key_dir}"
chmod 700 "${ssh_key_dir}"
base64 -d <<<"${DIGITALOCEAN_SSH_KEY_B64}" > "${ssh_key_private}"
chmod 600 "${ssh_key_private}"
ssh-keygen -y -f "${ssh_key_private}" > "${ssh_key_public}"
chmod 644 "${ssh_key_public}"

pushd "${here}" > /dev/null

terraform init -input=false
terraform apply -auto-approve -input=false -var "ssh_key_public=${ssh_key_public}"
ip="$(terraform output -raw ip)"
fqdn="$(terraform output -raw fqdn)"

popd > /dev/null

echo > .ansible_inventory.yml "
ungrouped:
  hosts:
    ${ip}:
  vars:
    ansible_user: root
    ansible_ssh_private_key_file: '${ssh_key_private}'
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
