-- Drop the database if it exists
DROP DATABASE IF EXISTS company_db;

-- Create the database
CREATE DATABASE company_db;
USE company_db;

-- Drop the tables if they exist
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

-- Create the departments table
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create the roles table
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create the employees table
CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Insert initial data into the departments table
INSERT INTO departments (name) VALUES ('Department 1'), ('Department 2'), ('Department 3');

-- Insert initial data into the roles table
INSERT INTO roles (title, salary, department_id) VALUES
  ('Role 1', 50000, 1),
  ('Role 2', 60000, 2),
  ('Role 3', 70000, 1);

-- Insert initial data into the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('Employee', '1', 1, NULL),
  ('Employee', '2', 2, 1),
  ('Employee', '3', 3, 1);