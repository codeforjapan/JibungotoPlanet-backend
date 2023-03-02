#!/bin/sh
docker compose up --build -d
docker compose exec localstack awslocal route53 create-hosted-zone --name jibungoto-planet.jp --caller-reference `date +%Y-%m-%d_%H-%M-%S`
npx cdklocal bootstrap -c stage=local
npx cdklocal deploy -c stage=local --all --require-approval never
cd data
./load-local.sh
