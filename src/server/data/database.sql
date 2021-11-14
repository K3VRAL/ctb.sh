CREATE DATABASE ctbsh_database;
USE ctbsh_database;

CREATE TABLE osu_discord_servers(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE osu_external_websites(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE osu_github_projects(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE osu_twitch_streamers(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);
CREATE TABLE osu_youtube_creators(id SERIAL UNIQUE, name TEXT NOT NULL, link TEXT NOT NULL);