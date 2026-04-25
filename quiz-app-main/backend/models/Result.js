const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: mongoose.Schema.Types.ObjectId,
  selectedOption: Number,
  isCorrect: Boolean,
  marksObtained: Number
});

const resultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: String,
  timeTaken: Number, // in seconds
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', resultSchema);