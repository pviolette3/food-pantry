module.exports = function(app, sql) {

    app.get('/pickups', function(req, res) {
        res.render('pickups/list');
    });

    app.post('/pickups', function(req, res) {
        quotes = ['"', '"']
            params = [quotes.join(req.body.cid),
                  quotes.join(req.body.bagName),
                  quotes.join(req.body.date)];
            var insertSql = "CALL InsertPickup(" + params.join(',') + ");" 
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
            sql('CALL GetBagInfoForClient("' + firstName + '", "' + lastName + '", "' + phone + '");',
            function(err, rows, field) {
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

}