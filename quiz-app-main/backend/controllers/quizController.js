const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');
const Result = require('../models/Result');

// Create a new quiz (Admin only)
exports.createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      subjectId,
      unitNumber,
      questions,
      totalMarks,
      passingMarks,
      duration,
      startDate,
      endDate
    } = req.body;

    // Verify subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Calculate total marks from questions if not provided
    let calculatedTotalMarks = totalMarks;
    if (!calculatedTotalMarks && questions) {
      calculatedTotalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    }

    const quiz = new Quiz({
      title,
      description,
      subjectId,
      unitNumber,
      questions,
      totalMarks: calculatedTotalMarks,
      passingMarks,
      duration,
      startDate,
      endDate,
      createdBy: req.user.id,
      isActive: true
    });

    await quiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all quizzes (with filters)
exports.getQuizzes = async (req, res) => {
  try {
    const { subjectId, unitNumber, isActive } = req.query;
    let filter = {};

    if (subjectId) filter.subjectId = subjectId;
    if (unitNumber) filter.unitNumber = unitNumber;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Only show quizzes that are available (endDate not passed)
    filter.endDate = { $gte: new Date() };

    const quizzes = await Quiz.find(filter)
      .populate('subjectId', 'name code icon color')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('subjectId', 'name code icon color')
      .populate('createdBy', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Don't send correct answers if student is taking quiz
    // (We'll handle this in a separate endpoint)
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quizzes for a specific subject
exports.getQuizzesBySubject = async (req, res) => {
  try {
    const quizzes = await Quiz.find({
      subjectId: req.params.subjectId,
      endDate: { $gte: new Date() },
      isActive: true
    }).select('title description unitNumber duration totalMarks endDate');
    
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quiz (Admin only)
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete quiz (Admin only)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};