#!/bin/bash

echo What should the version be?
read VERSION 

docker build -r ramchaik/lireddit:$VERSION .
docker push ramchaik/lireddit:$VERSION
ssh root@64.227.13.208 "docker pull ramchaik/lireddit:$VERSION && docker tag ramchaik/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION" 