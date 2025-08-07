// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const attendenceRoutes = require('./routes/attendenceRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
  res.send('Attendance Management System API is working!');
});

app.use('/attendence', attendenceRoutes);
app.use('/auth', authRoutes);

// 🔁 Connect to DB (optional for serverless) — no app.listen()!
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ✅ Export app for Vercel serverless
module.exports = app;
