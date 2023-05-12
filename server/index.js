require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Create a new user account
    const User = db.model('User', {
      username: String,
      password: String,
      email: String,
    });
    const user = new User({ username, password, email });
    await user.save();

    res.status(201).json({ success: true, message: 'User account created' });
  } catch (err) {
    console.error('Error creating user account: ', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
