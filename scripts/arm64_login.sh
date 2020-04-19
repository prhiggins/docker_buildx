#!/bin/sh -l
echo $1 > ~/.ssh/id_rsa
docker context create python-arm64 --docker "host=ssh://$2:2376"
docker buildx create --name actions_builder --append python-arm64
