#!/bin/bash

pnpm nx run-many -t build

rm -rf dist/docker
mkdir -p dist/docker/posxpress/app
mkdir -p dist/docker/posxapi/app

cp -r dist/apps/posxpress/* dist/docker/posxpress/app
cp -r conf/docker/posxpress/* dist/docker/posxpress
docker build -t posxpress dist/docker/posxpress

cp package.json dist/docker/posxapi/app
cp -r dist/apps/posxapi/* dist/docker/posxapi/app
cp -r conf/docker/posxapi/* dist/docker/posxapi
docker build -t posxapi dist/docker/posxapi