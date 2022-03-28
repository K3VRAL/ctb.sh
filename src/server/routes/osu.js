let router = require('express').Router();
// let request = require('request');
require('dotenv').config();
let pool = require('../controllers/localapi');
let specific = require('../controllers/specificdata');
let title = require('../controllers/titleformat');
let type = 'osu';
let discord_servers = `discord_servers`,
    external_websites = `external_websites`, 
    github_projects = `github_projects`, 
    twitch_streamers = `twitch_streamers`, 
    youtube_creators = `youtube_creators`,
    rankings = `rankings`;

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
            res.render('./pages/osu/index', { currpage: 'osu!ctb - Main Page', pages: msg, addata: false });
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
            res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
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
            res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
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
            res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
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
            res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
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
            res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
        });
    });
});

router.get(`/${rankings}`, (req, res) => {
    let query = `SELECT * FROM ${type}_${rankings} ORDER BY CAST(\`global_rank\` AS UNSIGNED) ASC LIMIT 0, 50;`;
    pool.query(query, (err, result) => {
        if (err) {
            throw err;
        }

        pool.query(`DESCRIBE ${type}_${rankings}`, (err, result2) => {
            if (err) {
                throw err;
            }

            new Promise((resolve) => {
                resolve(title.format(rankings));
            }).then((msg) => {
                res.render('./pages/osu/rankings', { currpage: msg, keys: result2, datas: result, order: null, ascdesc: null });
            });
        });
    });
});
router.post(`/${rankings}`, (req, res) => {
    let orderby = "ORDER BY ";
    switch (req.body['order']) {
        case "user_default_group":
        case "user_username":
            orderby += req.body['order'];
            break;
        case "level_current":
        case "level_progress":
        case "global_rank":
        case "ranked_score":
        case "play_count":
        case "play_time":
        case "total_score":
        case "total_hits":
        case "maximum_combo":
        case "replays_watched_by_others":
        case "grade_counts_ss":
        case "grade_counts_ssh":
        case "grade_counts_s":
        case "grade_counts_sh":
        case "grade_counts_a":
        case "user_id":
        case "scores_first_count":
        case "follower_count":
        case "post_count":
        case "kudosu_total":
        case "kudosu_available":
        case "ranked_beatmapset_count":
        case "loved_beatmapset_count":
        case "graveyard_beatmapset_count":
        case "pending_beatmapset_count":
        case "mapping_follower_count":
        case "user_achievements":
            orderby += `CAST(\`${req.body['order']}\` AS UNSIGNED)`;
            break;
        case "pp":
            orderby += `CAST(\`${req.body['order']}\` AS DECIMAL(9,1))`
            break;
        case "hit_accuracy":
            orderby += `CAST(\`${req.body['order']}\` AS DECIMAL(3,4))`
            break;
        default:
            orderby += "global_rank";
            break;
    }
    let ascdesc = req.body['ascdesc'] == "ASC" ? "ASC" : "DESC";
    let limit = `LIMIT ` + (!isNaN(req.body['page']) ? Number(req.body['page']) * 50 : 0) + `, 50`;
    let query = `SELECT * FROM ${type}_${rankings} ${orderby} ${ascdesc} ${limit};`; // req.body['method'] == 'sort' || req.body["method"] == "more"
    let extra;
    if (req.body['method'] == 'search' && req.body['search'] != 0) {
        query = `SELECT * FROM ${type}_${rankings} WHERE user_username = ?;`;
        extra = req.body['search'];
    }

    pool.query(query, extra, (err, result) => {
        if (err) {
            throw err;
        }

        if (req.body["method"] == "more") {
            res.send({ datas: result });
        } else {
            pool.query(`DESCRIBE ${type}_${rankings}`, (err, result2) => {
                if (err) {
                    throw err;
                }
                new Promise((resolve) => {
                    resolve(title.format(rankings));
                }).then((msg) => {
                    res.render('./pages/osu/rankings', { currpage: msg, keys: result2, datas: result, order: req.body['order'], ascdesc: req.body['ascdesc'] });
                });
            });
        }
    });
});

module.exports = router;