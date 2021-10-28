let router = require('express').Router();

router.use((req, res) => {
    res.status(404).render('404', { whatsthis: req.path});
});

module.exports = router;