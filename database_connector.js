var mysql = require('mysql');
var DbConnector = function(host, user, password) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.makeConnection = function() {
        return mysql.createConnection({
          host     : this.host,
          user     : this.user,
          password : this.password,
          database : 'foodpantry'
        });
    }
};

exports.DbConnector = DbConnector;