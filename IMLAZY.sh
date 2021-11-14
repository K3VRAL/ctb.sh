#!/bin/bash
if [ ! `id -u` -eq 0 ]; then
	echo "\n\nPlease run in sudo. This is mandatory to installing and running files."
	exit 1
elif ! test -f "./package.json"; then
	echo "\n\nCannot find package.json in folder. Please go to the correct directory."
	exit 2
else
	echo "\n\nInstalling packages";
	pacman -S nodejs npm python mariadb;
	
	echo "\n\nInstalling python libraries";
	pip install python-dotenv beautifulsoup4 mysql-connector-python;
	
	echo "\n\nInitializing npm/node.js packages";
	npm i;
	
	echo "\n\nInstalling mariadb/mysql";
	mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql;
	
	echo "\n\nMariadb runs on boot; (You can disable this by 'systemctl disable mariadb.service')";
	systemctl enable mariadb.service;
	
	echo "\n\nStarting mariadb;";
	systemctl start mariadb.service;
	
	echo "\n\nSecuring mysql/mariadb, do the root password REMEBER the inputted root password; this will go into .env. Do all the other prompts as YES";
	mariadb-secure-installation;

	echo "\n\nImporting SQL database to mysql/mariadb";
	mysql -u root -p < src/server/data/database.sql;

	echo "\n\nEditing .env_template.env to .env";
	mv .env_template.env .env;

	echo "\n\nEditing .env file";
	nano .env

	echo "\n\nFinishing. Now starting";
	npm start;
fi
