CREATE DATABASE ctbsh_database;
USE ctbsh_database;

CREATE TABLE discord_servers(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE external_websites(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE github_projects(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE twitch_streamers(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE youtube_creators(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);