let pool = require('./localapi');

exports.sqlposting = ((req, res, renderfile) => {
    let datas = [];
    // TODO make checks with osu! and given table for verification that this isn't abused
    new Promise((resolve, reject) => {
        // if (req.body['name'] != undefined) {
        //     let post = {
        //         name: req.body['name'],
        //     };
        //     if (req.body['method'] != 'delete') {
        //         post['link'] = req.body['link'];
        //     }

        //     let sql;
        //     switch (req.body['method']) {
        //         case 'insert':
        //             sql = `INSERT INTO ${table} SET ?`;
        //             break;
        //         case 'delete':
        //             sql = `DELETE FROM ${table} WHERE ?`;
        //             break;
        //         case 'update':
        //             sql = `UPDATE ${table} SET link = '${post['link']}' WHERE name = '${post['name']}'`;
        //             break;
        //         default:
        //             reject();
        //             break;
        //     }
        //     pool.query(sql, post, (err, result) => {
        //         if (err) {
        //             throw err;
        //         }
        //     });
        //     resolve();
        // } else {
        //     reject();
        // }
        resolve();
    }).then(() => {
        switch (req.body['method']) {
            case 'insert':
                datas.push(`<p id='title'>Added ${req.body['name']} with link ${req.body['link']} in table ${table}</p>`);
                break;
            case 'delete':
                datas.push(`<p id='title'>Deleted ${req.body['name']} in table ${table}</p>`);
                break;
            case 'update':
                datas.push(`<p id='title'>Updated ${req.body['name']} with link ${req.body['link']} in table ${table}</p>`);
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
        res.render(renderfile, { datas: datas });
    });
});