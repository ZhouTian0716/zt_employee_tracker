var mysql = require('mysql');
require('console.table');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'company_DB'
});
 
connection.connect();
 
connection.query(`SELECT id_ro, title, salary, department FROM roles
LEFT JOIN departments ON roles.department_id = departments.id_de`, function (error, results, fields) {
  if (error) throw error;
  console.table(results);
  console.table(fields);
});
 
connection.end();