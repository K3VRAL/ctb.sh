import requests
import os
import json
import re
import sys
from pathlib import Path
from dotenv import load_dotenv
dotenv_path = Path(os.path.dirname(__file__) + '/../../../.env')
load_dotenv(dotenv_path=dotenv_path)

def AddingToEnviroment(jsonoutput):
    with open(".env", "r") as input, open(".env.output.temp", "w") as output:
        for line in input.readlines():
            if not line.strip() or not re.compile('#').search(line) == None:
                output.write(line)
                continue
            key, value = line.split('=')
            if key.lower() in jsonoutput:
                output.write('OAPI_' + key.upper() + '=' + str(jsonoutput[key.lower()]) + '\n')
                del jsonoutput[key.lower()]
            else:
                output.write(line)
        for item in jsonoutput:
            output.write('\n' + 'OAPI_' + item.upper() + '=' + str(jsonoutput[item]))
    os.remove('.env')
    os.rename(r'.env.output.temp', r'.env')

def OAuthToken():
    bodyparams = {
        'client_id'     : os.getenv('OAPI_CLIENT_ID'),
        'client_secret' : os.getenv('OAPI_CLIENT_SECRET'),
        'code'          : os.getenv('OAPI_CODE'),
        'grant_type'    : 'authorization_code',
        'redirect_uri'  : 'http://localhost'
    }
    r = requests.post('https://osu.ppy.sh/oauth/token', data=bodyparams)
    if r.ok:
        AddingToEnviroment(r.json())
        # print('Successfully Posted and Recieved')
    else:
        print('Failed Posting OAuthToken: ' + str(r))
        exit(3)

def RefreshingOAuthToken():
    bodyparams = {
        'client_id'     : os.getenv('OAPI_CLIENT_ID'),
        'client_secret' : os.getenv('OAPI_CLIENT_SECRET'),
        'grant_type'    : 'refresh_token',
        'refresh_token' : os.getenv('OAPI_REFRESH_TOKEN')
    }
    r = requests.post('https://osu.ppy.sh/oauth/token', data=bodyparams)
    if r.ok:
        AddingToEnviroment(r.json())
        # print('Successfully Posted Refreshed and Recieved')
    else:
        print('Failed Posting OAuthToken For Refresh: ' + str(r))
        exit(2)

def RequestingData():
    baseurl = 'https://osu.ppy.sh/api/v2/'
    headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json',
        'Authorization' : os.getenv('OAPI_TOKEN_TYPE') + ' ' + os.getenv('OAPI_ACCESS_TOKEN')
    }
    r = requests.get(baseurl + 'me/fruits', headers=headers)
    if r.ok:
        # TODO this
        print(r)
        # print(r.json())
    else:
        print('Failed Requesting Data: ' + str(r))
        exit(1)

def main(argv):
    if argv[0] == '1':
        RequestingData()
    elif argv[0] == '2':
        RefreshingOAuthToken()
    elif argv[0] == '3':
        # Only do this for debugging purposes/getting a new token, DON'T EVER USE IN ACTUAL WEBSITE
        OAuthToken()
    else:
        # print('Quitting...')
        exit(0)

if __name__ == '__main__':
    main(sys.argv[1:])