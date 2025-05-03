#!/bin/bash

export MONGO_USERNAME=nestApiTutorialUser
export MONGO_PASSWORD=nestApiTutorial@123

# Start containers
docker-compose -f docker-compose.yml up -d
