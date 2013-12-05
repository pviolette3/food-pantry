
var requireLogin = function(req, res, next) {
    console.log("REQUIRE LOGIN");
    var whitelist = [new RegExp('^/login$'), new RegExp('^/images'),
    new RegExp('^/javascripts/'), new RegExp('^/stylesheets/')];
    for(var i = 0; i < whitelist.length; i++) {
        if(whitelist[i].test(req.path)) {
            return next();
        }
    }

    if(req.user || (req.cookies && req.cookies.user)) {
        console.log("User logged in: " + req.cookies.user);
        req.user = JSON.parse(req.cookies.user);
        console.log(req.user);
        return next();
    }
    console.log("Couldn't find the guy. Denying access to " + req.path);
    res.redirect('/login');
};

exports.requireLogin = requireLogin;