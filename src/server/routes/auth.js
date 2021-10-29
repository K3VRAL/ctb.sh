let router = require('express').Router();
let posting = require('../controllers/sqlposting');
let verifying = require('../controllers/sqlverifying');
let webcode = require('../controllers/statcode');

router.post('/addata', (req, res) => {
    posting.sqlposting(req, res, './mysql/addata');
});

// TODO this and fix issue regarding getting data as public (maybe related to scope=identify and now theres a token that needs to be expired in a day? Test this theory out later)
router.get('/login/osu', (req, res) => {
    console.log(req.query);
    if (req.query['code']) {
        if (req.query['code'] === '') {
            webcode.statcode(req, res, '400', 'error');
        } else {
            verifying.sqlverifying(req, res, 'auth');
        }
    } else {
        res.send(`<script>window.location.replace('https://osu.ppy.sh/oauth/authorize?client_id=${process.env.OAPI_CLIENT_ID}&redirect_uri=http://localhost:5000/auth/login/osu&response_type=code&scope=identify');</script>`);
    }
});

router.post('/login/osu', (req, res) => {

});

module.exports = router;