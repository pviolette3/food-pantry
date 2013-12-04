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


// DO NOT MOVE THESE in the file!!
//ADD CLIENT (Figure 7)
app.get('/clients/new', function(req, res) {
    console.log("New client!!");
    res.render('clients/new');
});

//ADD CLIENT (Figure 7, backend)
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


app.get(/^\/clients\/(\d+)$/, function(req, res) {
    var cid = req.params[0];
    sql('SELECT * FROM Client WHERE CID="' + cid + '";', function(err, rows) {
        return res.render('clients/show', {client: rows[0]});
    });
});


app.get('/clients/:clientid/fam/new', function(req, res) {
    req.params.clientid;
    res.send('form for addding a new family member');
});

//ADD FAMILY MEMBERS (Figure 8)
app.post('/clients/:clientid/fam', function(req, res) {
    // save the family members
    res.send('updated the client with the family members');
});

//LOGIN (Figure 1)
app.get('/login', function(req, res) {
    return res.redirect('/logIn.html');
});

//LOGIN (Figure 1)
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

//HOME (Figure 2)
app.get('/home', function(req, res) {
    return res.redirect('/home.html');
});

app.get('/pickups', function(req, res) {
    res.render('pickups/list');
});

//PICKUPS (Figure 3)
app.get('/pickups/:day', function(req, res) 
{
	sql('CALL GetPickupSignIn("' + req.params.day + '")',
		function(err, rows, field)
		{
			if(err) { throw err; }
            pickupSelectData = {
                clients: rows[0],
                day: req.params.day
            };
			res.render("pickups/show_day", pickupSelectData);
		});
});

//FAMILY BAG PICKUP (Figure 4)
app.get('/pickups/signin/:cid', function(req, res) {
    sql('SELECT * FROM Client WHERE CID=' + req.params.cid + ';', function(err, rows) {
        if(err) {throw err;}
        var firstName = rows[0].FirstName;
        var lastName = rows[0].LastName;
        var phone = rows[0].Phone;
        sql('CALL GetBagInfoForClient("' + firstName + '",  "' + lastName + '", "' + phone + '");',
                function(err, rows, field)
                {
                    var now = new Date();
                    var nowString = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
                    if(err) { throw err; }
                    pickupData = {
                        bag: rows[0],
                        name: (firstName + ' ' + lastName),
                        date: nowString
                    };
                    console.log(pickupData.bag);
                    res.render('pickups/confirm', pickupData);
                });
    });
});


app.post('/pickups', function(req, res) {
    // update db with bag pickup
    quotes = ['"', '"']
	params = [quotes.join(req.body.cid), 
              quotes.join(req.body.bagName),
              quotes.join(req.body.date)];
	
	var insertSql = "INSERT INTO Pickup (ClientID, BagName, Date) SELECT " + 
        params.join(",") + 
        " FROM dual WHERE NOT EXISTS (SELECT * FROM Pickup WHERE ClientID=" + params[0] 
+ " AND BagName=" + params[1] + " AND Date=" + params[2] + ");"
    console.log(insertSql);

    sql(insertSql, function(err, rows) {
        if(err) {throw err;}
        res.redirect('/home');
    });
});

//COMPLETE DROP OFF (Figure 5)
app.post('/dropoffs', function(req, res) {
	
	//Get the name of the attributes via the post request
    var attrs = [ req.body['Product'], req.body['Quantity'], req.body['Source'] ];
    
    //The SQL for inserting into dropoff
    var insertSql = 'INSERT INTO Dropoff (ProdName, Quantity, Date) ' +
			+ ' VALUES ( "' + attrs[0] + '", + "' + attrs[1] + '", CURDATE());';
    
    //The SQL for updating the product count
    var updateSql = 'UPDATE Product SET Quantity = Quantity + ' + attrs[1] +
    		' WHERE ProdName = "' + attrs[0] + '" AND Source = "' + attrs[2] + '");';
    		
    
    //Do I need anything else here
    sql(updateSQL, function (err, rows) {
    	if(err) { throw err; }
    });

    sql(insertSQL, function(err, rows) {
      if(err) { throw err; }
    });

    res.send('created new dropoff');
});

//LIST ALL DROPOFF (Figure 5)
app.get('/dropoffs', function(req, res) 
{
	
	
	
	res.send('all the dropoffs');
});

//CLIENTS (Figure 6)
app.get('/clients', function(req, res) {
	sql('SELECT * FROM Client LIMIT 100', function(err, rows, fields)
	{
		if(err){throw err;}
		return res.render('clients/list', {rows: rows});
	});
});

//CLIENTS (Figure 6)
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




//HUNGER RELIEF BAG LIST (Figure 9)
app.get('/reports/hunger-relief', function(req, res) {
	
    res.send('hunger relief report');
});

//EDIT BAG (Figure 10)
app.get('/bag/:bagname/edit', function(req, res) 
{
	
	
});

//PRODUCT LIST (Figure 11)
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

//MONTHLY SERVICE REPORT (Figure 13)
app.get('/reports/service', function(req, res) {
    res.send('here is the service report');
});









app.get('/bags', function(req, res) {
	
	con.query('CALL GetPickupSignIn("' + day + '")',
			function(err, rows, field)
			{
				if(err) { throw err; }
				res.send(rows);
			});
  res.send('got some bags');
});



app.put('/bags/:bagname', function(req, res) {
    // update the bag with new values
    res.send('your bag was updated');
});




http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
