const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

// Sample in-memory database
const users = [];

// GET all users
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// GET user by ID
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
});

// POST create user
app.post('/api/users', (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    return res.status(400).json({ error: 'Username and age are required' });
  }

  const newUser = {
    id: uuid.v4(),
    username,
    age,
    hobbies: hobbies || [],
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT update user by ID
app.put('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    username: username || users[userIndex].username,
    age: age || users[userIndex].age,
    hobbies: hobbies || users[userIndex].hobbies,
  };

  res.status(200).json(users[userIndex]);
});

// DELETE user by ID
app.delete('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(userIndex, 1);

  res.status(204).send();
});

// Handling non-existing endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Handling server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


