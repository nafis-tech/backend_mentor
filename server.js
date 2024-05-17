const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 55532;

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'todo_list'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

app.use(bodyParser.json());
app.use(cors());

// Get all todos
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  const { title, completed } = req.body;
  const query = 'INSERT INTO todos (title, completed) VALUES (?, ?)';
  db.query(query, [title, completed], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, title, completed });
  });
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const query = 'UPDATE todos SET title = ?, completed = ? WHERE id = ?';
  db.query(query, [title, completed, id], (err, result) => {
    if (err) throw err;
    res.json({ id, title, completed });
  });
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM todos WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
