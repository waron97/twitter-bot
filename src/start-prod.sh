#!/bin/bash

docker compose -f ./docker-compose.yml down --remove-orphans 
docker compose -f ./docker-compose.yml up -d --build --remove-orphans