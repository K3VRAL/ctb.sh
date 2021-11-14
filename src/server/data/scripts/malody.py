# TODO allow the ripped data to also be calculated by difficulty and put a ranking

import requests
import os
import json
import re
import sys
import time
import bs4

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import controlr

def MalodyRankings(data, table):
    table_done = True
    c_table = ''
    i_table = ''
    i_data = []

    players = []
    for x in range(0, len(data)):
        for y in range(0, len(data[x]['data'])):
            found = False
            i = -1
            for z in range(0, len(players)): 
                if players and data[x]['data'][y]['name'] == players[z]['name']:
                    found = True
                    i = z
                    break
            if found:
                if data[x]['data'][y]['maprank'] == '1':
                    players[i]['first'] = str(int(data[x]['data'][y]['maprank']) + int(players[i]['first']))
                players[i]['maprank'] = str(int(data[x]['data'][y]['maprank']) + int(players[i]['maprank']))
                players[i]['score'] = str(int(data[x]['data'][y]['score']) + int(players[i]['score']))
                players[i]['combo'] = str(int(data[x]['data'][y]['combo']) + int(players[i]['combo']))
                players[i]['acc'] = '{}%'.format(round((float(data[x]['data'][y]['acc'].strip('%')) + float(players[i]['acc'].strip('%'))) / 2, 2))
                # players[i]['mods'] += data[x]['data'][y]['mods'] # TODO mod usage and count
                tdata = data[x]['data'][y]['title'].split('/')
                tplyr = players[i]['title'].split('/')
                players[i]['title'] = '{}/{}/{}/{}'.format(int(tdata[0]) + int(tplyr[0]), int(tdata[1]) + int(tplyr[1]), int(tdata[2]) + int(tplyr[2]), int(tdata[3]) + int(tplyr[3]))
                players[i]['amountplayed'] = str(int(players[i]['amountplayed']) + 1)
            else:
                keys = list(data[x]['data'][y].keys())
                players.append({})
                for z in range(0, len(keys)):
                    players[len(players)-1][keys[z]] = data[x]['data'][y][keys[z]]
                if data[x]['data'][y]['maprank'] == '1':
                    players[len(players)-1]['first'] = '1'
                else:
                    players[len(players)-1]['first'] = '0'
                players[len(players)-1]['amountplayed'] = '1'
        if table_done:
            keys = list(players[0].keys())
            for z in range(0, len(keys)):
                if (keys[z] == 'mod'): # Apparently mysql can't have 'mod' as a name, that's stupid lol
                    c_table += 'mods TEXT, '
                    i_table += 'mods, '
                else:
                    c_table += '{} TEXT, '.format(keys[z])
                    i_table += '{}, '.format(keys[z])
            c_table = c_table[:len(c_table)-2]
            i_table = i_table[:len(i_table)-2]
            table_done = False

    for i in range(0, len(players)): # TODO remove this
        for j in range(0, len(players)):
            if i != j and players[i] == players[j]:
                print('FOUND DUPLICATE: {} - {}'.format(i, j))

    for x in range(0, len(players)):
        i_data.append(('',))
        keys = list(players[x].keys())
        for y in range(0, len(keys)):
            i_data[x] += ('{}'.format(players[x][keys[y]]),)
        i_data[x] = i_data[x][1:]

    sqldata = {}
    sqldata['table'] = table
    sqldata['c_table'] = c_table
    sqldata['i_table'] = i_table
    sqldata['i_data'] = i_data
    return sqldata

# What a fucking nightmare
def RequestingChart(data, pc = False):
    headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json'
    }
    params = {
        'html'          : 1,
        'from'          : 1
    }
    mpname = 'Mobile'
    if pc:
        params['from'] = 0
        mpname = 'PC'
    deldata = []
    for i in range(0, len(data)):
        r = requests.get('https://m.mugzone.net/score/{}'.format(data[i]['id']), headers=headers, params=params)
        print('ReqChart{}\t-\t{}\t-\t{}'.format(mpname, i, r), end = '\r')
        if r.ok and r.status_code == 200 and 'code' in r.json():
            if 'data' in r.json():
                soup = bs4.BeautifulSoup(r.json()['data'].replace('\n', '').replace('\t', '').replace('\"', ''), 'html.parser')
                soup.find('div', class_ = 'list_head').extract()
                while True:
                    soup.find(class_ = 'rank').extract()
                    if not soup.find(class_ = 'rank'):
                        break
                
                data[i]['data'] = []
                for j in soup.find('ul'):
                    store = {}
                    store['name'] = j.find(class_ = 'name').a.text
                    store['link'] = j.find(class_ = 'name').a.attrs['href'].split('/')[len(j.span.a.attrs['href'].split('/'))-1]
                    srank = str(re.sub(re.compile('<.*?>'), '', str(j.find(class_ = 'ranknum'))))
                    if srank == 'None':
                        srank = list(j.find(class_ = 'label').attrs.keys())[len(list(j.find(class_ = 'label').attrs.keys()))-1][4:]
                    store['maprank'] = srank
                    store['score'] = j.find(class_ = 'score').text
                    store['combo'] = j.find(class_ = 'combo').text
                    store['acc'] = j.find(class_ = 'acc').em.text
                    smod = '' # TODO mod usage and count
                    if j.find(class_ = 'mod').text != 'None':
                        for k in j.find(class_ = 'mod'):
                            smod += '{}-'.format(list(k.attrs.keys())[len(list(k.attrs.keys()))-1][6:])
                        smod = smod[:len(smod)-1]
                    store['mod'] = smod
                    store['title'] = j.attrs['class'][0].split('=')[1]
                    data[i]['data'].append(store)
            else:
                deldata.append(i)
            time.sleep(1)
        else:
            print('Failed Requesting Chart: ' + str(r))
            exit(1)
    if deldata:
        for i in range(0, len(deldata)):
            del data[deldata[i]]
    print()
    return data

def RequestingChartList():
    headers = {
        'Content-Type'  : 'application/json',
        'Accept'        : 'application/json'
    }
    params = {
        'status'        : 2,
        'mode'          : 3,
        'page'          : 0
    }
    tpages = requests.get('https://m.mugzone.net/page/chart/filter', headers=headers, params=params).json()['data']['total']
    data = []
    for i in range(0, tpages):
        params['page'] = i
        r = requests.get('https://m.mugzone.net/page/chart/filter', headers=headers, params=params)
        print('ReqChartList\t-\t{}\t-\t{}'.format(i, r), end = '\r')
        if r.ok or r.status_code != status_code:
            for j in r.json()['data']['list']:
                data.append({ 'id' : j['id'] })
            time.sleep(1)
        else:
            print('Failed Requesting Chart List: ' + str(r))
            exit(1)
    print()
    return data

class flags:
    request = False

def main(argv):
    for i in argv:
        if i[0] == '-':
            if i == '-r' or i == '--request':
                flags.request = True

    if flags.request:
        t1 = time.time()
        charts = RequestingChartList()
        controlr.AddingToMySQL(MalodyRankings(RequestingChart(charts), 'malody_mobile_rankings'))
        controlr.AddingToMySQL(MalodyRankings(RequestingChart(charts, True), 'malody_pc_rankings'))
        t2 = time.time()
        print('Took {} seconds'.format(round(t2 - t1, 2)))
    
    if not (flags.request):
        print('Did nothing.')
        exit(1)

if __name__ == '__main__':
    main(sys.argv[1:])