module.exports = function(app, sql) {
    app.namespace('/clients', function() {
        app.post('/', function(req, res) {
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

        app.get('/', function(req, res) {
            sql('SELECT * FROM Client LIMIT 100', function(err, rows, fields) {
                if(err) {throw err; }
                return res.render('clients/list', {rows: rows});
            });
        });

        app.get('/new', function(req, res) {
            res.render('clients/new');
        });

        app.get('/:cid', function(req, res) {
            sql('SELECT * FROM Client WHERE CID="' + req.params.cid + '";', function(err, rows) {
                return res.render('clients/show', {client: rows[0]});
            });
        });
    });
};