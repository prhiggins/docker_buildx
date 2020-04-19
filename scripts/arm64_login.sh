#!/bin/sh -l
ARM64_HOSTNAME=$1
echo ARM64_HOSTNAME
docker context create python-arm64 --docker host=ssh://$ARM64_HOSTNAME
echo "Created context"
