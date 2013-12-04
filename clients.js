module.exports = function(app, sql) {
    app.post('/clients/', function(req, res) {
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

        sql(insertSQL, function(err, rows) {
          if(err) throw err;
          res.send("Nice job " + JSON.stringify(rows));
        });
    });

    app.get('/clients', function(req, res) {
        sql('SELECT * FROM Client LIMIT 100', function(err, rows, fields) {
            if(err) {throw err; }
            return res.render('clients/list', {rows: rows});
        });
    });

    app.get('/clients/new', function(req, res) {
        res.render('clients/new');
    });

    //CLIENTS (Figure 6)
    app.get('/clients/search', function(req, res) {
        var cn = req.query.name;
        var tp = req.query.phone;
        if(!cn)
          cn = "";
        if(!tp)
          tp = "";
        
          sql('CALL GetFamilyInfoBySearch("' + cn + '", "' + tp + '");',  
          function(err, rows, fields) {
            if(err) {throw err;}
            res.send(rows[0]);
          });
    });

    app.get('/clients/:cid/', function(req, res) {
        var cid = req.params.cid;
        console.log(req.params);
        sql('SELECT * FROM Client WHERE CID="' + cid + '";', function(err, rows) {
            if(err) {throw err;}
            console.log(rows);
            return res.render('clients/show', {client: rows[0]});
        });
    });
};