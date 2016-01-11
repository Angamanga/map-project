var express = require("express"),
    ejs = require('ejs'),
    routes = require('./server/routes.js'),
    app;

app = express();
//setting view-folder and view-engine
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/');

routes(app);

//starting server
app.listen(8080);
console.log('server running at port 8080');
