module.exports = function(app, sql) {
    app.post('/clients', function(req, res) {
        var attrs = {type: [], values: []};
        var valid_names = ['BagSignedUp', 'FirstName', 'LastName', 'Phone',
          'Street', 'City', 'State', 'Zip', 'Apt', 'Gender', 'Start', 'PickupDay'];
        // see which params they actually passed.
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
      var insertSql = "INSERT INTO Pickup (ClientID, BagName, Date) SELECT " + params.join(",") + 
     " FROM dual WHERE NOT EXISTS (SELECT * FROM Pickup WHERE ClientID=" + params[0] 
      + " AND BagName=" + params[1] + " AND Date=" + params[2] + ");"

          sql(insertSql, function(err, rows) {
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
        if(req.query.hasOwnProperty('name') || req.query.hasOwnProperty('phone')) {
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
        }else {
            res.render('clients/search');
        }
    });

    app.get('/clients/:cid/fam', function(req, res) {
        sql('SELECT FirstName, LastName, CID FROM Client WHERE CID="' + req.params.cid + '"',
         function(err, rows) {
          if(err) {throw err;}
          client = rows[0];
          console.log(client);
          sql('SELECT * FROM FamilyMember WHERE ClientID="' + client.CID + '";', function(err, rows) {
            if(err) { throw err; }
            res.render('clients/family/new' , {family: rows, client: client});
            });
          });
    });


    //ADD FAMILY MEMBERS (Figure 8)
    app.post('/clients/:cid/fam', function(req, res) {
        var attrs = {type: [], values: []};
        var valid_names = ['FirstName', 'LastName', 'DOB', 'Gender', 'ClientID'];
        // see which params they actually passed.
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
        var whereClause = "";
        for(var i = 0; i < attrs.type.length; i++) {
          if(i > 0) {whereClause += " AND "}
          whereClause += attrs.type[i] + '=' + attrs.values[i];
        }

        var insertSql = "INSERT INTO FamilyMember (" + attrs.type.join(',') + 
          ") SELECT " + attrs.values.join(",") + 
     " FROM dual WHERE NOT EXISTS (SELECT * FROM FamilyMember WHERE " + whereClause + ");"
        sql(insertSql, function(err, rows) {
          if(err) {throw err;}
          res.redirect('/clients/' + client.CID + '/fam/new');
        })
    });

    app.get(/^\/clients\/(\d+)/, function(req, res) {
        var cid = req.params[0];
        console.log(req.params);
        sql('SELECT * FROM Client WHERE CID="' + cid + '";', function(err, rows) {
            if(err) {throw err;}
            console.log(rows);
            return res.render('clients/show', {client: rows[0]});
        });
    });

};
