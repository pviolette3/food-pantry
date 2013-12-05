module.exports = function(app, sql) {
    app.get('/bags', function(req, res) {
        sql('SELECT * FROM Bag', function(err, rows) {
            if(err) {throw err;}
            res.render('bags/list', {bags: rows});
        });
    });

    //EDIT BAG (Figure 10)
    app.get('/bags/:bagname/edit', function(req, res) {
        sql('SELECT * FROM Holds WHERE BagName="' + req.params.bagname +'";',
            function(err, rows, field) {
                if(err) { throw err; }
                bags = {};
                
                for(var i = 0; i < rows.length; i++) {
                    bagItem = rows[i];
                    if(!bags[bagItem.BagName]) {
                        bags[bagItem.BagName] = [];
                    }
                    bags[bagItem.BagName].push(bagItem);
                }
                console.log(rows);
                res.render('bags/bagEdit', {arr : rows});
        });  
    });
    
    app.post('bags/edit', function(req, res)
    		{
	    
    			    //The SQL for inserting into dropoff
    			    //var updateSql = 'UPDATE ' + req.body['Quantity'];
    			            
    			    //sql(updateSql, function(err, rows, field)
    			   
    		});
    
};



		
		
		