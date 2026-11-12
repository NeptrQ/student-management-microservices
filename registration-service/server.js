const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Configure DNS for MongoDB Atlas SRV resolution
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) {}

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://b80954643_db_user:Boyd1209@cluster0.oxcbzu5.mongodb.net/student_management?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Database
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully to student_management'))
  .catch(err => console.error('MongoDB Error:', err.message));

// Student Database Schema
const studentSchema = new mongoose.Schema({
  Student_id: { type: String, required: true, unique: true },
  Student_name: { type: String, required: true },
  student_mobile: { type: String, required: true },
  student_email: { type: String, required: true },
  student_password: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

app.use(cors());
app.use(express.json());

// Registration API
app.post('/register', async (req, res) => {
  try {
    const { Student_id, Student_name, student_mobile, student_email, student_password } = req.body;
    const newStudent = new Student({
      Student_id,
      Student_name,
      student_mobile,
      student_email,
      student_password
    });
    await newStudent.save();
    res.status(201).json({
      message: 'Student registered successfully in database',
      student: newStudent
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// View all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Registration Microservice running on port ${PORT}`);
});
