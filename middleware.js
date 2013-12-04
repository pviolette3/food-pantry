var requireLogin = function(req, res, next) {
    var whitelist = [new RegExp('^/login$'), new RegExp('^/images'),
    new RegExp('^/javascripts/'), new RegExp('^/stylesheets/')];
    for(var i = 0; i < whitelist.length; i++) {
        if(whitelist[i].test(req.path)) {
            return next();
        }
    }

    if(req.cookies && req.cookies.user) {
        return next();
    }
    res.redirect('/login');
};

exports.requireLogin = requireLogin;