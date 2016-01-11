var express = require("express"),
    ejs = require('ejs'),
    routes = require('./server/routes.js'),
    app;

app = express();
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');
routes(app);
app.listen(8080);
console.log('server running at port 8080');
