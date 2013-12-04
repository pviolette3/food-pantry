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

var sql = function(query, callback) 
{
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


app.get('/clients/:cid', function(req, res) {
   sql('SELECT * FROM Client WHERE CID="' + req.params.cid + '";', function(err, rows) {
    return res.render('clients/show', {client: rows[0]});
   }); // callback hell :D
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

//PICKUPS (Figure 3)
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

//FAMILY BAG PICKUP (Figure 4)
app.post('/pickups/:fn--:ln--:tp', function(req, res) {
    // update db with bag pickup
	
	var con = dbCon.makeConnection();
	
	var fn = req.params.fn;
	var ln = req.params.ln;
	var tp = req.params.tp;
	
	var cid;
	var bagName;
	
	sql('CALL GetBagInfoForClient("' + fn + '",  "' + ln + '", "' + tp + '")',
			function(err, rows, field)
			{
				if(err) { throw err; }
				cid = rows[ClientID];
				bagName = rows[BagName];
				
				res.send(rows);
			});

	var insertSql = 'INSERT INTO Pickup (ClientID, BagName, Date) ' + 
		'VALUES ("' + cid + '" + ," + ' + BagName + '", CURDATE());';

	//TODO: call con.query on the above insertSql when the pickup bag button is pressed
	

});

//COMPLETE DROP OFF (Figure 5)
app.post('/dropoffs', function(req, res) {
		
	//Get the name of the attributes via the post request
    var attrs = [ req.body['Product'], req.body['Quantity'], req.body['Source'] ];
    
    //The SQL for inserting into dropoff
    var insertSql = 'INSERT INTO Dropoff (ProdName, Quantity, Date) VALUES ( "' + attrs[0] + '", "' + attrs[1] + '", CURDATE());';
            
    sql('SELECT * FROM Product WHERE Name = "' + attrs[0] + '";', function(err, rows, field)
    		{
    			if(err) {throw err;}
    			console.log(rows);
    			
    		    sql(insertSql, function(err, rows) {
    		        if(err) { throw err; }
    		      });
    		    
    		});
    


    res.redirect('/');
});

//LIST ALL DROPOFF (Figure 5)
app.get('/dropoffs', function(req, res) 
{
	sql('SELECT Name FROM Product', function(err, rows, fields)
			{
				if(err) {throw err;}
				res.render('clients/newdropoff', {arr : rows});
			});
			
});

app.get('/pickup/new', function(req, res) 
{
    res.send('the form to pickup a bag');
});

//CLIENTS (Figure 6)
app.get('/clients', function(req, res) 
{
	sql('SELECT * FROM Client LIMIT 100', function(err, rows, fields)
	{
		if(err) {throw err; }
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

//ADD CLIENT (Figure 7)
app.get('/clients/new', function(req, res) {
   res.render('clients/new');
});

//ADD CLIENT (Figure 7)
app.post('/clients', function(req, res) {
    var attrs = {type: [], values: []};
    var valid_names = ['BagSignedUp', 'FirstName', 'LastName', 'Phone',
      'Street', 'City', 'State', 'Zip', 'Apt', 'Gender', 'Start', 'PickupDay'];
    // see which params they actually passed.
    // TODO Validation, bc we are gonna get SQL injected like this
    for (var param in req.body) 
    {
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

//HUNGER RELIEF BAG LIST (Figure 9)
app.get('/reports/hunger-relief', function(req, res) {
	
	sql('CALL GetHungerReliefBagList()', function(err, rows, fields)
	{	
		if(err){throw err;}
		res.send(rows);
	});
	
    res.send('hunger relief report');
});

//EDIT BAG (Figure 10)
app.get('/bag/:bagname/edit', function(req, res) 
{
	
	
});

//PRODUCT LIST (Figure 11)
app.get('/products', function(req, res) {
	
	sql('CALL GetProductList()',
			function(err, rows, field)
			{
				if(err) { throw err; }
				var values = ['Name', 'Cost', 'QuantityOnHand'];
				res.render('products/productList', {arr : rows[0], val : values});
				console.log(rows);
			});
});

//NEW PRODUCT (Figure 12)
app.get('/products/new', function(req, res)
{
	res.render('products/new');
});

//NEW PRODCUT (Figure 12)
app.post('/products/new', function(req, res)
{
	//Get the name of the attributes via the post request
    var attrs = [ req.body['Name'], req.body['Cost'], req.body['SourceName'] ];
    
    //The SQL for inserting into dropoff
    var insertSql = 'INSERT INTO Product (Name, Cost, SourceName) VALUES ( "' + attrs[0] + '", "' + attrs[1] + '", "' + attrs[2] + '");';

    sql('SELECT * FROM Product WHERE Name = "' + attrs[0] + '";', function(err, rows, field)
    		{
    			if(err) {throw err;}
    			console.log(rows);   
    			    			
				sql(insertSql, function(err, rows, field){
					if(err){throw err;}
				});
    			
    		});
    

    res.redirect('/');

});
		

//MONTHLY SERVICE REPORT (Figure 13)
app.get('/reports/service/thisMonth', function(req, res) 
{
	sql('CALL GetMonthlyServiceReport(1)', function(err, rows, field)
			{
				if(err) { throw err; }
				console.log(rows[0]);
				
				var valid = ["Week", "Households", "UnderEighteen", "EighteenToSixtyFour",
				             "SixtyFiveAndUp", "TotalPeople", "Week", "FoodCost"];

				res.render('reports/service', {arr : rows[0], val : valid} );
				res.send(rows);
			});		
});

//MONTHLY SERVICE REPORT (Figure 13)
app.get('/reports/service/lastMonth', function(req, res) 
{
	sql('CALL GetMonthlyServiceReport(0)', function(err, rows, field)
			{
				if(err) { throw err; }
				console.log(rows[0]);
				
				var valid = ["Week", "Households", "UnderEighteen", "EighteenToSixtyFour",
				             "SixtyFiveAndUp", "TotalPeople", "Week", "FoodCost"];

				res.render('reports/service', {arr : rows[0], val : valid} );
				res.send(rows);
			});
			
});

//GROCERY LIST REPORT (Figure 14)
app.get('/reports/grocery', function(req, res)
{
	sql('CALL GetGroceryList()', function(err, rows, field)
	{
		if(err) {throw err;}
		var valid = ["ProdName", "DropoffThisMonth", "DropoffLastMonth"];
		
		res.render('reports/grocery', {arr : rows[0], val : valid});

	});
});	

app.get('/bags', function(req, res) {
	
	con.query('CALL GetPickupSignIn("' + day + '")',
			function(err, rows, field)
			{
				if(err) { throw err; }
				console.log(rows);
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