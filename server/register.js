// register.js //

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js';
import bcrypt from 'bcrypt';
import cors from 'cors';

const createUser = async (username, password, email) => {
   try {
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
  
     const usernameExists = await User.findOne({ username });
     const emailExists = await User.findOne({ email });
     if (usernameExists) {
       throw new Error('Username already exists, please try again');
     }
     else if (emailExists) {
       throw new Error('Email already exists, please try again');
     }
     else await user.save();
 
   } catch (error) {
     console.error('Error creating user account in creation:', error);
     delete db.models['User'];
     throw error;
   }
 };
 
 function register() {
  const regApp = express();
  regApp.use(bodyParser.json());
  regApp.use(bodyParser.urlencoded({ extended: true }));
  regApp.use(cors());
  
  
  regApp.post('/reg', async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const encryptPassword = await bcrypt.hash(password, 10);
      const userId = await createUser(username, encryptPassword, email);
    
      res.status(201).json({ success: true, message: 'User account created' });
    } catch (errr) {
      console.error('Error creating user account: ', errr);
      res.status(500).json({ success: false, message: errr.toString()});
    }
  });
  
  const port = process.env.REGPORT || 3000;
  
  regApp.listen(port, () => {
    console.log(`register listening on port ${port}`);
  });
 }

 export default register;
