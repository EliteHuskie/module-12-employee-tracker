// Package dependencies needed for application
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import inquirer from 'inquirer';

dotenv.config();

async function initializeApp() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(process.env.DB_PASSWORD, 10);

    // MySQL configuration for connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Connect to MySQL server
    console.log('Connected to MySQL server.');

    start(connection); // Start the application
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Function to start the application and display the main menu
function start(connection) {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'Please select an action from the menu.',
      choices: [
        'Add a department',
        'Add an employee',
        'Add a role',
        'Delete a department',
        'Delete an employee',
        'Delete a role',
        'Update an employee role',
        'Update employee manager',
        'View all departments',
        'View all employees',
        'View all roles',
        'View employees by department',
        'View employees by manager',
        'View total utilized budget of a department',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments(connection);
          break;
        case 'View all roles':
          viewAllRoles(connection);
          break;
        case 'View all employees':
          viewAllEmployees(connection);
          break;
        case 'Add a department':
          addDepartment(connection);
          break;
        case 'Add a role':
          addRole(connection);
          break;
        case 'Add an employee':
          addEmployee(connection);
          break;
        case 'Update an employee role':
          updateEmployeeRole(connection);
          break;
        case 'Update employee manager':
          updateEmployeeManager(connection);
          break;
        case 'View employees by manager':
          viewEmployeesByManager(connection);
          break;
        case 'View employees by department':
          viewEmployeesByDepartment(connection);
          break;
        case 'Delete a department':
          deleteDepartment(connection);
          break;
        case 'Delete a role':
          deleteRole(connection);
          break;
        case 'Delete an employee':
          deleteEmployee(connection);
          break;
        case 'View total utilized budget of a department':
          viewDepartmentBudget(connection);
          break;
        case 'Exit':
          connection.end();
          break;
        default:
          console.log('Invalid action. Please select again.');
          start(connection);
          break;
      }
    });
}

// Function to view all departments
async function viewAllDepartments(connection) {
  try {
    // Perform SQL query to retrieve all departments
    const [rows] = await connection.query('SELECT * FROM departments');
    // Display retrieved departments
    console.log('Departments:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error retrieving departments:', error);
    start(connection);
  }
}

// Function to view all roles
async function viewAllRoles(connection) {
  try {
    // Perform SQL query to retrieve all roles
    const [rows] = await connection.query('SELECT * FROM roles');
    // Display retrieved roles
    console.log('Roles:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error retrieving roles:', error);
    start(connection);
  }
}

// Function to view all employees
async function viewAllEmployees(connection) {
  try {
    // Perform SQL query to retrieve all employees
    const [rows] = await connection.query('SELECT * FROM employees');
    // Display retrieved employees
    console.log('Employees:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error retrieving employees:', error);
    start(connection);
  }
}

// Function to add a department
async function addDepartment(connection) {
  try {
    // Prompt user to enter department name
    const answer = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter name of department:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Please enter a department name.';
        },
      },
    ]);
    // Insert new department into database
    await connection.query('INSERT INTO departments SET ?', { name: answer.name });
    console.log('Department added successfully!');
    start(connection);
  } catch (error) {
    console.error('Error adding department:', error);
    start(connection);
  }
}

// Function to add a role
async function addRole(connection) {
  try {
    // Perform SQL query to retrieve all departments
    const [departments] = await connection.query('SELECT * FROM departments');
    // Prompt user to enter role details
    const answer = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter title of role:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Please enter a role title.';
        },
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter salary for role:',
        validate: (value) => {
          const valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a valid salary.';
        },
      },
      {
        name: 'departmentId',
        type: 'list',
        message: 'Select department for role:',
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      },
    ]);
    // Insert new role into database
    await connection.query('INSERT INTO roles SET ?', {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.departmentId,
    });
    console.log('Role added successfully!');
    start(connection);
  } catch (error) {
    console.error('Error adding role:', error);
    start(connection);
  }
}

// Function to add an employee
async function addEmployee(connection) {
  try {
    // Perform SQL query to retrieve all roles and employees
    const [roles] = await connection.query('SELECT * FROM roles');
    const [employees] = await connection.query('SELECT * FROM employees');
    // Prompt user to enter employee details
    const answer = await inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter first name of employee:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Please enter the first name.';
        },
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter last name of employee:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Please enter the last name.';
        },
      },
      {
        name: 'roleId',
        type: 'list',
        message: 'Select role for employee:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
      {
        name: 'managerId',
        type: 'list',
        message: 'Select manager for employee:',
        choices: [
          { name: 'None', value: null },
          ...employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        ],
      },
    ]);
    // Insert new employee into database
    await connection.query('INSERT INTO employees SET ?', {
      first_name: answer.firstName,
      last_name: answer.lastName,
      role_id: answer.roleId,
      manager_id: answer.managerId,
    });
    console.log('Employee added successfully!');
    start(connection);
  } catch (error) {
    console.error('Error adding employee:', error);
    start(connection);
  }
}

