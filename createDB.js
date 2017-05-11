var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'zaq1ZAQ!',
  database : 'bamazon_db'
});

connection.connect();