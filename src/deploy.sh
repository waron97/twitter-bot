#!/bin/bash

ssh -i ./keys/id_rsa duser@172.104.159.17 'cd twitter-bot/src; git pull; ./start-prod.sh;'