const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ayursutra', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  treatment: { type: String, required: true },
  status: { type: String, default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);

// Chat Schema
const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// API Routes

// Dashboard Statistics
app.get('/api/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppointments = await Patient.countDocuments({
      date: { $gte: today },
      status: 'Scheduled'
    });
    
    const pendingReports = await Patient.countDocuments({
      status: 'Scheduled'
    });
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newPatients = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      todayAppointments,
      pendingReports,
      newPatients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Patient
app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create New Patient/Appointment
app.post('/api/patients', async (req, res) => {
  try {
    const { name, age, date, treatment, status } = req.body;
    
    const patient = new Patient({
      name,
      age,
      date: date || new Date(),
      treatment,
      status: status || 'Scheduled'
    });
    
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Patient
app.put('/api/patients/:id', async (req, res) => {
  try {
    const { name, age, treatment, status } = req.body;
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, age, treatment, status },
      { new: true, runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Patient
app.delete('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat Messages
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sender } = req.body;
    
    const chat = new Chat({
      message,
      sender
    });
    
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Chat History
app.get('/api/chat', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ timestamp: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});