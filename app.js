let express = require('express');

// Port
let app = express();
app.set('port', process.env.PORT || 5000);

// Templating Engine
app.set('view engine', 'ejs');
app.set('views', './src/server/views');

// Static Files
app.use(express.static('src/client'));
app.use('/css', express.static(__dirname + 'src/client/css'));
app.use('/img', express.static(__dirname + 'src/client/img'));
app.use('/js', express.static(__dirname + 'src/client/js'));

// JSON Type POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./src/server/routes/index'));
app.use('/osu', require('./src/server/routes/osu'));
app.use('/malody', require('./src/server/routes/malody'));
app.use(require('./src/server/routes/404'));

// Listening
app.listen(app.get('port'), () => {
    console.log(`Server started at port: ${app.get('port')}`);
});