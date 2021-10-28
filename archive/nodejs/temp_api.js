let express = require('express');
let mysql = require('mysql');
require('dotenv').config();

let db = mysql.createConnection({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
db.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log('MySQL connected')
});

let app = express();
app.set('port', process.env.PORT || 5000);

app.get('/addthing', function(req, res) {
    let post = {
        name: 'Guy',
        description: 'Random Description'
    };
    let sql = 'INSERT INTO bruh SET ?';
    db.query(sql, post, function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('Added thing');
    });
});

app.get('/getthing', function(req, res) {
    let sql = 'SELECT * FROM bruh';
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('Getting thing');
    });
});

app.get('/getsinglething/:id', function(req, res) {
    let sql = `SELECT * FROM bruh WHERE id = ${req.params.id}`;
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('Getting single thing');
    });
});

app.get('/updatething/:id', function(req, res) {
    let post = {name: 'Not that guy', description: 'Seriously? How did you fuck up. smh'}
    let sql = `UPDATE bruh SET ? WHERE id = ${req.params.id}`;
    db.query(sql, post, function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('Updating single thing');
    });
});

app.get('/deletething/:id', function(req, res) {
    let sql = `DELETE FROM bruh WHERE id = ${req.params.id}`;
    db.query(sql, function(err, result) {
        if (err) {
            throw err;
        }
        console.log(result);
        res.send('Deleting single thing');
    });
});

app.listen(app.get('port'), function() {
    console.log(`Server at port: ${app.get('port')}`);
});