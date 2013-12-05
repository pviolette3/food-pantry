module.exports = function(app, sql) {
    //HUNGER RELIEF BAG LIST (Figure 9)
    app.get('/reports/hunger-relief', function(req, res) {
        
    	
        sql('CALL GetHungerReliefBagList()', function(err, rows, fields)
        {   
            if(err){throw err;}
            console.log(rows);
            var valid = ["BagName", "num_items", "COUNT(c.CID)"]
            res.render('reports/hungerRelief', {arr : rows[0] , val : valid});
            res.send(rows);
        });
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
                });
                
    });

    //GROCERY LIST REPORT (Figure 14)
    app.get('/reports/grocery', function(req, res) {
        sql('CALL GetGroceryList()', function(err, rows, field)
        {
            if(err) {throw err;}
            var valid = ["ProdName", "DropoffThisMonth", "DropoffLastMonth"];
            
            res.render('reports/grocery', {arr : rows[0], val : valid});

        });
    });
};