const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors')
const morgan = require('morgan')

// MIDDLEWEARES

dotenv.config();
const connectToDatabase = require('./config/Db');
connectToDatabase(); 
app.use(cors())
app.use(express.json())
app.use(morgan('dev')) // for logging

//DB CONNECTION

//const mongoose = require('mongoose');
/*
const dbURI = 'mongodb+srv://starlyn:S198727f@cluster0.w2zpqm3.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Continue with your application logic
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
*/
// ROUTES
app.use('/api/v1', require('./routes/posts'))
app.use('/api/v1', require('./routes/auth'))
app.use('/api/v1', require('./routes/features'))
app.use('/api/v1', require('./routes/customer'))
app.use('/api/v1', require('./routes/loan'))
app.use('/api/v1', require('./routes/payments'))
app.listen(process.env.PORT || 5000,  () => {
  console.log(`Backend server is running!`,process.env.PORT );
});



