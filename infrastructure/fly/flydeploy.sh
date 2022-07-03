#!/usr/bin/env bash

set -e

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docker_image_name="$1"
region="mia"
volume_gb="1"

pushd "${here}" > /dev/null

if ! flyctl apps list --json | jq -e 'any(.[]; .Name == "justamouse-boardgames")' > /dev/null; then
  flyctl apps create justamouse-boardgames
fi

if ! flyctl volumes list --json | jq -e 'any(.[]; .Name == "state_dir")' > /dev/null; then
  flyctl volumes create state_dir --region "${region}" --size "${volume_gb}"
fi

flyctl deploy --image "${docker_image_name}" --region "${region}" --env "FRONTEND_ROOT=${FRONTEND_ROOT}"

popd > /dev/null
