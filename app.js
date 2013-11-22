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
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    res.render('index', {name : 'food pantry'});
});

//NEED:
//Menu, Login, Home, Pickups, Pickup Confirmation, 
//Drop Off, New Drop Off, Clients, Clients with Search (Search)
//New Client, Add Additional Family Members for Client, 
//Hunger Relief Bag List, Edit Bag, Product List (Search), 
//New Inventory, Monthly Service Report, Grocery List Report

app.get('/users', function(req, res)
	{
		
		var con = dbCon.makeConnection();
		con.connect();
		con.query('SELECT * FROM Client', function(err, rows, fields)
		{	
			if(err){throw err;}
			res.send(rows);
		});
		
		con.end();	
		
	});

app.get('/users/:clientName/:telephone', function(req, res) 
{		
    var con = dbCon.makeConnection();
    con.connect();
	
	var cn = req.params.clientName;
	var tp = req.params.telephone;
	if(!cn)
		cn = "";
	if(!tp)
		tp = "";
	
    con.query('CALL GetFamilyInfoBySearch("' + cn + '", "' + tp + '");',  
		function(err, rows, fields) 
		{
			if(err) {throw err;}
			res.send(rows);
			//res.render('users', {data : rows});
		});
    con.end();
});

app.get('/login', function(req, res) {
    res.send("Login lolol");
})

app.get('/home', function(req, res) {
    res.send('home');
});

app.get('/pickups', function(req, res) {
    res.send('all the pickups');
});

app.get('/pickup/new', function(req, res) {
    res.send('the form to pickup a bag');
});

app.post('/pickups', function(req, res) {
    // update db with bag pickup
    res.send('the bag pickup was recorded');
});

app.post('/dropoffs', function(req, res) {
    // save new dropoff
    res.send('created new dropoff');
});

app.get('/clients', function(req, res) {
    // list all clients
    res.send('all the clients');
});

app.get('/clients/search', function(req, res) {
    // do le search
    res.send("this is the client you're looking for.")
});

app.get('/clients/new', function(req, res) {
    res.send('form for making new client');
});

app.post('/clients', function(req, res) {
    // save the new client from post params
    res.send('new client added');
});

app.get('/clients/:clientid/fam/new', function(req, res) {
    req.params.clientid;
    res.send('form for addding a new family member');
});

app.post('/clients/:clientid/fam', function(req, res) {
    // save the family members
    res.send('updated the client with the family members');
});

app.get('/reports/hunger-relief', function(req, res) {
    res.send('hunger relief report');
});

app.get('/bags', function(req, res) {

});


app.get('/bag/edit', function(req, res) {
    res.send('the form for editing a bag');
});

app.put('/bags/:bagname', function(req, res) {
    // update the bag with new values
    res.send('your bag was updated');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
