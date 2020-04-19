#!/bin/sh -l
ARM64_DEVICE_ADDR = $1
docker context create python-arm64 --docker host=ssh://ARM64_DEVICE_ADDR
