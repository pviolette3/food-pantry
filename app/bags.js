module.exports = function(app, sql) {
    app.get('/bags', function(req, res) {
        sql('CALL GetHungerReliefBagList();', function(err, rows) {
            if(err) {throw err;}
            res.render('bags/list', {bags : rows[0]});
            console.log(rows);
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
                    console.log(rows);
                }
                res.render('bags/bagEdit', {arr : rows});
        });  
    });
    
    app.post('/bags/edit/complete', function(req, res)
    		{
    		
    		console.log(req.body['BagName']);
	    	for(var i = 0; i < req.body['length']; i++)
	    	{
	    		if(req.body['ProductName'+i])
	    		{
	    			var call = 'CALL UpdateProduct("' + req.body['ProductName'+i] + 
	    		'", "' + req.body['BagName'] + '", "' + req.body['Quantity'+i] + '");';
		    		
	    			sql(call, function(err, rows, field)
					{
						if(err){throw err;}
					});
	    			
	    			console.log(call);

	    		}
	    		
	    	}
	    	
	    	res.redirect('/');
    	});
};



		
		
		
