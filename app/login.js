module.exports = function(app, sql) {
    //LOGIN (Figure 1)
    app.get('/login', function(req, res) {
        return res.render('login');
    });

    //LOGIN (Figure 1)
    app.post('/login', function(req, res) 
    {
        if(req.cookies && req.cookies.user) {
            return res.redirect('/home');
        }else { // see if they log in properly
            sql("SELECT * FROM User WHERE UserName='" + 
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
        }
    });
};
