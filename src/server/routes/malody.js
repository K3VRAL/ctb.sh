let router = require('express').Router();
let pool = require('../controllers/localapi');
let specific = require('../controllers/specificdata');
let title = require('../controllers/titleformat');
let type = 'malody';
let discord_servers = 'discord_servers',
    external_websites = 'external_websites', 
    github_projects = 'github_projects', 
    twitch_streamers = 'twitch_streamers', 
    youtube_creators = 'youtube_creators',
    mobile_rankings = 'mobile_rankings',
    pc_rankings = 'pc_rankings';

router.get('/', (req, res) => {
    new Promise((resolve) => {
        pool.query('SHOW tables', (err, result) => {
            if (err) {
                throw err;
            }
            let arr = []
            for (let i = 0; i < result.length; i++) {
                if (result[i]['Tables_in_ctbsh_database'].charAt(0) != '_') {
                    arr.push(result[i]['Tables_in_ctbsh_database']);
                }
            }
            resolve(specific.data(arr, type));
        });
    }).then((tablelist) => {
        new Promise((resolve) => {
            let newresult = [];
            for (let i = 0; i < tablelist.length; i++) {
                let splitting = tablelist[i].split('_');
                let newstring = '';
                for (let i = 0; i < splitting.length; i++) {
                    newstring += splitting[i].charAt(0).toUpperCase() + splitting[i].slice(1) + ' ';
                }
                newresult.push({ name: newstring.slice(0, newstring.length-1), link: tablelist[i] });
            }
            resolve(newresult);
        }).then((msg) => {
            res.render('./pages/malody/index', { currpage: 'malody!ctb - Main Page', pages: msg, addata: false });
        });
    });
});

router.get(`/${discord_servers}`, (req, res) => {
    pool.query(`SELECT * FROM ${type}_${discord_servers}`, (err, result) => {
        if (err) {
            throw err;
        }
        new Promise((resolve) => {
            resolve(title.format(discord_servers));
        }).then((msg) => {
            res.render('./pages/malody/index', { currpage: msg, pages: result, addata: true });
        });
    });
});

router.get(`/${external_websites}`, (req, res) => {
    pool.query(`SELECT * FROM ${type}_${external_websites}`, (err, result) => {
        if (err) {
            throw err;
        }

        new Promise((resolve) => {
            resolve(title.format(external_websites));
        }).then((msg) => {
            res.render('./pages/malody/index', { currpage: msg, pages: result, addata: true });
        });
    });
});

router.get(`/${github_projects}`, (req, res) => {
    pool.query(`SELECT * FROM ${type}_${github_projects}`, (err, result) => {
        if (err) {
            throw err;
        }

        new Promise((resolve) => {
            resolve(title.format(github_projects));
        }).then((msg) => {
            res.render('./pages/malody/index', { currpage: msg, pages: result, addata: true });
        });
    });
});

router.get(`/${twitch_streamers}`, (req, res) => {
    pool.query(`SELECT * FROM ${type}_${twitch_streamers}`, (err, result) => {
        if (err) {
            throw err;
        }

        new Promise((resolve) => {
            resolve(title.format(twitch_streamers));
        }).then((msg) => {
            res.render('./pages/malody/index', { currpage: msg, pages: result, addata: true });
        });
    });
});

router.get(`/${youtube_creators}`, (req, res) => {
    pool.query(`SELECT * FROM ${type}_${youtube_creators}`, (err, result) => {
        if (err) {
            throw err;
        }
        
        // TODO make it so that it doesn't skip the other datas
        // new Promise((resolve) => {
        //     let newresult = [];
        //     for (let i = 0; i < result.length; i++) {
        //         let data = {
        //             url: 'https://www.googleapis.com/youtube/v3/channels',
        //             qs: {
        //                 part: 'statistics',
        //                 key: process.env.YT_KEY,
        //                 id: result[i].link.split('/')[result[i].link.split('/').length-1]
        //             },
        //             json: true
        //         }
        //         request.get(data, (err, res, body) => {
        //             if (err) {
        //                 throw err;
        //             }
        //             newresult.push({ 'name': result[i].name, 'subscriberCount': body['items'][0]['statistics']['subscriberCount'], 'videoCount': body['items'][0]['statistics']['videoCount'] });
        //         });
        //     }
        //     resolve(newresult);
        // }).then((message) => {
        //     console.log(message);
        // });
        new Promise((resolve) => {
            resolve(title.format(youtube_creators));
        }).then((msg) => {
            res.render('./pages/malody/index', { currpage: msg, pages: result, addata: true });
        });
    });
});

