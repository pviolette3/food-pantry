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
app.use(express.methodOverride()); //for app.put
app.use(express.bodyParser()); // for getting post params
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var sql = function(query, callback) {
    var con = dbCon.makeConnection();
    con.connect();
    con.query(query, callback);
    con.end();
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    return res.redirect('/home');
});

//NEED:
//Menu, Login, Home, Pickups, Pickup Confirmation, 
//Drop Off, New Drop Off, Clients, Clients with Search (Search)
//New Client, Add Additional Family Members for Client, 
//Hunger Relief Bag List, Edit Bag, Product List (Search), 
//New Inventory, Monthly Service Report, Grocery List Report

app.get('/users', function(req, res) {
		var con = dbCon.makeConnection();
		con.connect();
		con.query('SELECT * FROM Client', function(err, rows, fields)
		{	
			if(err){throw err;}
			res.send(rows);
		});
		con.end();	
	});

app.get('/clients', function(req, res) {
	sql('SELECT * FROM Client LIMIT 100', function(err, rows, fields)
	{
		if(err){throw err;}
		return res.render('clients/list', {rows: rows});
	});
});

app.get('/clients/search/:clientName--:telephone', function(req, res) 
{
//	if(clientName)
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
		});
    con.end();
});

app.get('/clients/new', function(req, res) {
   res.render('clients/new');
});

app.post('/clients', function(req, res) {
    var attrs = {type: [], values: []};
    var valid_names = ['BagSignedUp', 'FirstName', 'LastName', 'Phone',
      'Street', 'City', 'State', 'Zip', 'Apt', 'Gender', 'Start', 'PickupDay'];
    // see which params they actually passed.
    // TODO Validation, bc we are gonna get SQL injected like this
    for (var param in req.body) {
        if (req.body.hasOwnProperty(param) 
            && (valid_names.indexOf(param) > -1)) {
           attrs.type.push(param);
           if(req.body[param]) { // Tests for empty string
             attrs.values.push('"' + req.body[param] + '"');
           }else {
             attrs.values.push("NULL");
           }
        }
    }
    var insertSQL = "INSERT INTO Client (" + attrs.type.join(",") + ") VALUES ("
    + attrs.values.join(",") + ");";
    // Run the SQL
    sql(insertSQL, function(err, rows) {
      if(err) throw err;
      res.send("Nice job " + JSON.stringify(rows));
    });
});

app.get('/clients/:cid', function(req, res) {
   sql('SELECT * FROM Client WHERE CID="' + req.params.cid + '";', function(err, rows) {
    return res.render('clients/show', {client: rows[0]});
   }); // callback hell :D
});

app.get('/clients/:clientid/fam/new', function(req, res) {
    req.params.clientid;
    res.send('form for addding a new family member');
});

app.post('/clients/:clientid/fam', function(req, res) {
    // save the family members
    res.send('updated the client with the family members');
});

app.get('/login', function(req, res) {
    return res.redirect('/logIn.html');
});

app.post('/login', function(req, res) 
{
    if(req.cookies && req.cookies.user) {
        return res.redirect('/home');
    }else { // see if they log in properly
        var con = dbCon.makeConnection();
        con.connect();
        con.query("SELECT * FROM User WHERE UserName='" + 
            req.body.username + "' AND Password='" + req.body.password + "'",
        function(err, rows) {
            if(err) throw err;
            if(rows.length > 0) {
                res.cookie('user', 'yes'); //success
                return res.redirect('/home');
            }else {
                return res.redirect('/login');
            }
        });
        con.end();
    }
});

app.get('/home', function(req, res) {
    return res.redirect('/home.html');
});

app.get('/pickups:_day', function(req, res) 
{
	var con = dbCon.makeConnection();
	var day = req.params.day;//document.getElementById('form').value;
	con.connect();
	con.query('CALL GetPickupSignIn("' + day + '")',
			function(err, rows, field)
			{
				if(err) { throw err; }
				res.send(rows);
			});
	con.end();
});

app.get('/pickup/new', function(req, res) {
    res.send('the form to pickup a bag');
});

app.post('/pickups', function(req, res) {
    // update db with bag pickup
    res.send('the bag pickup was recorded');
});

app.get('/dropoffs', function(req, res) {
		
  res.send('all the dropoffs');
});

app.post('/dropoffs', function(req, res) {
    // save new dropoff
    res.send('created new dropoff');
});


app.get('/reports/hunger-relief', function(req, res) {
	
    res.send('hunger relief report');
});
	
app.get('/reports/service', function(req, res) {
    res.send('here is the service report');
});

app.get('/bags', function(req, res) {
	
  res.send('got some bags');
});


app.get('/bag/:bagname/edit', function(req, res) 
{
    res.send('the form for editing a bag');
});

app.put('/bags/:bagname', function(req, res) {
    // update the bag with new values
    res.send('your bag was updated');
});

app.get('/products', function(req, res) {
	
	var con = dbCon.makeConnection();
	con.connect();
	con.query('CALL GetProductList()',
			function(err, rows, field)
			{
				if(err) { throw err; }
				res.send(rows);
			});
	con.end();
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
