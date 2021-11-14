let router = require('express').Router();
let pool = require('../controllers/localapi');
let specific = require('../controllers/specificdata');
let title = require('../controllers/titleformat');
let type = 'malody';

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
    let mobile_rankings = 'mobile_rankings';

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
            res.render('./pages/malody/index', { currpage: 'malody!ctb - Main Page', pages: msg, addata: false });
        });
    });

    router.get(`/${mobile_rankings}`, (req, res) => {
        pool.query(`SELECT * FROM ${type}_${mobile_rankings}`, (err, result) => {
            if (err) {
                throw err;
            }
            
            new Promise((resolve) => {
                resolve(title.format(mobile_rankings));
            }).then((msg) => {
                res.render('./pages/malody/rankings', { currpage: msg, datas: result });
            });
        });
    });
});

module.exports = router;