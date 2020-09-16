#!/usr/bin/env bash
# build puppeteer container

sudo docker run \
  -it \
  --init \
  --rm \
  --cap-add=SYS_ADMIN \
  -v $(pwd):/home/node/app \
  --workdir /home/node/app \
  puppeteer-img \
  bash
