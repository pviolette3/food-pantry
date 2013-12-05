module.exports = function(app, sql) {
    //PRODUCT LIST (Figure 11)
    app.get('/products', function(req, res) {
        
        sql('CALL GetProductList()',
                function(err, rows, field) {
                    if(err) { throw err; }
                    var values = ['Name', 'QuantityOnHand', 'Cost'];
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
        var insertSql = 'INSERT INTO Product (Name, Cost, SourceName) VALUES ( "' + attrs[0].toLowerCase() + '", "' + attrs[1] + '", "' + attrs[2] + '");';

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
};
        
