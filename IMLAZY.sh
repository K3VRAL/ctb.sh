#!/bin/bash
if [ ! `id -u` -eq 0 ]; then
	echo "Please run in sudo. This is mandatory to installing and running files."
	exit 1
elif ! test -f "./package.json"; then
	echo "Cannot find package.json in folder. Please go to the correct directory."
	exit 2
else
	echo "Installing packages";
	pacman -S nodejs npm python mariadb;
	
	echo "Installing python libraries";
	pip install python-dotenv beautifulsoup4 mysql-connector-python;
	
	echo "Initializing npm/node.js packages";
	npm i;
	
	echo "Installing mariadb/mysql";
	mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql;
	
	echo "Mariadb runs on boot; (You can disable this by 'systemctl disable mariadb.service')";
	systemctl enable mariadb.service;
	
	echo "Starting mariadb;";
	systemctl start mariadb.service;
	
	echo "Securing mysql/mariadb, do the root password REMEBER the inputted root password; this will go into .env. Do all the other prompts as YES";
	mariadb-secure-installation;

	echo "Importing SQL database to mysql/mariadb";
	mysql -u root -p < src/server/data/database.sql;

	echo "Editing .env_template.env to .env";
	mv .env_template.env .env;

	echo "Editing .env file";
	nano .env

	echo "Finishing. Now starting";
	npm start;
fi