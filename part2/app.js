const express = require('express');
const path = require('path');
require('dotenv').config();

const session = require('express-session'); // Added session support

const app = express();

// START OF CHANGES: adding session middleware
app.use(session({
  secret: 'doggysecret',
  resave: false,
  saveUninitialized: true
}));
// END OF CHANGES

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // START: add urlencoded parsing for form submissions
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// START OF CHANGES added top-level login route, that has moved from userRoutes to this file
const db = require('./models/db');
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE username = ? AND password_hash = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    const user = rows[0];
    req.session.user = user;

    const redirect = user.role === 'owner' ? '/owner-dashboard.html' : '/walker-dashboard.html';
    res.json({ success: true, redirect });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});
// END OF CHANGES



module.exports = app;