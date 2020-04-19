#!/bin/sh -l
docker context create python-arm64 --docker host=ssh://$1
