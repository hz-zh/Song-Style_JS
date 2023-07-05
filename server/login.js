// login.js

import bcrypt from 'bcrypt';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jsonwebtoken from 'jsonwebtoken';
import db from './db.js';

function genJWT(user) {
   const payload = { id: user._id };
   const jwtToken = jsonwebtoken.sign(payload, 'secret-key', { expiresIn: '1h' });
    user.jwtToken = jwtToken;
    return { success: true, token: jwtToken };
}

async function loginUser(usernameOrEmail, password) {
   try {
      const userSchema = new db.Schema({
         _id: { type: db.Schema.Types.ObjectId, required: true },
         username: { type: String, required: true },
         password: { type: String, required: true },
         email: { type: String, required: true }
       });
      const User = db.model('User', userSchema);

      const user = await User.findOne({ username: usernameOrEmail }).select('+password') || await User.findOne({ email: usernameOrEmail }).select('+password');
      console.log('Retrieved User:', user);
      if (!user) {
      throw new Error('Username or email does not exist');
     }
     const isPasswordValid = bcrypt.compareSync(password, user.password);
     if (!isPasswordValid) {
       throw new Error('Password is incorrect');
     }

     return genJWT(user);
   } catch (error) {
     console.error('Error logging in user: ', error);
     delete db.models['User'];
     throw error;
   }
 }

function login() {
   const loginApp = express();
   loginApp.use(bodyParser.json());
   loginApp.use(bodyParser.urlencoded({ extended: true }));
   loginApp.use(cors());
   
   
   loginApp.post('/login', async (req, res) => {
     try {
      const { user, password } = req.body;
      if (!user || !password) {
        console.log('User: ' + user + ' Password: ' + password);
        throw new Error('Username or password is missing');
      }
      const userId = await loginUser(userOrEmail, password);

      console.log('User: ' + userOrEmail + ' Password: ' + password);
      console.log('User ID:', userId);
      console.log('User ID Token:', userId.token);
      console.log('User ID Success:', userId.success);
      console.log(':', userId.message);

      const jwtToken = userId.token;
      res.cookie('jwt', jwtToken, { httpOnly: true, secure: true });
      res.status(201).json({ success: userId.success, message: 'Login Successful' });
      } catch (errr) {
      console.error('Error while logging in: ', errr);
      res.status(500).json({ success: false, message: errr.toString()});
      }
   });
   
   const port = process.env.LOGPORT || 3000;
   
   loginApp.listen(port, () => {
     console.log(`login listening on port ${port}`);
   });
  }

export default login;


   