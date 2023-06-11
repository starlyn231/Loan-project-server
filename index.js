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


// ROUTES
app.use('/api/v1', require('./routes/posts'))
app.use('/api/v1', require('./routes/auth'))
app.use('/api/v1', require('./routes/features'))



app.listen(process.env.PORT || 5000,  () => {
  console.log(`Backend server is running!`,process.env.PORT );
});


