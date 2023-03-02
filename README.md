# Kafka NodeJS Example

## Introduction

This repository showcases an example of using Kafka with NodeJS. 

## Instructions
This demonstration assumes you already have `docker` and `docker-compose` installed. The steps are as follows:

1) Using `docker-compose`, spin up all containers (Zookeeper, Kafka, Database):
```shell
docker-compose up -d
```

2) If, you change the variables env on email-service, post a request to the register endpoint specifying your real email amount for the sale:
```shell
curl -X POST \
  http://localhost:8080/users/register \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  --data-raw '{
    "email":"your@real.email",
    "password":"1234"
  }'
```

curl --location 'http://localhost:8080/users/register' \
--data-raw '{
    "email":"mateus_silva97@hotmail.com",
    "password":"1234"
}'