router.get(`/${mobile_rankings}`, (req, res) => {
    let query = `SELECT * FROM ${type}_${mobile_rankings} ORDER BY first ASC LIMIT 0, 50;`;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        }

        pool.query(`DESCRIBE ${type}_${mobile_rankings}`, (err, result2) => {
            if (err) {
                throw err;
            }

            new Promise((resolve) => {
                resolve(title.format(mobile_rankings));
            }).then((msg) => {
                res.render('./pages/malody/rankings', { currpage: msg, keys: result2, datas: result, order: null, ascdesc: null });
            });
        });
    });
});
router.post(`/${mobile_rankings}`, (req, res) => {
    let orderby = "ORDER BY ";
    switch (req.body['order']) {
        case "name":
            orderby += req.body['order'];
            break;
        case "score":
        case "combo":
        case "first":
        case "amountplayed":
            orderby += `CAST(\`${req.body['order']}\` AS UNSIGNED)`;
            break;
        case "acc":
            orderby += `CAST(\`${req.body['order']}\` AS DECIMAL(3,2))`
            break;
        case "title":
            orderby += `CAST(SUBSTRING_INDEX(${req.body['order']}, '/', 1) AS UNSIGNED)`
            break;
        case "maprank": // TODO
        case "mods":
        default:
            orderby += "first";
            break;
    }
    let ascdesc = req.body['ascdesc'] == "ASC" ? "ASC" : req.body['ascdesc'] == "DESC" ? "DESC" : "ASC";
    let limit = `LIMIT ` + (!isNaN(req.body['page']) ? Number(req.body['page']) * 50 : 0) + `, 50`;
    let query = `SELECT * FROM ${type}_${mobile_rankings} ${orderby} ${ascdesc} ${limit};`; // req.body['method'] == 'sort' || req.body["method"] == "more"
    let extra;
    if (req.body['method'] == 'search' && req.body['search'] != 0) {
        query = `SELECT * FROM ${type}_${mobile_rankings} WHERE name = ?;`;
        extra = req.body['search'];
    }

    pool.query(query, extra, (err, result) => {
        if (err) {
            throw err;
        }

        if (req.body["method"] == "more") {
            res.send({ datas: result });
        } else {
            pool.query(`DESCRIBE ${type}_${mobile_rankings}`, (err, result2) => {
                if (err) {
                    throw err;
                }
                new Promise((resolve) => {
                    resolve(title.format(mobile_rankings));
                }).then((msg) => {
                    res.render('./pages/malody/rankings', { currpage: msg, keys: result2, datas: result, order: req.body['order'], ascdesc: req.body['ascdesc'] });
                });
            });
        }
    });
});

router.get(`/${pc_rankings}`, (req, res) => {
    pool.query(`SELECT * FROM ${type}_${pc_rankings} ORDER BY first ASC LIMIT 0, 50;`, (err, result) => {
        if (err) {
            throw err;
        }
        
        pool.query(`DESCRIBE ${type}_${pc_rankings}`, (err, result2) => {
            if (err) {
                throw err;
            }

            new Promise((resolve) => {
                resolve(title.format(pc_rankings));
            }).then((msg) => {
                res.render('./pages/malody/rankings', { currpage: msg, keys: result2, datas: result, order: null, ascdesc: null });
            });
        });
    });
});
router.post(`/${pc_rankings}`, (req, res) => {
    let orderby = "ORDER BY ";
    switch (req.body['order']) {
        case "name":
            orderby += req.body['order'];
            break;
        case "score":
        case "combo":
        case "first":
        case "amountplayed":
            orderby += `CAST(\`${req.body['order']}\` AS UNSIGNED)`;
            break;
        case "acc":
            orderby += `CAST(\`${req.body['order']}\` AS DECIMAL(3,2))`
            break;
        case "title":
            orderby += `CAST(SUBSTRING_INDEX(${req.body['order']}, '/', 1) AS UNSIGNED)`
            break;
        case "maprank": // TODO
        case "mods":
        default:
            orderby += "first";
            break;
    }
    let ascdesc = req.body['ascdesc'] == "ASC" ? "ASC" : req.body['ascdesc'] == "DESC" ? "DESC" : "ASC";
    let limit = `LIMIT ` + (!isNaN(req.body['page']) ? Number(req.body['page']) * 50 : 0) + `, 50`;
    let query = `SELECT * FROM ${type}_${pc_rankings} ${orderby} ${ascdesc} ${limit};`; // req.body['method'] == 'sort' || req.body["method"] == "more"
    let extra;
    if (req.body['method'] == 'search' && req.body['search'] != 0) {
        query = `SELECT * FROM ${type}_${pc_rankings} WHERE name = ?;`;
        extra = req.body['search'];
    }
    
    pool.query(query, extra, (err, result) => {
        if (err) {
            throw err;
        }

        if (req.body["method"] == "more") {
            res.send({ datas: result });
        } else {
            pool.query(`DESCRIBE ${type}_${pc_rankings}`, (err, result2) => {
                if (err) {
                    throw err;
                }
                new Promise((resolve) => {
                    resolve(title.format(pc_rankings));
                }).then((msg) => {
                    res.render('./pages/malody/rankings', { currpage: msg, keys: result2, datas: result, order: req.body['order'], ascdesc: req.body['ascdesc'] });
                });
            });
        }
    });
});

module.exports = router;