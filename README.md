# ctb.sh
I've decided that I will do a redo of the original static website and make a more dynamic version.

### [LIVE TEST/DEMO](https://test.ctb.sh) - may be offile if server is under maintenance

## Table of Contents

**[Installation](#install)**

**[Documentation](#doc)**

<a name='install'></a>
## Installation
Make sure you have installed:
- Node.js
- npm
- MySQL/MariaDB (preferably)
- Python (also install these packages with `pip`)
    - python-dotenv
    - beautifulsoup4
    - mysql-connector-python

If you are using linux and you are on arch linux, you can do `sh IMLAZY.sh` to install all the packages from above as well as do everything else from below, you lazy bastard.

First, in the console/terminal, go to the directory with `package.json` and run `npm i`; wait for it to install all the modules (you should see a folder called `node_modules`).

It is recommended that you start up MySQL/MariaDB, and copy and paste all the code in [databse.sql](./src/server/data/database.sql) to the SQL query. To do from console/terminal, write `mysql -u root -p < ./src/server/data/database.sql` assuming that you are in the top most directory of the git project.

In that same directory, rename `.env_template.env` to `.env` and include all the necessary information for functionality.

Once done, run `npm start` in the same directory to start the server. There will be a given port number in the console; start your browser, go to `http://localhost:PORT_NUMBER` and you should be able to interact with the website. If instead you'd like to use curl from the terminal, write down in your console/terminal `curl http://localhost:PORT_NUMBER/` and the rest of the URL.

<a name='doc'></a>
## Documentation
Here are some information you may want to use:

### The TODO Section
- **[TODO](./doc/TODO)**

### For server implementation
- **[How the server gathers Malody data](./doc/implement/malody-rankings.md)**

### For learning
- **[How osu!api-v2 with Client Credentials works](./doc/learn/osuapiv2-client.md)**