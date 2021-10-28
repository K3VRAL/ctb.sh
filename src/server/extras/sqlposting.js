let pool = require('./localapi');

// TODO make checks with osu! and given table for verification that this isn't abused
let sqlposting = ((req, res, table) => {
    new Promise((resolve, reject) => {
        if (req.body['name'] != undefined) {
            let post = {
                name: req.body['name'],
            };
            if (req.body['method'] != 'delete') {
                post['link'] = req.body['link'];
            }
            console.log(post);

            if (req.body['method'] == 'insert') {
                let sql = `INSERT INTO ${table} SET ?`;
                pool.query(sql, post, (err, result) => {
                    if (err) {
                        throw err;
                    }
                });
            } else if (req.body['method'] == 'delete') {
                let sql = `DELETE FROM ${table} WHERE ?`;
                pool.query(sql, post, (err, result) => {
                    if (err) {
                        throw err;
                    }
                });
            } else if (req.body['method'] == 'update') {
                let sql = `UPDATE ${table} SET link = '${post['link']}' WHERE name = '${post['name']}'`;
                pool.query(sql, post, (err, result) => {
                    if (err) {
                        throw err;
                    }
                });
            } else {
                reject();
            }
            resolve();
        } else {
            reject();
        }
    }).then(() => {
        if (req.body['method'] == 'insert') {
            res.write(`<p>Added ${req.body['name']} with link ${req.body['link']} in table ${table}</p>`);
        } else if (req.body['method'] == 'delete') {
            res.write(`<p>Deleted ${req.body['name']} in table ${table}</p>`);
        } else if (req.body['method'] == 'update') {
            res.write(`<p>Updated ${req.body['name']} with link ${req.body['link']} in table ${table}</p>`);
        } else {
            res.write('<p>Wtf did you do? The data was accepted????</p>');
        }
        res.write('<p>The page will reload, if the page doesn\'t reload, then idk do something about it. Refreshing will not fix the issue since you will be make a POST request rather than your usual GET request.</p><script>setTimeout(() => { window.location = window.location.protocol + \'//\' + window.location.host + window.location.pathname + window.location.search }, 2000);</script>');
    }).catch(() => {
        res.write('<p>Was unable to do anything with the data</p><script>setTimeout(() => { window.location = window.location.protocol + \'//\' + window.location.host + window.location.pathname + window.location.search }, 2000);</script>');
    });
});

module.exports = sqlposting;