# ctb.sh
I've decided that I will do a redo of the original static website and make a more dynamic version.

## [LIVE TEST/DEMO](test.ctb.sh)

## Table of Contents

**[Installation](#installation)**

**[Documentation](#documentation)**

## Installation
Make sure you have installed:
- Node.js/npm
- MySQL/MariaDB (preferably)
- Python (also install these packages with `pip`)
    - dotenv

First, in the console/terminal, go to the directory with `package.json` and run `npm i`; wait for it to install all the modules (you should see a folder called `node_modules`).

It is recommended that you start up MySQL/MariaDB, and copy and paste all the code in [databse.sql](./src/server/data/database.sql) to the SQL query, rename `.env_template.env` to `.env` and include all the necessary information for functionality.

Once done, run `npm start` in the same directory to start the server. There will be a given port number in the console; start your browser, go to `http://localhost:PORT_NUMBER` and you should be able to interact with the website.

## Documentation
Here are some information you may want to use:

### For server implementation
- **[How the server gathers Malody data](./doc/implement/malody-rankings.md)**

### For learning
- **[How osu!api-v2 with Client Credentials works](./doc/learn/osuapiv2-client.md)**