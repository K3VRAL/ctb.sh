let pool = require('./localapi');

// TODO make checks with osu! and given table for verification that this isn't abused
exports.sqlverifying = ((req, res, renderfile) => {
    res.render(renderfile);
});