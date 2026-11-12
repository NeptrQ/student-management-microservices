const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Configure DNS for MongoDB Atlas SRV resolution
try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) {}

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://b80954643_db_user:Boyd1209@cluster0.oxcbzu5.mongodb.net/student_management?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Database
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected in Delete Microservice'))
  .catch(err => console.error('MongoDB Error:', err.message));

// Student Database Schema
const studentSchema = new mongoose.Schema({
  Student_id: { type: String, required: true },
  Student_name: { type: String },
  student_mobile: { type: String },
  student_email: { type: String },
  student_password: { type: String }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

app.use(cors());
app.use(express.json());

// Delete Student by URL param: DELETE /delete/:id
app.delete('/delete/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const deletedStudent = await Student.findOneAndDelete({ Student_id: studentId });
    if (!deletedStudent) {
      return res.status(404).json({ message: `Student ID ${studentId} not found` });
    }
    res.json({
      message: 'Student deleted successfully from database',
      deleted_student: deletedStudent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Student by JSON body: POST /delete
app.post('/delete', async (req, res) => {
  try {
    const { Student_id } = req.body;
    const deletedStudent = await Student.findOneAndDelete({ Student_id });
    if (!deletedStudent) {
      return res.status(404).json({ message: `Student ID ${Student_id} not found` });
    }
    res.json({
      message: 'Student deleted successfully from database',
      deleted_student: deletedStudent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Delete Microservice running on port ${PORT}`);
});
