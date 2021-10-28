import requests
import json
import time

# Get authorization code
#url = 'https://osu.ppy.sh/oauth/authorize?client_id=REDACTED&redirect_uri=http://localhost&response_type=code&scope=public'

# Get token
# files = {
#    'client_id': 'REDACTED',
#    'client_secret': 'REDACTED',
#    #'code': 'REDACTED',
#    'refresh_token': 'REDACTED',
#    #'grant_type': 'authorization_code',
#    'grant_type': 'refresh_token',
#    #'redirect_uri': 'http://localhost'
# }
# r = requests.post('https://osu.ppy.sh/oauth/token', data=files)
# print(r)
# print(r.json())

# Get data
#    'token_type': 'Bearer',
#    'expires_in': 86400,
#    'access_token': 'REDACTED',
#    'refresh_token': 'REDACTED'

# headers = {
#     'Content-Type': 'application/json',
#     'Accept': 'application/json',
#     'Authorization': 'Bearer REDACTED'
# }

# TODO Include mod ranks (pp) as well
# TODO Remove unnecessary data

# main = 'osu/data/main.json'
# open(main, 'w').close()
# with open(main, 'w') as main_file:
#     perres = list()
#     for i in range(1, 100 + 1):
#         time.sleep(1)
#         perurl = 'https://osu.ppy.sh/api/v2/rankings/fruits/performance?filter=all&cursor[page]=' + str(i)
#         perr = requests.get(perurl, headers=headers)
#         print('Page | ' + str(i) + ': ' + str(perr))
#         perres.extend(perr.json()["ranking"])
#     for i in range(0, len(perres)):    #use /users and params to get mutliple users
#         time.sleep(1)
#         firurl = 'https://osu.ppy.sh/api/v2/users/' + str(perres[i]['user']['id']) + '/fruits'
#         firr = requests.get(firurl, headers=headers)
#         print('User | ' + str(i + 1) + ': ' + str(perres[i]['user']['id']) + ' ' + str(firr))
#         perres[i]["scores_first_count"] = firr.json()["scores_first_count"]
#         perres[i]["follower_count"] = firr.json()["follower_count"]
#         perres[i]["post_count"] = firr.json()["post_count"]
#         perres[i]["kudosu"] = firr.json()["kudosu"]
#         perres[i]["ranked_beatmapset_count"] = firr.json()["ranked_beatmapset_count"]
#         perres[i]["loved_beatmapset_count"] = firr.json()["loved_beatmapset_count"]
#         perres[i]["graveyard_beatmapset_count"] = firr.json()["graveyard_beatmapset_count"]
#         perres[i]["pending_beatmapset_count"] = firr.json()["pending_beatmapset_count"]
#         perres[i]["mapping_follower_count"] = firr.json()["mapping_follower_count"]
#         perres[i]["user_achievements"] = firr.json()["user_achievements"]
#     json.dump(perres, main_file, indent=4)

# TODO Fix this so it matches mod.json
#mod = 'osu/data/mod.json'
#open(mod, 'w').close()
#with open(mod, 'w') as comp_file:
#    params = {
#        'mode': 'fruits',
#        'limit': 1000
#    }
#    res = []
#    jso = json.load(open(main))
#    for i in range(0, len(jso) * 0 + 3):
#        time.sleep(1)
#        url = 'https://osu.ppy.sh/api/v2/users/' + str(jso[i]['user']['id']) + '/scores/best'
#        r = requests.get(url, headers=headers, params=params)
#        print('Mods | ' + str(i + 1) + ': ' + str(r))
#        res.append({})
#        res["id"] = r.json()[i]["id"]
#        res["name"] = r.json()[i][0]["user"]
#        for j in range(0, len(r.json())):
#            res.append(r.json()[j]["pp"])
#            res.append(r.json()[j]["mods"])
#    json.dump(res, comp_file, indent=4)