<h1 align="center">  
FIRST BACKEND  
</h1>  

<p align="center">  
  <bold>(WIP)</bold>: This is an enterprise scale advanced microservice pattern with REST API and GRPC Microservices. Want to ask <a target="_blank" href="https://twitter.com/Mateussiil">Mateus Oliveira</a> questions, follow me on my the twitter :)
</p>  
    <p align="center">  
</p>  

<p align="center">
<img src="https://opencollective.com/ultimate-backend/tiers/sponsor/badge.svg?label=sponsor&color=brightgreen" />
<a href="https://img.shields.io/github/license/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/license/juicycleff/ultimate-backend?style=flat-square" alt="License"/></a>  
<a href="https://img.shields.io/github/languages/code-size/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/languages/code-size/juicycleff/ultimate-backend?style=flat-square" alt="Code Size"/></a>  
<a href="https://img.shields.io/github/package-json/v/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/package-json/v/juicycleff/ultimate-backend?style=flat-square" alt="Version"/></a>  
<a href="https://img.shields.io/github/languages/top/juicycleff/ultimate-backend?style=flat-square" target="_blank"><img src="https://img.shields.io/github/languages/top/juicycleff/ultimate-backend?style=flat-square" alt="Top Language"/></a>  
<a href="https://img.shields.io/codacy/grade/dc460840375d4ac995f5647a5ed10179?style=flat-square" target="_blank"><img src="https://img.shields.io/codacy/grade/dc460840375d4ac995f5647a5ed10179?style=flat-square" alt="Top Language"/></a>  
</p>  

## Description

This should be the go to backend base for your next scalable project. This is a proof of concept project designed to be extremely slim and scalable, with distributed data request and process handling, built from the ground up for production use.

## Features

Software features  

* ✅ Software as a Service  
* ✅ Authentication by stateful session (Password)
* ✅ User  
* ✅ REST API  
* ✅ GRPC Microservice  
* ✅ Emailing Queue  
* ✅ Payment ([Stripe](https://stripe.com/))  
* ✅ SaaS Plans ([Stripe](https://stripe.com/))  
* ✅ (WiP) Webhooks  

## Folder Structure  
Senior candidate in the folder structure is the `/app` folder. This folder contains all executable programs or in this case microservices

 - `/app/auth-service` The access microservice handles access token management for each tenant in the system. It also validates current tenant credentials against a tenant specific resources. It is the gate keeper for your tenant api.
 - `/app/billing-service` The billing microservice manages billing and payment commands. It is tightly integrated with Stripe, but can be easily replaced.
 - `/app/products-service` The products microservice manages products and prices commands. It is tightly integrated with Stripe, but can be easily replaced.
 - `/app/products-service` The products microservice manages products and prices commands. It is tightly integrated with Stripe, but can be easily replaced.
 - `/app/email-service` The email microservice manages emails sent.


## Configuration  

Before starting the services, please added the variables.


## Usage  
### With Docker locally
```bash
$ docker-compose up --build
```

## Installation  

```bash  
$ yarn install
```  

### Running the microservices  

Run each service in a separate terminal:  

```bash  
yarn build:ci
```
* Except for email-service.

---

```bash  
node apps/auth-service/src/index.js  
node apps/email-service/src/index.js  
node apps/billing-service/src/index.js  
node apps/products-service/src/index.js  
```  
