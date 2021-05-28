// NPM Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const logo = require('asciiart-logo');
require('console.table');
const colors = require('colors');

// Variables
var departmentChoices=[];
var roleChoices=[];
var employeeChoices=[];

//Arrays to be used
const todos = ["1.1: View Current Departments", "1.2: View Current Roles", "1.3: View Current Employees","1.4: View Current Employees (by manager)",
"2.1: Add Departments", "2.2: Add Roles", "2.3: Add Employees", "3.1: Update Employee role", "3.2: Update Employee manager", 
"4.1: Delete Employee", "5: Quit"];

const departmentsOptions = ["Executives", "Sales", "Engineering", "Finance", "Legal", "Administation"];

const rolesOptions = ["Director", "General Manager", "Sales Manager", "Sales Representative",
"Engineering Manager", "Software Engineer", "Finance Manager", "Accountant", "Legal Manager",
"Contract Administrator", "HR Manager", "Office Administrator"];

const salaryOptions = [200000, 150000, 120000, 100000, 80000, 70000, 60000];

const employeeOptions = ["Ross Giorgio", "Belinda D'Apice", "Brenton Cole", "Sarah Hamid",
"David Impey", "Zhou Tian", "Martin Giorgio", "Darren Qi", "David Monteleone",
"Adam Weaver", "Emma Krauss", "Eric Xia"];

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
  // To start with initial seed data if exist
  departmentChoices = await getDepartmentRest();
  roleChoices = await getRoleRest();
  employeeChoices = await getEmployeeRest();
  let answer = await inquirer.prompt({ name: 'todo', type: 'list', message: 'What would you like to do?', choices: todos,});
  if (answer.todo === todos[0]) { viewDepartments() } 
  else if (answer.todo === todos[1]) { viewRoles() } 
  else if (answer.todo === todos[2]) { viewEmployees() } 
  else if (answer.todo === todos[3]) { viewEmployeesManager() } 
  else if (answer.todo === todos[4]) { addDepartment() } 
  else if (answer.todo === todos[5]) { addRole() }
  else if (answer.todo === todos[6]) { addEmployee() }
  else if (answer.todo === todos[7]) { updateEmployeeRole() }
  else if (answer.todo === todos[8]) { updateEmployeeManager() }
  else if (answer.todo === todos[9]) { deleteEmployee() }
  else if (answer.todo === todos[10]) { connection.end(); return }   
};

// Viewing Departments, Roles and Employees in current Database
const viewDepartments = () => {
  connection.query('SELECT * FROM company_DB.departments', (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  })
};
const viewRoles = () => {
  var query = `
  SELECT id_ro, title, salary, department 
  FROM roles 
  LEFT JOIN departments ON roles.department_id = departments.id_de`
  connection.query( query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  })
};
const viewEmployees = () => {
  var query = `
  SELECT T1.id, T1.first_name, T1.last_name, roles.title, roles.salary, departments.department, CONCAT(T2.first_name, '   ', T2.last_name) AS manager 
  FROM employee T1 
  LEFT JOIN roles ON T1.role_id = roles.id_ro 
  LEFT JOIN departments ON roles.department_id = departments.id_de
  LEFT JOIN employee T2 ON T1.manager_id = T2.id`
  connection.query( query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  })
};
const viewEmployeesManager = () => {
  var query = `
  SELECT T1.id, T1.first_name, T1.last_name, CONCAT(T2.first_name, ' ', T2.last_name) AS manager 
  FROM employee T1 
  LEFT JOIN employee T2 ON T1.manager_id = T2.id`
  connection.query( query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.table(res);
    start();
  })
};

// Functions to initialize this app by loading existing data.
const getDepartmentRest = () => {
  var currentDepart = [];
  return new Promise((resolve,reject) => {
    connection.query('SELECT department FROM company_DB.departments', (err, res) => {
      if (err) reject(err);
      for (let i=0; i<res.length; i++){
        currentDepart.push(res[i].department)
      };
      departmentChoices = departmentsOptions;
      departmentChoices = departmentChoices.filter((item) => !currentDepart.includes(item));
      resolve(departmentChoices); // array like this ["Executives", "Sales", "Engineering", "Finance", "Legal", "Administation"];
    });
  });
}

const getRoleRest = () => {
  var currentRoles = [];
  return new Promise((resolve,reject) => {
    connection.query('SELECT title FROM company_DB.roles', (err, res) => {
      if (err) reject(err);
      for (let i=0; i<res.length; i++){
        currentRoles.push(res[i].title)
      };
      roleChoices = rolesOptions;
      roleChoices = roleChoices.filter((item) => !currentRoles.includes(item));
      resolve(roleChoices);
    });
  });
}

