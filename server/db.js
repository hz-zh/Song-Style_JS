import pkg from 'mongoose';
const { connect, connection } = pkg;
// change from require to import
import dotenv from 'dotenv';
dotenv.config();

//require('dotenv').config();
const mongoUrl = process.env.MONGO_URL;

const con = connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err);
});

connection.on('error', (err) => {
  console.error('MongoDB connection error: ', err);
});

export default con;
