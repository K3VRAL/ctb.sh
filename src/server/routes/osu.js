let router = require('express').Router();
// let request = require('request');
require('dotenv').config();
let pool = require('../controllers/localapi');
let specific = require('../controllers/specificdata');
let title = require('../controllers/titleformat');
let type = 'osu';

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
    let discord_servers = 'discord_servers',
        external_websites = 'external_websites', 
        github_projects = 'github_projects', 
        twitch_streamers = 'twitch_streamers', 
        youtube_creators = 'youtube_creators',
        rankings = 'rankings';

    router.get('/', (req, res) => {
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
        pool.query(`SELECT * FROM ${type}_${rankings}`, (err, result) => {
            if (err) {
                throw err;
            }
            
            new Promise((resolve) => {
                resolve(title.format(rankings));
            }).then((msg) => {
                res.render('./pages/osu/rankings', { currpage: msg, datas: result });
            });
        });
    });
});

module.exports = router;