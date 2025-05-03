#!/bin/bash

export MONGO_USERNAME=nestApiTutorialUser
export MONGO_PASSWORD=nestApiTutorial@123

# Stop and remove containers, networks, and volumes defined in docker-compose.yml
docker-compose -f docker-compose.yml down
