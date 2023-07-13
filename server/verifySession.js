// verifySession.js //

import jsonwebtoken from 'jsonwebtoken';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

function verifyJWT(token) {
   try {
      const decoded = jsonwebtoken.verify(token, 'secret-key');

      if(!decoded) {
      throw new Error('Error decoding');
      }
      else
         return decoded;

  	} catch (error) {
      console.error('Error verifying JWT: ', error);
      throw error;
  		}
}

function isSessionValid(token) {

	if (!token) {
	  throw new Error('No token provided');
	}
 
	try {
	  const decodedToken = verifyJWT(token);
 
	  const currentTime = Date.now() / 1000;
	  if (decodedToken.exp <= currentTime) {
		 throw new Error('Token has expired');
	  }
 
	  return true;
	} catch (error) {
	 throw error;
	}
 }

function verifySession() {
	const verifySessionApp = express();
   verifySessionApp.use(bodyParser.json());
   verifySessionApp.use(bodyParser.urlencoded({ extended: true }));
   verifySessionApp.use(cors());
   
   
   verifySessionApp.post('/ver', async (req, res) => {
		const token = req.headers.Authorization;

		try {
		isSessionValid(token);  
      res.status(201).json({ success: true, message: 'Verification successful' });
      } catch (errr) {
      console.error('Error while logging in: ', errr);
      res.status(500).json({ success: false, message: errr.toString()});
      }
   });
   
   const port = process.env.VERPORT || 3000;
   
   verifySessionApp.listen(port, () => {
     console.log(`verify listening on port ${port}`);
   });
}

export default verifySession;
