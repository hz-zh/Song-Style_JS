import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js';
const app = express();
import cors from 'cors';

const createUser = async (username, password, email) => {
  try {
    const usersCollection = db.collection('users');
  
    const userSchema = new db.Schema({
      username: { type: String, required: true },
      password: { type: String, required: true },
      email: { type: String, required: true }
    });
    const User = db.model('User', userSchema);
    
    const user = new User({
      username: username,
      password: password,
      email: email
    });

    const result = await usersCollection.insertOne(user);
    const userId = result.insertedId;
    return userId;
  } catch (error) {
    console.error('Error creating user account: ', error);
    throw new Error('Internal server error');
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.post('register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const userId = await createUser(username, password, email);
    // send response as a JSON
    res.json({
      success: true,
      message: 'User account created',
      userId: userId
    });
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