// Function to update an employee's role
async function updateEmployeeRole(connection) {
  try {
    // Perform SQL query to retrieve all employees and roles
    const [employees] = await connection.query('SELECT * FROM employees');
    const [roles] = await connection.query('SELECT * FROM roles');
    // Prompt user to select the employee and new role
    const answer = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'list',
        message: 'Select the employee to update:',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
      {
        name: 'roleId',
        type: 'list',
        message: 'Select the new role for the employee:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);
    // Update employee's role in the database
    await connection.query('UPDATE employees SET role_id = ? WHERE id = ?', [answer.roleId, answer.employeeId]);
    console.log('Employee role updated successfully!');
    start(connection);
  } catch (error) {
    console.error('Error updating employee role:', error);
    start(connection);
  }
}

// Function to update an employee's manager
async function updateEmployeeManager(connection) {
  try {
    // Perform SQL query to retrieve all employees
    const [employees] = await connection.query('SELECT * FROM employees');
    // Prompt the user to select the employee and new manager
    const answer = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'list',
        message: 'Select the employee to update:',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
      {
        name: 'managerId',
        type: 'list',
        message: 'Select the new manager for the employee:',
        choices: [
          { name: 'None', value: null },
          ...employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        ],
      },
    ]);
    // Update the employee's manager in the database
    await connection.query('UPDATE employees SET manager_id = ? WHERE id = ?', [answer.managerId, answer.employeeId]);
    console.log('Employee manager updated successfully!');
    start(connection);
  } catch (error) {
    console.error('Error updating employee manager:', error);
    start(connection);
  }
}

// Function to view employees by manager
async function viewEmployeesByManager(connection) {
  try {
    // Perform SQL query to retrieve all employees and their managers
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title AS role,
        d.name AS department,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM 
        employees AS e
        LEFT JOIN roles AS r ON e.role_id = r.id
        LEFT JOIN departments AS d ON r.department_id = d.id
        LEFT JOIN employees AS m ON e.manager_id = m.id
      ORDER BY 
        manager, e.id
    `;
    const [rows] = await connection.query(query);
    // Display the employees grouped by manager
    console.log('Employees by Manager:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error retrieving employees by manager:', error);
    start(connection);
  }
}

// Function to view employees by department
async function viewEmployeesByDepartment(connection) {
  try {
    // Perform SQL query to retrieve all employees and their departments
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title AS role,
        d.name AS department
      FROM 
        employees AS e
        LEFT JOIN roles AS r ON e.role_id = r.id
        LEFT JOIN departments AS d ON r.department_id = d.id
      ORDER BY 
        department, e.id
    `;
    const [rows] = await connection.query(query);
    // Display the employees grouped by department
    console.log('Employees by Department:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error retrieving employees by department:', error);
    start(connection);
  }
}

// Function to delete a department
async function deleteDepartment(connection) {
  try {
    // Perform SQL query to retrieve all departments
    const [departments] = await connection.query('SELECT * FROM departments');
    // Prompt user to select the department to delete
    const answer = await inquirer.prompt([
      {
        name: 'departmentId',
        type: 'list',
        message: 'Select the department to delete:',
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      },
    ]);
    // Delete the selected department from the database
    await connection.query('DELETE FROM departments WHERE id = ?', answer.departmentId);
    console.log('Department deleted successfully!');
    start(connection);
  } catch (error) {
    console.error('Error deleting department:', error);
    start(connection);
  }
}

// Function to delete a role
async function deleteRole(connection) {
  try {
    // Perform SQL query to retrieve all roles
    const [roles] = await connection.query('SELECT * FROM roles');
    // Prompt user to select the role to delete
    const answer = await inquirer.prompt([
      {
        name: 'roleId',
        type: 'list',
        message: 'Select the role to delete:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);
    // Delete the selected role from the database
    await connection.query('DELETE FROM roles WHERE id = ?', answer.roleId);
    console.log('Role deleted successfully!');
    start(connection);
  } catch (error) {
    console.error('Error deleting role:', error);
    start(connection);
  }
}

// Function to delete an employee
async function deleteEmployee(connection) {
  try {
    // Perform SQL query to retrieve all employees
    const [employees] = await connection.query('SELECT * FROM employees');
    // Prompt user to select the employee to delete
    const answer = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'list',
        message: 'Select the employee to delete:',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
    ]);
    // Delete the selected employee from the database
    await connection.query('DELETE FROM employees WHERE id = ?', answer.employeeId);
    console.log('Employee deleted successfully!');
    start(connection);
  } catch (error) {
    console.error('Error deleting employee:', error);
    start(connection);
  }
}

// Function to view the total utilized budget of a department
async function viewDepartmentBudget(connection) {
  try {
    // Perform SQL query to calculate the total utilized budget of each department
    const query = `
      SELECT 
        d.name AS department,
        SUM(r.salary) AS utilized_budget
      FROM 
        roles AS r
        INNER JOIN departments AS d ON r.department_id = d.id
        INNER JOIN employees AS e ON r.id = e.role_id
      GROUP BY 
        d.id
      ORDER BY 
        utilized_budget DESC
    `;
    const [rows] = await connection.query(query);
    // Display the total utilized budget of each department
    console.log('Total Utilized Budget by Department:');
    console.table(rows);
    start(connection);
  } catch (error) {
    console.error('Error retrieving total utilized budget:', error);
    start(connection);
  }
}

// Initialize the application
initializeApp();