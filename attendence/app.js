// app.js


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const attendenceRoutes = require('./routes/attendenceRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Attendance Management System API is working!');
});
app.use(express.static('public'));
app.use('/attendence', attendenceRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        app.listen(3000, () => console.log('🚀 Server running on port 3000'));
    })
    .catch(err => console.error('❌ Error connecting to MongoDB:', err));

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);
module.exports = app;

