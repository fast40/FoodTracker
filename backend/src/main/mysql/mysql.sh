#!/bin/bash

# Feel free to commend this out if it's annoying; I found it helpful
docker container stop mysql
docker container remove mysql

# The -v ./mysql:/var/lib/mysql saves the mysql data to the disk instead of inside the container so that it can be saved even if the container is destroyed
# Note that the setup script will not run if there is already data in the mysql directory. So it must be deleted and the the container started if you want the setup to run.
# docker run --name mysql -p 3306:3306 -v ./setup:/docker-entrypoint-initdb.d -v ./mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=food_tracker mysql

# This just restarts the container from a blank slate every time
docker run --name mysql -p 3306:3306 -v ./setup:/docker-entrypoint-initdb.d -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=food_tracker mysql
