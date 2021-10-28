import requests
import os
import json
import mariadb
from pathlib import Path
from dotenv import load_dotenv
dotenv_path = Path(os.path.dirname(__file__) + '/../../../.env')
load_dotenv(dotenv_path=dotenv_path)

pool = mariadb.connect(
    host = os.getenv('DB_HOST'),
    user = os.getenv('DB_USER'),
    password = os.getenv('DB_PASSWORD'),
    database = os.getenv('DB_NAME')
).cursor()
pool.execute('SELECT * FROM youtube')

params = {
    'part': 'statistics',
    'key': os.getenv('YT_KEY'),
    'id': ''
}

for uid, name, link in pool:
    params['id'] = link.split('/')[len(link.split('/'))-1]
    baseurl = 'https://www.googleapis.com/youtube/v3/channels'
    r = requests.get(baseurl, params=params)
    print(json.dumps({
        'name': name,
        'link': link,
        'videoCount': r.json()['items'][0]['statistics']['videoCount'],
        'subscriberCount': r.json()['items'][0]['statistics']['subscriberCount']
    }), end='')
pool.close()