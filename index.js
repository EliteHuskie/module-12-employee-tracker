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

// Function to add a department
function addDepartment() {
  // Prompt user to enter department name
  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter name of department:',
        validate: (value) => {
          if (value.trim()) {
            return true;
          }
          return 'Please enter a department name.';
        }
      }
    ])
    .then((answer) => {
      // Insert new department into database
      const query = 'INSERT INTO departments SET ?';
      connection.query(query, { name: answer.name }, (err) => {
        if (err) throw err;
        console.log('Department added successfully!');
        start();
      });
    });
}

// Function to add a role
function addRole() {
  // Perform SQL query to retrieve all departments
  const departmentQuery = 'SELECT * FROM departments';
  connection.query(departmentQuery, (err, departments) => {
    if (err) throw err;
    // Prompt user to enter role details
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter title of role:',
          validate: (value) => {
            if (value.trim()) {
              return true;
            }
            return 'Please enter a role title.';
          }
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter salary for role:',
          validate: (value) => {
            const valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a valid salary.';
          }
        },
        {
          name: 'departmentId',
          type: 'list',
          message: 'Select department for role:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
      .then((answer) => {
        // Insert new role into database
        const query = 'INSERT INTO roles SET ?';
        connection.query(
          query,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
          },
          (err) => {
            if (err) throw err;
            console.log('Role added successfully!');
            start();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  // Perform SQL query to retrieve all roles and employees
  const roleQuery = 'SELECT * FROM roles';
  const employeeQuery = 'SELECT * FROM employees';
  connection.query(roleQuery, (err, roles) => {
    if (err) throw err;
    connection.query(employeeQuery, (err, employees) => {
      if (err) throw err;
      // Prompt user to enter employee details
      inquirer
        .prompt([
          {
            name: 'firstName',
            type: 'input',
            message: 'Enter first name of employee:',
            validate: (value) => {
              if (value.trim()) {
                return true;
              }
              return 'Please enter the first name.';
            }
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
            }
          },
          {
            name: 'roleId',
            type: 'list',
            message: 'Select role for employee:',
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id
            }))
          },
          {
            name: 'managerId',
            type: 'list',
            message: 'Select manager for employee:',
            choices: [
              { name: 'None', value: null },
              ...employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
              }))
            ]
          }
        ])
        .then((answer) => {
          // Insert new employee into database
          const query = 'INSERT INTO employees SET ?';
          connection.query(
            query,
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.roleId,
              manager_id: answer.managerId
            },
            (err) => {
              if (err) throw err;
              console.log('Employee added successfully!');
              start();
            }
          );
        });
    });
  });
}

// Function to update an employee's manager
function updateEmployeeManager() {
  // Perform SQL query to retrieve all employees
  const employeeQuery = 'SELECT * FROM employees';
  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;
    // Prompt the user to select the employee and new manager
    inquirer
      .prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          }))
        },
        {
          name: 'managerId',
          type: 'list',
          message: 'Select the new manager for the employee:',
          choices: [
            { name: 'None', value: null },
            ...employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id
            }))
          ]
        }
      ])
      .then((answer) => {
        // Update the employee's manager in the database
        const query = 'UPDATE employees SET manager_id = ? WHERE id = ?';
        connection.query(
          query,
          [answer.managerId, answer.employeeId],
          (err) => {
            if (err) throw err;
            console.log('Employee manager updated successfully!');
            start();
          }
        );
      });
  });
}

// Function to view employees by manager
function viewEmployeesByManager() {
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
  connection.query(query, (err, res) => {
    if (err) throw err;
    // Display the employees grouped by manager
    console.log('Employees by Manager:');
    console.table(res);
    start();
  });
}

// Function to view employees by department
function viewEmployeesByDepartment() {
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
  connection.query(query, (err, res) => {
    if (err) throw err;
    // Display the employees grouped by department
    console.log('Employees by Department:');
    console.table(res);
    start();
  });
}

// Function to delete a department
function deleteDepartment() {
  // Perform SQL query to retrieve all departments
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, departments) => {
    if (err) throw err;
    // Prompt user to select department to delete
    inquirer
      .prompt([
        {
          name: 'departmentId',
          type: 'list',
          message: 'Select the department to delete:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
      .then((answer) => {
        // Delete selected department from the database
        const deleteQuery = 'DELETE FROM departments WHERE id = ?';
        connection.query(deleteQuery, answer.departmentId, (err) => {
          if (err) throw err;
          console.log('Department deleted successfully!');
          start();
        });
      });
  });
}