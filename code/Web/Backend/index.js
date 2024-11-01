require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configure MySQL connection using environment variables
const db = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
});

db.connect((err) => {
   if (err) throw err;
   console.log('Connected to MySQL');
});

// Login endpoint
app.post('/login', (req, res) => {
   const { username, password } = req.body;

   db.query('SELECT * FROM users WHERE username = (?)', [username], async (err, results) => {
      if (err) throw err;
      if (results.length && await bcrypt.compare(password, results[0].password)) {
         const token = jwt.sign({ id: results[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });
         res.json({ message: 'Login successful', token });
      } else {
         res.status(401).json({ message: 'Invalid credentials' });
      }
   });
});

app.listen(5000, () => console.log('Server running on port 5000'));
