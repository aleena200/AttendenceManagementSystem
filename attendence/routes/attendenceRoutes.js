// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/all', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});


router.get('/allWithRecords', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add a student
router.post('/add', async (req, res) => {
    const { name, rollNumber } = req.body;
    try {
        const student = new Student({ name, rollNumber, attendance: [] });
        await student.save();
        res.send('Student added');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Mark attendance
router.post('/mark', async (req, res) => {
    const { rollNumber, date, status } = req.body;
    try {
        const student = await Student.findOne({ rollNumber });
        if (!student) return res.status(404).send('Student not found');
        student.attendance.push({ date, status });
        await student.save();
        res.send('Attendance marked');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 📅 Group attendance by date
router.get('/groupedByDate', async (req, res) => {
  try {
    const students = await Student.find({});
    const attendanceMap = {};

    students.forEach(student => {
      student.attendance.forEach(record => {
        const date = record.date.toISOString().slice(0, 10); // Format: YYYY-MM-DD
        if (!attendanceMap[date]) attendanceMap[date] = [];

        attendanceMap[date].push({
          name: student.name,
          rollNumber: student.rollNumber,
          status: record.status
        });
      });
    });

    res.json(attendanceMap); // { "2025-08-02": [...], "2025-08-03": [...] }
  } catch (err) {
    res.status(500).send('Error grouping attendance');
  }
});


// View attendance
router.get('/:rollNumber', async (req, res) => {
    try {
        const student = await Student.findOne({ rollNumber: req.params.rollNumber });
        if (!student) return res.status(404).send('Student not found');
        res.json(student.attendance);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// DELETE a student
router.delete('/delete/:rollNumber', async (req, res) => {
  try {
    const result = await Student.findOneAndDelete({ rollNumber: req.params.rollNumber });
    if (!result) return res.status(404).send('Student not found');
    res.send('Student deleted successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update attendance status by roll number and date
router.put('/updateStatus', async (req, res) => {
  const { rollNumber, date, status } = req.body;

  try {
    const student = await Student.findOne({ rollNumber });

    if (!student) return res.status(404).send('Student not found');

    // Find attendance entry for the given date
    const attendanceEntry = student.attendance.find(a => 
      new Date(a.date).toISOString().slice(0, 10) === date
    );

    if (!attendanceEntry) return res.status(404).send('Attendance entry not found for that date');

    attendanceEntry.status = status;  // Update only the status
    await student.save();

    res.send('Attendance status updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// // New route to get all students with their attendance
// router.get('/allWithRecords', async (req, res) => {
//   try {
//     const students = await Student.find({});
//     res.json(students);
//   } catch (err) {
//     res.status(500).send('Server error');
//   }
// });




module.exports = router;
