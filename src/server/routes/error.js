let router = require('express').Router();
let webcode = require('../controllers/statcode');

let index = 'error';

router.use((req, res) => {
    webcode.statcode(req, res, '404', index)
});

module.exports = router;