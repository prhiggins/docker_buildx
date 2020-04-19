#!/bin/sh -l

# Download buildx
curl -s https://api.github.com/repos/docker/buildx/releases/latest \
| grep "browser_download_url.*buildx-*.*linux-amd64" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -

# Confiure buildx
export DOCKER_CLI_EXPERIMENTAL=enabled
mkdir -p ~/.docker/cli-plugins
mv buildx* ~/.docker/cli-plugins/docker-buildx
chmod a+x ~/.docker/cli-plugins/docker-buildx

# Register Arm executables
docker run --rm --privileged docker/binfmt:820fdd95a9972a5308930a2bdfb8573dd4447ad3
# Register Multiarch executables
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

# Create builder instance
docker buildx create --name actions_builder --use
docker buildx create --append --name actions_builder python-arm64
SUPPORTED_PLATFORMS=$(docker buildx inspect --bootstrap | grep 'Platforms:*.*' | cut -d : -f2,3)
echo "Supported platforms: $SUPPORTED_PLATFORMS"
