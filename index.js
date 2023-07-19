// Dotenv is required for environment variables
import dotenv from 'dotenv';
dotenv.config();

// MySQL2 + Inquirer are required for the application
import mysql from 'mysql2';
import inquirer from 'inquirer';

// MySQL configuration for connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'company_db'
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server.');

 // Start application
 start();
});

// Function to start application and display main menu
function start() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'Please select an action from the menu.',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update employee manager',
        'View employees by manager',
        'View employees by department',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'View total utilized budget of a department',
        'Exit'
      ]
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Update employee manager':
          updateEmployeeManager();
          break;
        case 'View employees by manager':
          viewEmployeesByManager();
          break;
        case 'View employees by department':
          viewEmployeesByDepartment();
          break;
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'View total utilized budget of a department':
          viewDepartmentBudget();
          break;
        case 'Exit':
          connection.end();
          break;
        default:
          console.log('Invalid action. Please select again.');
          start();
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
    // Perform SQL query to retrieve all departments
    const query = 'SELECT * FROM departments';
    connection.query(query, (err, res) => {
      if (err) throw err;
      // Display retrieved departments
      console.log('Departments:');
      console.table(res);
      start();
    });
  }
  
  // Function to view all roles
  function viewAllRoles() {
    // Perform SQL query to retrieve all roles
    const query = 'SELECT * FROM roles';
    connection.query(query, (err, res) => {
      if (err) throw err;
      // Display retrieved roles
      console.log('Roles:');
      console.table(res);
      start();
    });
  }
  
  // Function to view all employees
  function viewAllEmployees() {
    // Perform SQL query to retrieve all employees
    const query = 'SELECT * FROM employees';
    connection.query(query, (err, res) => {
      if (err) throw err;
      // Display retrieved employees
      console.log('Employees:');
      console.table(res);
      start();
    });
  }