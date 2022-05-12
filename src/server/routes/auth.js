let router = require('express').Router();
let webcode = require('../controllers/statcode');
let pool = require('../controllers/localapi');

// TODO make checks with osu! and given table for verification that this isn't abused
router.post('/addata', (req, res) => {
    let datas = [];
    new Promise((resolve, reject) => {
        if (req.body['name'] != undefined) {
            let post = {
                name: req.body['name'],
            };
            if (req.body['method'] != 'delete') {
                post['link'] = req.body['link'];
            }

            let sql;
            switch (req.body['method']) {
                case 'insert':
                    sql = `INSERT INTO ${req.body['target']} SET ?`;
                    break;
                case 'delete':
                    sql = `DELETE FROM ${req.body['target']} WHERE ?`;
                    break;
                case 'update':
                    sql = `UPDATE ${req.body['target']} SET link = '${post['link']}' WHERE name = '${post['name']}'`;
                    break;
                default:
                    reject();
                    break;
            }
            pool.query(sql, post, (err, result) => {
                if (err) {
                    throw err;
                }
            });
            resolve();
        }
        reject();
    }).then(() => {
        switch (req.body['method']) {
            case 'insert':
                datas.push(`<p id='title'>Added ${req.body['name']} with link ${req.body['link']} in table ${req.body['target']}</p>`);
                break;
            case 'delete':
                datas.push(`<p id='title'>Deleted ${req.body['name']} in table ${req.body['target']}</p>`);
                break;
            case 'update':
                datas.push(`<p id='title'>Updated ${req.body['name']} with link ${req.body['link']} in table ${req.body['target']}</p>`);
                break;
            default:
                datas.push(`<p id='title'>Wtf did you do? The data was accepted????</p>`);
                break;
        }
    }).catch(() => {
        datas.push(`<p id='title'>Error: Nothing changed.</p>`);
    }).finally(() => {
        datas.push('<p>The page will reload, if the page doesn\'t reload, then idk do something like reload that motherfucker your god-damn-self.</p>');
        datas.push('<p>If the issue still persists, refreshing will not fix the issue since you will be making a POST request rather than your usual GET request so I think just going back a page should fix this.</p>');
        datas.push('<script>setTimeout(() => { window.location = document.referrer }, 2000);</script>');
        res.render('./mysql/addata', { datas: datas });
    });
});

// TODO this and fix issue regarding getting data as public (maybe related to scope=identify and now theres a token that needs to be expired in a day? Test this theory out later)
router.get('/login/osu', (req, res) => {
    if (req.query['code']) {
        if (req.query['code'] === '') {
            webcode.statcode(req, res, '400', 'error');
        } else {
            let processs = require('child_process').spawn('python', ['./src/server/data/osu.py', '2', req.query['code']]);
            processs.stdout.on('data', (data) => {
                console.log(data.toString());
            });
        }
    } else {
        res.send(`<script>window.location.replace('https://osu.ppy.sh/oauth/authorize?client_id=${process.env.OAPI_CLIENT_ID}&redirect_uri=${process.env.OAPI_CLIENT_REDIRECT}&response_type=code&scope=identify');</script>`);
    }
});

module.exports = router;