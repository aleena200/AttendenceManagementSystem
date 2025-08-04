// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    rollNumber: String,
    attendance: [
        {
            date: Date,
            status: { type: String, enum: ['Present', 'Absent'] }
        }
    ]
});



module.exports = mongoose.model('Student', studentSchema);
