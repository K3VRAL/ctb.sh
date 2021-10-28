let router = require('express').Router();

router.get('/', (req, res) => {
    res.render('./pages/malody/index');
});

module.exports = router;