let router = require('express').Router();
let request = require('request');
require('dotenv').config();
let pool = require('../extras/localapi');
let posting = require('../extras/sqlposting');

new Promise((resolve) => {
    pool.query('SHOW tables', (err, result) => {
        if (err) {
            throw err;
        }
        let arr = []
        for (let i = 0; i < result.length; i++) {
            arr.push(result[i]['Tables_in_ctbsh_database']);
        }
        resolve(arr);
    });
}).then((tablelist) => {
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

    let discord_servers = tablelist[0];
    router.get(`/${discord_servers}`, (req, res) => {
        pool.query(`SELECT * FROM ${discord_servers}`, (err, result) => {
            if (err) {
                throw err;
            }
            new Promise((resolve) => {
                let splitting = discord_servers.split('_');
                let newstring = '';
                for (let i = 0; i < splitting.length; i++) {
                    newstring += splitting[i].charAt(0).toUpperCase() + splitting[i].slice(1) + ' ';
                }
                resolve(newstring.slice(0, newstring.length-1));
            }).then((msg) => {
                res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
            });
        });
    });
    // router.post(`/${discord_servers}`, (req, res) => {
    //     posting(req, res, `${discord_servers}`);
    // });

    let external_websites = tablelist[1];
    router.get(`/${external_websites}`, (req, res) => {
        pool.query(`SELECT * FROM ${external_websites}`, (err, result) => {
            if (err) {
                throw err;
            }

            new Promise((resolve) => {
                let splitting = external_websites.split('_');
                let newstring = '';
                for (let i = 0; i < splitting.length; i++) {
                    newstring += splitting[i].charAt(0).toUpperCase() + splitting[i].slice(1) + ' ';
                }
                resolve(newstring.slice(0, newstring.length-1));
            }).then((msg) => {
                res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
            });
        });
    });
    // router.post(`/${external_websites}`, (req, res) => {
    //     posting(req, res, `${external_websites}`);
    // });

    let github_projects = tablelist[2];
    router.get(`/${github_projects}`, (req, res) => {
        pool.query(`SELECT * FROM ${github_projects}`, (err, result) => {
            if (err) {
                throw err;
            }

            new Promise((resolve) => {
                let splitting = github_projects.split('_');
                let newstring = '';
                for (let i = 0; i < splitting.length; i++) {
                    newstring += splitting[i].charAt(0).toUpperCase() + splitting[i].slice(1) + ' ';
                }
                resolve(newstring.slice(0, newstring.length-1));
            }).then((msg) => {
                res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
            });
        });
    });
    // router.post(`/${github_projects}`, (req, res) => {
    //     posting(req, res, `${github_projects}`);
    // });

    let twitch_streamers = tablelist[3];
    router.get(`/${twitch_streamers}`, (req, res) => {
        pool.query(`SELECT * FROM ${twitch_streamers}`, (err, result) => {
            if (err) {
                throw err;
            }

            new Promise((resolve) => {
                let splitting = twitch_streamers.split('_');
                let newstring = '';
                for (let i = 0; i < splitting.length; i++) {
                    newstring += splitting[i].charAt(0).toUpperCase() + splitting[i].slice(1) + ' ';
                }
                resolve(newstring.slice(0, newstring.length-1));
            }).then((msg) => {
                res.render('./pages/osu/index', { currpage: msg, pages: result, addata: true });
            });
        });
    });
    // router.post(`/${twitch_streamers}`, (req, res) => {
    //     posting(req, res, `${twitch_streamers}`);
    // });

    let youtube_creators = tablelist[4];
    router.get(`/${youtube_creators}`, (req, res) => {
        pool.query(`SELECT * FROM ${youtube_creators}`, (err, result) => {
            if (err) {
                throw err;
            }
            
            // TODO make it so that it doesn't skip the other datas
            // new Promise((resolve) => {
            //     let newresult = [];
            //     for (let i = 0; i < result.length; i++) {
            //         request.get({url: 'https://www.googleapis.com/youtube/v3/channels', qs: { part: 'statistics', key: process.env.YT_KEY, id: result[i].link.split('/')[result[i].link.split('/').length-1] }, json: true }, (err, res, body) => {
            //             if (err) {
            //                 throw err;
            //             }
            //             newresult.unshift(body['items'][0]['statistics']['subscriberCount'], body['items'][0]['statistics']['videoCount']);
            //         });
            //     }
            //     resolve(newresult);
            // }).then((message) => {
            //     console.log(message);
            // });
            res.render('./pages/osu/index', { currpage: 'YouTube Creators', pages: result, addata: true });
        });
    });
    // router.post(`/${youtube_creators}`, (req, res) => {
    //     posting(req, res, ${youtube_creators});
    // });
});

module.exports = router;