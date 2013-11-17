var mysql = require('mysql');

var DbConnector = function(host, user, password) {
    this.host = host;
    this.user = user;
    this.password = password;
    var configs = {
          host     : host,
          user     : user,
          password : password,
          database : 'foodpantry'
        };
    if(process.env.MYSQL_PORT_NODE) { 
      configs.port = process.env.MYSQL_PORT_NODE;
    }
    this.makeConnection = function() {
        return mysql.createConnection(configs);
    }
};

exports.DbConnector = DbConnector;
