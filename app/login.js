module.exports = function(app, sql) {
    //LOGIN (Figure 1)
    app.get('/login', function(req, res) {
        return res.render('login');
    });

    //LOGIN (Figure 1)
    app.post('/login', function(req, res) 
    {
        console.log("got %s, %s", req.body.username, req.body.password);
        if(req.user) {
            return res.redirect('/home');
        }else { // see if they log in properly
            sql("SELECT * FROM User WHERE UserName='" + 
                req.body.username + "' AND Password='" + req.body.password + "'",
            function(err, rows) {
                if(err) throw err;
                if(rows.length > 0) {
                    console.log("Found him...redirecting to home.");
                    req.user = rows[0];
                    res.cookie('user', JSON.stringify(req.user)); //success
                    return res.redirect('/home');
                }else {
                    console.log("DIDNT FIND THE USER!!!");
                    return res.redirect('/login');
                }
            });
        }
    });

    app.get('/logoff', function(req, res) {
        res.clearCookie('user', {path: '/'});
        res.redirect('/login');
    });
};
