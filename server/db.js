const mongoose = require('mongoose');
require('dotenv').config();
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/my-app';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('Error connecting to MongoDB: ', err);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: ', err);
});

module.exports = mongoose;
