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
            if key[:5] == 'OAPI_' and key[5:].lower() in jsonoutput:
                output.write(key.upper() + '=' + str(jsonoutput[key[5:].lower()]) + '\n')
                del jsonoutput[key[5:].lower()]
            else:
                output.write(line)
        for item in jsonoutput:
            output.write('\n' + 'OAPI_' + item.upper() + '=' + str(jsonoutput[item]))
    os.remove('.env')
    os.rename(r'.env.output.temp', r'.env')

def OAuthToken():
    headers = {
        'Content-Type'  : 'application/json'
    }
    bodyparams = {
        'client_id'     : os.getenv('OAPI_CLIENT_ID'),
        'client_secret' : os.getenv('OAPI_CLIENT_SECRET'),
        'grant_type'    : 'client_credentials',
        'scope'         : 'public'
    }
    r = requests.post('https://osu.ppy.sh/oauth/token', headers=headers, data=json.dumps(bodyparams, separators=(',', ':')))
    if r.ok:
        AddingToEnviroment(r.json())
    else:
        print('Failed Posting OAuthToken: ' + str(r))
        exit(2)

def RequestingData():
    baseurl = 'https://osu.ppy.sh/api/v2/'
    headers = {
        'Content-Type'  : 'application/json',
        'Authorization' : os.getenv('OAPI_TOKEN_TYPE') + ' ' + os.getenv('OAPI_ACCESS_TOKEN')
    }
    r = requests.get(baseurl + 'rankings/fruits/country', headers=headers)
    if r.ok:
        # TODO this
        print(r)
        print(r.json())
    else:
        print('Failed Requesting Data: ' + str(r))
        exit(1)

def main(argv):
    if argv[0] == '1':
        RequestingData()
    elif argv[0] == '2':
        OAuthToken()
    else:
        exit(0)

if __name__ == '__main__':
    main(sys.argv[1:])