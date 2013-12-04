var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./database_connector');
var dbCon = new db.DbConnector('localhost', 'foodpantry', 'cs4400');
var middleware = require('./middleware');
var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('ip', process.env.IP || 'localhost');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride()); //for app.put
app.use(express.bodyParser()); // for getting post params


// app.use(requireLogin);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var sql = function(query, callback) 
{
    var con = dbCon.makeConnection();
    con.connect();
    con.query(query, callback);
    con.end();
}

app.get('/', function(req, res) {
    return res.redirect('/home');
});

//HOME (Figure 2)
app.get('/home', function(req, res) {
    return res.render('home');
});

require('./app/login.js')(app, sql);
require('./app/clients')(app, sql);
require('./app/pickups')(app, sql);
require('./app/dropoffs')(app, sql);
require('./app/bags')(app, sql);
require('./app/products')(app, sql);
require('./app/reports')(app, sql);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});