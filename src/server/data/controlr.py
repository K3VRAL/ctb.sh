import subprocess
import os
import json
import re
import mysql.connector
from pathlib import Path
from dotenv import load_dotenv
dotenv_path = Path(os.path.dirname(__file__) + '/../../../.env')
load_dotenv(dotenv_path=dotenv_path)

def AddingToEnviroment(data):
    with open('.env', 'r') as input, open('.env.temp', 'w') as output:
        for line in input.readlines():
            if not line.strip() or not re.compile('#').search(line) == None:
                output.write(line)
                continue
            key, value = line.split('=')
            if key[:5] == 'OAPI_' and key[5:].lower() in data:
                output.write(key.upper() + '=' + str(data[key[5:].lower()]) + '\n')
                del data[key[5:].lower()]
            else:
                output.write(line)
        for item in data:
            output.write('\n' + 'OAPI_' + item.upper() + '=' + str(data[item]))
    os.remove('.env')
    os.rename(r'.env.temp', r'.env')

def AddingToMySQL(sqldata):
    d_sql = 'DROP TABLE IF EXISTS {};'.format(sqldata['table'])
    c_sql = 'CREATE TABLE {} ( {} );'.format(sqldata['table'], sqldata['c_table'])
    i_sql = 'INSERT INTO {} ( {} ) VALUES ('.format(sqldata['table'], sqldata['i_table'])
    for i in range(0, len(sqldata['i_data'][0])):
        i_sql += '%s, '
    i_sql = i_sql[:len(i_sql)-2] + ' );'

    db = mysql.connector.connect(
        host = os.getenv('DB_HOST'),
        user = os.getenv('DB_USER'),
        password = os.getenv('DB_PASSWORD'),
        database = os.getenv('DB_NAME')
    )

    cur = db.cursor()
    cur.execute(d_sql)
    db.commit()
    cur.close()

    cur = db.cursor()
    cur.execute(c_sql)
    db.commit()
    cur.close()

    cur = db.cursor()
    cur.executemany(i_sql, sqldata['i_data'])
    db.commit()
    cur.close()

    db.close()