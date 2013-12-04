module.exports = function(app, sql) {


    //COMPLETE DROP OFF (Figure 5)
    app.post('/dropoffs', function(req, res) {   
        //Get the name of the attributes via the post request
        var attrs = [ req.body['Product'], req.body['Quantity'], req.body['Source'] ];
        
        //The SQL for inserting into dropoff
        var insertSql = 'INSERT INTO Dropoff (ProdName, Quantity, Date) VALUES ( "' + attrs[0] + '", "' + attrs[1] + '", CURDATE());';
                
        sql('SELECT * FROM Product WHERE Name = "' + attrs[0] + '";', function(err, rows, field)
            {
                if(err) {throw err;}
                
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
                    res.render('dropoffs/new', {arr : rows});
                });
                
    });
}