//Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
require('console.table');

// Variables
var departmentChoices=["A","B"];

//Arrays to be used
const todos = ["1.1: View Current Departments", "1.2: View Current Roles", "1.3: View Current Employees",
"2.1: Add Departments", "2.2: Add Roles", "2.3: Add Employees", "3: Update Employees","4: Quit"
];
const departments = ["Sales", "Engineering", "Finance", "Legal", "Administation"];

// Starting logo
console.log(logo({ name: 'Employee Tracker', logoColor: 'bold-yellow' }).render());

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost', port: 3306,
  user: 'root', password: '1234',
  database: 'company_DB',
});

// Start by prompting options for user
const start = async () => {
  let answer = await inquirer.prompt({ name: 'todo', type: 'list', message: 'What would you like to do?', choices: todos,});
  if (answer.todo === todos[0]) { viewDepartments() } 
  else if (answer.todo === todos[1]) { viewRoles() } 
  else if (answer.todo === todos[2]) { viewEmployees() } 
  else if (answer.todo === todos[3]) { addDepartment() } 
  else if (answer.todo === todos[7]) { connection.end(); return }   
};

const viewDepartments = () => {
  connection.query('SELECT * FROM company_DB.department', (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  })
};

const viewRoles = () => {
  connection.query('SELECT * FROM company_DB.roles', (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  })
};

const viewEmployees = () => {
  connection.query('SELECT * FROM company_DB.employee', (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  })
};

const getRest = () => {
  var currentDepart = [];
  return new Promise((resolve,reject) => {
    connection.query('SELECT name FROM company_DB.department', (err, res) => {
      if (err) reject(err);
      for (let i=0; i<res.length; i++){
        currentDepart.push(res[i].name)
      };
      departmentChoices = departments;
      departmentChoices = departmentChoices.filter((item) => !currentDepart.includes(item));
      resolve(departmentChoices);
    });
  });
  
}

async function addDepartment() {
  if ( departmentChoices.length > 1 ){
    departmentChoices = await getRest();
    let answer = await inquirer.prompt({ 
      name: 'new', type: 'list', 
      message: 'Which Department do you need to add?', 
      choices: departmentChoices
    });
    connection.query(
      'INSERT INTO department SET ?', { name: answer.new },
      (err) => {
        if (err) throw err;
        console.log('New department was added successfully!');
        start();
      }
    )
  }
  else{console.log('\nDepartments all set already!\n');start()}
}




start();