const getEmployeeRest = () => {
  var currentEmployees = [];
  return new Promise((resolve,reject) => {
    connection.query('SELECT first_name, last_name FROM company_DB.employee', (err, res) => {
      if (err) reject(err);
      for (let i=0; i<res.length; i++){
        currentEmployees.push(res[i].first_name + " " + res[i].last_name)
      };
      employeeChoices = employeeOptions;
      employeeChoices = employeeChoices.filter((item) => !currentEmployees.includes(item));
      resolve(employeeChoices);
    });
  });
}

// Adding Departments, Roles and Employees into current Database
async function addDepartment() {
  if ( departmentChoices.length > 0 ){
    departmentChoices = await getDepartmentRest();
    let answer = await inquirer.prompt({ 
      name: 'new', type: 'list', 
      message: 'Which Department do you need to add?', 
      choices: departmentChoices
    });
    connection.query(
      'INSERT INTO departments SET ?', { department: answer.new },
      (err) => {
        if (err) throw err;
        console.log('\nNew department was added successfully!\n'.green);
        start();
      }
    )
  }
  else{console.log('\nDepartments all set already!\n'.red);start()}
}

async function addRole() {
  if ( roleChoices.length > 0 ){
    roleChoices = await getRoleRest();
    var departmentExist = departmentsOptions.filter((item) => !departmentChoices.includes(item));
    let answer = await inquirer.prompt([{ 
      name: 'title', type: 'list', 
      message: 'Which Role do you need to add?', 
      choices: roleChoices
    },{ 
      name: 'salary', type: 'list', 
      message: 'How much salary for this role?', 
      choices: salaryOptions
    },{ 
      name: 'department_id', type: 'list', 
      message: 'Please chose one of the existing department to add this role, chose RETURN to add new department if needed.', 
      choices: [...departmentExist, "RETURN"]
    }
    ]);
    // Go back to create department from here.
    if (answer.department_id === "RETURN"){
      start();
    }
    else{connection.query(
      'INSERT INTO roles SET ?', 
      { 
        title: answer.title,
        salary: answer.salary,
        // Change department names (string type) to department ids (num type)
        department_id: 1 + departmentExist.indexOf(answer.department_id)
      },
      (err) => {
        if (err) throw err;
        console.log('\nNew Role was added successfully!\n'.green);
        start();
      }
    )}
  }
  else{console.log('\nRoles all set already!\n'.red);start()}
}

async function addEmployee() {
  if ( employeeChoices.length > 0 ){
    employeeChoices = await getEmployeeRest();
    var roleExist = rolesOptions.filter((item) => !roleChoices.includes(item));
    var employeeExist = employeeOptions.filter((item) => !employeeChoices.includes(item));
    let answer = await inquirer.prompt([{ 
      name: 'fullName', type: 'list', 
      message: 'Which Employee do you need to add?', 
      choices: employeeChoices
    },{ 
      name: 'role_id', type: 'list', 
      message: 'Which role for this employee? Chose RETURN to add new role if needed.', 
      choices: [...roleExist, "RETURN"]
    },{ 
      name: 'manager_id', type: 'list', 
      message: 'Please chose one of the existing employee to be his/her manager, chose RETURN to add new employee if needed.', 
      choices: [...employeeExist, "Null", "RETURN"]
    }
    ]);
    // Conditions for manager input 
    var managerIdValue;
    if ( answer.manager_id !== "Null"){ managerIdValue = 1 + employeeExist.indexOf(answer.manager_id)}
    else { managerIdValue = null }
    if ( answer.role_id === "RETURN" || answer.manager_id === "RETURN"){ start() }
    else{connection.query(
      'INSERT INTO employee SET ?', 
      { 
        first_name: answer.fullName.split(" ")[0],
        last_name: answer.fullName.split(" ")[1],
        role_id: 1 + roleExist.indexOf(answer.role_id),
        manager_id: managerIdValue
      },
      (err) => {
        if (err) throw err;
        console.log('\nNew Employee was added successfully!\n'.green);
        start();
      }
    )}
  }
  else{console.log('\nEmployees all set already!\n'.red);start()}
}

