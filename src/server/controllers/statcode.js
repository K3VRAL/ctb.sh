exports.statcode = ((req, res, statcode, renderfile) => {
    res.status(statcode).render(renderfile, { error: statcode, whatsthis: req.path });
});