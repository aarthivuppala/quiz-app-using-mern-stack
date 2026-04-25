const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const quizRoutes = require('./routes/quizzes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/quizzes', quizRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Quiz App API is running!',
    endpoints: {
      auth: '/api/auth',
      subjects: '/api/subjects',
      quizzes: '/api/quizzes'
    }
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:5000`);
  console.log(`📚 Subjects API: http://localhost:5000/api/subjects`);
  console.log(`📝 Quizzes API: http://localhost:5000/api/quizzes`);
  console.log(`🔐 Auth API: http://localhost:5000/api/auth`);
});