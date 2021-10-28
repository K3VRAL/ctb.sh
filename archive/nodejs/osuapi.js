// Archived
// TODO figure out async works, it's hard it figure out

const { json } = require('express');
let fs = require('fs')
require('dotenv').config();

function AddingToEnviroment(jsonoutput) {
    fs.readFile('.env', 'UTF-8', function(err, data) {
        if (err) {
            throw err;
        }

        let newlines = [];
        let lines = data.split(/\r?\n/);
        for (let line in lines) {
            if (lines[line] != '' && lines[line][0] != '#') {
                newlines.push(lines[line]);
                continue;
            }
            keyvalpair = lines[line].split('=');
            if (jsonoutput[keyvalpair[0].toUpperCase()]) {
                newlines.push(keyvalpair[0].toUpperCase() + '=' + jsonoutput[keyvalpair[0].toUpperCase()] + '\n');
                delete jsonoutput[keyvalpair[0].toUpperCase()];
            } else {
                newlines.push(lines[line]);
            }
        }
        // TODO Fix this so that it does it after the loop above
        for (let key in jsonoutput) {
            newlines.push('\n' + key + '=' + jsonoutput[key]);
        }
        fs.writeFile('.env', newlines.join('\n'), 'UTF-8', function(err) {
            if (err) {
                throw err;
            }
        });
    });
    
}
AddingToEnviroment({ foo: 'bar', ok: 'sure' });

// Don't ever use, only for testing/starting out purposes
function OAuthToken() {
    let options = {
        url : 'https://osu.ppy.sh/oauth/token',
        qs  : {
            client_id     : os.getenv('CLIENT_ID'),
            client_secret : os.getenv('CLIENT_SECRET'),
            code          : os.getenv('CODE'),
            grant_type    : 'authorization_code',
            redirect_uri  : 'http://localhost'
        }
    }
    request.get(options, function(err, res, body) {
        if (err) {
            throw err;
        }

        AddingToEnviroment(JSON.parse(body));
    });
}

function RefreshOAuthToken() {
    let options = {
        url : 'https://osu.ppy.sh/oauth/token',
        qs  : {
            client_id     : os.getenv('CLIENT_ID'),
            client_secret : os.getenv('CLIENT_SECRET'),
            code          : os.getenv('CODE'),
            grant_type    : 'authorization_code',
            redirect_uri  : 'http://localhost'
        }
    }
    request.get(options, function(err, res, body) {
        if (err) {
            throw err;
        }

        AddingToEnviroment(JSON.parse(body));
    });
}