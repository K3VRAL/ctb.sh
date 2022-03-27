# TODO allow the ripped data to also be calculated by difficulty and put a ranking

import requests
import os
import json
import re
import sys
import time
import bs4

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def dprint(prnt, end = ''):
    if flags.debug:
        print(prnt, end)

def MalodyRankings(json_table, data, table):
    i_table = ''
    i_data = []
    if json_table:
        table_done = True
        c_table = ''

    players = []
    for x in data:
        if "data" in x:
            for y in x['data']:
                found = False
                i = -1
                for z in range(0, len(players)): 
                    if players and y['name'] == players[z]['name']:
                        found = True
                        i = z
                        break
                if found:
                    if y['maprank'] == '1':
                        players[i]['first'] = str(int(y['maprank']) + int(players[i]['first']))
                    players[i]['maprank'] = str(int(y['maprank']) + int(players[i]['maprank']))
                    players[i]['score'] = str(int(y['score']) + int(players[i]['score']))
                    players[i]['combo'] = str(int(y['combo']) + int(players[i]['combo']))
                    players[i]['acc'] = '{}%'.format(round((float(y['acc'].strip('%')) + float(players[i]['acc'].strip('%'))) / 2, 2))
                    # players[i]['mods'] += y['mods'] # TODO mod usage and count
                    tdata = y['title'].split('/')
                    tplyr = players[i]['title'].split('/')
                    players[i]['title'] = '{}/{}/{}/{}'.format(int(tdata[0]) + int(tplyr[0]), int(tdata[1]) + int(tplyr[1]), int(tdata[2]) + int(tplyr[2]), int(tdata[3]) + int(tplyr[3]))
                    players[i]['amountplayed'] = str(int(players[i]['amountplayed']) + 1)
                else:
                    keys = list(y.keys())
                    players.append({})
                    for z in keys:
                        players[len(players)-1][z] = y[z]
                    if y['maprank'] == '1':
                        players[len(players)-1]['first'] = '1'
                    else:
                        players[len(players)-1]['first'] = '0'
                    players[len(players)-1]['amountplayed'] = '1'
        if json_table and table_done:
            for z in list(players[0].keys()):
                if (z == 'mod'): # Apparently mysql can't have 'mod' as a name
                    c_table += 'mods TEXT, '
                    i_table += 'mods, '
                else:
                    c_table += '{} TEXT, '.format(z)
                    i_table += '{}, '.format(z)
            c_table = c_table[:len(c_table)-2]
            i_table = i_table[:len(i_table)-2]
            table_done = False

    for x in range(0, len(players)):
        i_data.append(('',))
        keys = list(players[x].keys())
        for y in keys:
            i_data[x] += ('{}'.format(players[x][y]),)
        i_data[x] = i_data[x][1:]

    sqldata = {}
    sqldata['table'] = table
    if json_table:
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
    for i in range(0, len(data)):
        r = requests.get('https://m.mugzone.net/score/{}'.format(data[i]['id']), headers = headers, params = params)
        dprint('ReqChart{}\t-\t{}\t-\t{}'.format(mpname, i, r), end = '\r')
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
            dprint('Failed Requesting Chart: ' + str(r))
            exit(1)
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
    tpages = requests.get('https://m.mugzone.net/page/chart/filter', headers = headers, params = params).json()['data']['total']
    data = []
    for i in range(0, tpages):
        params['page'] = i
        r = requests.get('https://m.mugzone.net/page/chart/filter', headers = headers, params = params)
        dprint('ReqChartList\t-\t{}\t-\t{}'.format(i, r), end = '\r')
        if r.ok or r.status_code != status_code:
            for j in r.json()['data']['list']:
                data.append({ 'id' : j['id'] })
        else:
            dprint('Failed Requesting Chart List: ' + str(r))
            exit(1)
    return data

class flags:
    request = False
    debug = False
    ignore = False

def main(argv):
    for i in argv:
        if i[0] == '-':
            if i == '-r' or i == '--request':
                flags.request = True
            if i == '-d' or i == '--debug':
                flags.debug = True
            if i == '-i' or i == '--ignore':
                flags.ignore = True

    if flags.request:
        t1 = time.time()
        charts = RequestingChartList()
        dataMobile = MalodyRankings(not flags.ignore, RequestingChart(charts), 'malody_mobile_rankings')
        dataPC = MalodyRankings(not flags.ignore, RequestingChart(charts, True), 'malody_pc_rankings')
        t2 = time.time()
        dprint(dataMobile)
        dprint(dataPC)
        dprint('Took {} seconds'.format(round(t2 - t1, 2)))
        if not flags.ignore:
            import controlr
            controlr.AddingToMySQL(dataMobile)
            controlr.AddingToMySQL(dataPC)
    
    if not flags.request:
        print('Did nothing.')

if __name__ == '__main__':
    main(sys.argv[1:])