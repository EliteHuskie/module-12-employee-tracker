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