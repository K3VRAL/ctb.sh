import requests
import os
import json
import sys
import time

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import controlr

def OsuRankings(data, table):
    table_done = True
    c_table = ''
    i_table = ''
    i_data = []

    for x in range(0, len(data)):
        keys = list(data[x].keys())
        i_data.append(('',))
        for y in range(0, len(data[x])):
            try:
                json.loads('{}'.format(data[x][keys[y]]))
                if table_done:
                    c_table += '{} TEXT, '.format(keys[y])
                    i_table += '{}, '.format(keys[y])
                i_data[x] += ('{}'.format(data[x][keys[y]]),)
            except ValueError as e:
                for z in data[x][keys[y]]:
                    if table_done:
                        c_table += '{}_{} TEXT, '.format(keys[y], z)
                        i_table += '{}_{}, '.format(keys[y], z)
                    i_data[x] += ('{}'.format(data[x][keys[y]][z]),)
        i_data[x] = i_data[x][1:]
        if table_done:
            c_table = c_table[:len(c_table)-2]
            i_table = i_table[:len(i_table)-2]
            table_done = False
            
    sqldata = {}
    sqldata['table'] = table
    sqldata['c_table'] = c_table
    sqldata['i_table'] = i_table
    sqldata['i_data'] = i_data
    return sqldata

def RequestingProfile(data):
    headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json',
        'Authorization' : os.getenv('OAPI_TOKEN_TYPE') + ' ' + os.getenv('OAPI_ACCESS_TOKEN')
    }
    for i in range(0, len(data)):
        r = requests.get('https://osu.ppy.sh/api/v2/users/{}/fruits'.format(data[i]['user']['id']), headers=headers)
        print('ReqProfile\t-\t{}\t-\t{}'.format(i, r), end = '\r')
        if r.ok or r.status_code != status_code:
            del data[i]['is_ranked'], data[i]['user']['avatar_url'], data[i]['user']['country_code'], data[i]['user']['is_active'], data[i]['user']['is_bot'], data[i]['user']['is_deleted'], data[i]['user']['is_online'], data[i]['user']['is_supporter'], data[i]['user']['last_visit'], data[i]['user']['pm_friends_only'], data[i]['user']['profile_colour'], data[i]['user']['cover'], data[i]['user']['country']
            data[i]['scores_first_count'] = r.json()['scores_first_count']
            data[i]['follower_count'] = r.json()['follower_count']
            data[i]['post_count'] = r.json()['post_count']
            data[i]['kudosu'] = r.json()['kudosu']
            data[i]['ranked_beatmapset_count'] = r.json()['ranked_beatmapset_count']
            data[i]['loved_beatmapset_count'] = r.json()['loved_beatmapset_count']
            data[i]['graveyard_beatmapset_count'] = r.json()['graveyard_beatmapset_count']
            data[i]['pending_beatmapset_count'] = r.json()['pending_beatmapset_count']
            data[i]['mapping_follower_count'] = r.json()['mapping_follower_count']
            data[i]['user_achievements'] = len(r.json()['user_achievements'])
            time.sleep(1)
        else:
            print('Failed Requesting Profile: ' + str(r))
            exit(1)
    print()
    return data

def RequestingPage():
    headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json',
        'Authorization' : os.getenv('OAPI_TOKEN_TYPE') + ' ' + os.getenv('OAPI_ACCESS_TOKEN')
    }
    data = []
    for i in range(0 + 1, 2 + 1): # TODO 1000 + 1):
        params = {
            'filter'        : 'all',
            'cursor[page]'  : i
        }
        r = requests.get('https://osu.ppy.sh/api/v2/rankings/fruits/performance', headers=headers, params=params)
        print('ReqPage\t-\t{}\t-\t{}'.format(i, r), end = '\r')
        if r.ok or r.status_code == 200:
            data.extend(r.json()['ranking'])
            time.sleep(1)
        else:
            print('Failed Requesting Data: ' + str(r))
            print('This may have to do with the access token being expired. Try running the same script but with argument \'-c\' as well to renew.')
            exit(1)
    print()
    return data

def Auth_OAuthToken(code):
    headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json'
    }
    bodyparams = {
        'client_id'     : os.getenv('OAPI_CLIENT_ID'),
        'client_secret' : os.getenv('OAPI_CLIENT_SECRET'),
        'code'          : code,
        'grant_type'    : 'authorization_code',
        'redirect_uri'  : os.getenv('OAPI_CLIENT_REDIRECT')
    }
    r = requests.post('https://osu.ppy.sh/oauth/token', headers=headers, data=json.dumps(bodyparams, separators=(',', ':')))
    if r.ok:
        print(r.json())
    else:
        print('Failed Posting Client_OAuthToken: ' + str(r))
        exit(1)

def Client_OAuthToken():
    headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json'
    }
    bodyparams = {
        'client_id'     : os.getenv('OAPI_CLIENT_ID'),
        'client_secret' : os.getenv('OAPI_CLIENT_SECRET'),
        'grant_type'    : 'client_credentials',
        'scope'         : 'public'
    }
    r = requests.post('https://osu.ppy.sh/oauth/token', headers=headers, data=json.dumps(bodyparams, separators=(',', ':')))
    if r.ok:
        return r.json()
    else:
        print('Failed Posting Client_OAuthToken: ' + str(r))
        exit(1)

class flags:
    request = False
    clientToken = False
    authToken = False

def main(argv):
    for i in argv:
        if i[0] == '-':
            if i == '-r' or i == '--request':
                flags.request = True
            if i == '-c' or i == '--client':
                flags.clientToken = True
            if i == '-a' or i == '--auth':
                flags.authToken = True
    if flags.clientToken:
        controlr.AddingToEnviroment(Client_OAuthToken())
    if flags.request:
        t1 = time.time()
        controlr.AddingToMySQL(OsuRankings(RequestingProfile(RequestingPage()), 'osu_rankings'))
        t2 = time.time()
        print('Took {} seconds'.format(round(t2 - t1, 2)))
    if flags.authToken:
        Auth_OAuthToken(argv[1]) # TODO

    if not (flags.clientToken or flags.request or flags.authToken):
        print('Did nothing.')
        exit(1)

if __name__ == '__main__':
    main(sys.argv[1:])