// Update current employee details
async function updateEmployeeManager() {
  if ( employeeChoices.length !== employeeOptions.length ){
    employeeChoices = await getEmployeeRest();
    var roleExist = rolesOptions.filter((item) => !roleChoices.includes(item));
    var employeeExist = employeeOptions.filter((item) => !employeeChoices.includes(item));
    let answer = await inquirer.prompt([{ 
      name: 'fullName', type: 'list', 
      message: 'Which Employee to Update?', 
      choices: employeeExist
    },{ 
      name: 'manager_id', type: 'list', 
      message: 'Please chose one of the existing employee to be his/her manager, chose RETURN to add new employee if needed.', 
      choices: [...employeeExist, "Null", "RETURN"]
    }
    ]);
    // Conditions for manager input 
    var managerIdValue;
    if ( answer.manager_id !== "Null"){ managerIdValue = 1 + employeeExist.indexOf(answer.manager_id)}
    else { managerIdValue = null }
    if ( answer.manager_id === "RETURN"){ start() }
    else{connection.query(
      `UPDATE employee SET manager_id = ${managerIdValue}
      WHERE CONCAT(first_name, ' ', last_name) = "${answer.fullName}"`, 
      (err) => {
        if (err) throw err;
        console.log('\nEmployee Manager was updated successfully!\n'.green);
        start();
      }
    )}
  }
  else{console.log('\nEmployee not found, please add at least one before updating!\n'.red);start()}
}

async function updateEmployeeRole() {
  if ( employeeChoices.length !== employeeOptions.length ){
    employeeChoices = await getEmployeeRest();
    var roleExist = rolesOptions.filter((item) => !roleChoices.includes(item));
    var employeeExist = employeeOptions.filter((item) => !employeeChoices.includes(item));
    let answer = await inquirer.prompt([{ 
      name: 'fullName', type: 'list', 
      message: 'Which Employee to Update?', 
      choices: employeeExist
    },{ 
      name: 'role_id', type: 'list', 
      message: 'Which role for this employee? Chose RETURN to add new role if needed.', 
      choices: [...roleExist, "RETURN"]
    }
    ]);
    // Conditions for role input 
    if ( answer.role_id === "RETURN" ){ start() }
    else{connection.query(
      `UPDATE employee SET role_id = ${1 + roleExist.indexOf(answer.role_id)}
      WHERE CONCAT(first_name, ' ', last_name) = "${answer.fullName}"`, 
      (err) => {
        if (err) throw err;
        console.log('\nEmployee Role was updated successfully!\n'.green);
        start();
      }
    )}
  }
  else{console.log('\nEmployee not found, please add at least one before updating!\n'.red);start()}
}

// Functions to delete data from database
async function deleteEmployee() {
  if ( employeeChoices.length !== employeeOptions.length ){
    employeeChoices = await getEmployeeRest();
    var employeeExist = employeeOptions.filter((item) => !employeeChoices.includes(item));
    let answer = await inquirer.prompt([{ 
      name: 'fullName', type: 'list', 
      message: 'Which Employee to Delete?', 
      choices: employeeExist
    }]);
    // If the seleted employee is a manager of other employees, need to set the manager_id of those employees to null,
    // before deleting seleted employee.
    var managerIdValue = 1 + employeeExist.indexOf(answer.fullName);
    var checkEmployee = await isManager(answer.fullName);
    // Actions for is Manager = true
    if( checkEmployee ){
      // To set the manager_id of those employees to null
      connection.query(
        `UPDATE employee
        SET manager_id = null
        WHERE employee.manager_id = ${managerIdValue};`, 
        (err) => { if (err) throw err}
      );
      // Deleting seleted employee
      connection.query(
        `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.fullName}";`, 
        (err) => {
          if (err) throw err;
          console.log('\nThe chosen Employee (Is a Manager) has been Deleted successfully!\n'.green);
          start();
        }
      )
    }
    // Actions for is Manager = false
    else {
      connection.query(
        `DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${answer.fullName}"`, 
        (err) => {
          if (err) throw err;
          console.log('\nThe chosen Employee (Not a Manager) has been Deleted successfully!\n'.green);
          start();
        }
      )
    }
  }
  else{console.log('\nEmployee not found, please add at least one before deleting!\n'.red);start()}
}

// Functions for resolving foreign key constraint issue
function isManager(person){
  return new Promise((resolve,reject) => {
    connection.query(`
      SELECT T1.id, CONCAT(T2.first_name, ' ', T2.last_name) AS manager 
      FROM employee T1 
      LEFT JOIN employee T2 ON T1.manager_id = T2.id`, (err, res) => {
        if (err) reject(err);
        for (let i=0; i<res.length; i++){ if ( person === res[i].manager){ return resolve(true) } }
        return resolve(false) 
      }
    )
  });
}

start();


