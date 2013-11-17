/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./database_connector');
var dbCon = new db.DbConnector('localhost', 'foodpantry', 'cs4400');
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
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    res.render('index', {name : 'food pantry'});
});

app.get('/users', function(req, res) {
    var con = dbCon.makeConnection();
    con.connect();
    con.query('SELECT Name FROM Client', function(err, rows, fields) {
        if(err) {throw err;}
        res.render('user', {data : rows});
    });
    con.end();
});



//NEED:
//Menu, Login, Home, Pickups, Pickup Confirmation, 
//Drop Off, New Drop Off, Clients, Clients with Search (Search)
//New Client, Add Additional Family Members for Client, 
//Hunger Relief Bag List, Edit Bag, Product List (Search), 
//New Inventory, Monthly Service Report, Grocery List Report





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
