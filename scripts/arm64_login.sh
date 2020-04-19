#!/bin/sh -l
docker context create python-arm64 --docker "host=ssh://$1"
docker buildx create --name actions_builder --append python-arm64
