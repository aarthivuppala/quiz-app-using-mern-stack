const Result = require('../models/Result');
const Quiz = require('../models/Quiz');

// Submit quiz answers and calculate score
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const studentId = req.user.id;

    // Get quiz details
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if already submitted
    const existingResult = await Result.findOne({ quizId, studentId });
    if (existingResult) {
      return res.status(400).json({ message: 'You have already taken this quiz' });
    }

    // Calculate score
    let totalScore = 0;
    const processedAnswers = [];

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === question.correctOption;
      const marksObtained = isCorrect ? question.marks : 0;
      
      totalScore += marksObtained;
      
      processedAnswers.push({
        questionId: question._id,
        selectedOption: userAnswer,
        isCorrect,
        marksObtained
      });
    }

    const percentage = (totalScore / quiz.totalMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'O';
    else if (percentage >= 80) grade = 'A+';
    else if (percentage >= 70) grade = 'A';
    else if (percentage >= 60) grade = 'B+';
    else if (percentage >= 50) grade = 'B';
    else if (percentage >= 40) grade = 'C';
    else grade = 'F';

    // Save result
    const result = new Result({
      quizId,
      studentId,
      answers: processedAnswers,
      score: totalScore,
      totalMarks: quiz.totalMarks,
      percentage,
      grade,
      timeTaken,
      submittedAt: new Date()
    });

    await result.save();

    // Prepare response with correct answers for learning
    const questionsWithAnswers = quiz.questions.map((q, idx) => ({
      text: q.text,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
      userAnswer: answers[idx],
      isCorrect: processedAnswers[idx].isCorrect,
      marksObtained: processedAnswers[idx].marksObtained
    }));

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        score: totalScore,
        totalMarks: quiz.totalMarks,
        percentage,
        grade,
        timeTaken
      },
      questions: questionsWithAnswers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student's results for a specific quiz
exports.getQuizResult = async (req, res) => {
  try {
    const result = await Result.findOne({
      quizId: req.params.quizId,
      studentId: req.user.id
    }).populate('quizId', 'title subjectId');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all results for a student
exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id })
      .populate('quizId', 'title subjectId duration')
      .sort({ submittedAt: -1 });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leaderboard for a quiz
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Result.find({ quizId: req.params.quizId })
      .populate('studentId', 'name rollNumber')
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(20);
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get class analytics (Admin only)
// Get class analytics (Admin only)
exports.getClassAnalytics = async (req, res) => {
  try {
    const { subjectId } = req.query;
    let filter = {};
    
    if (subjectId) {
      const quizzes = await Quiz.find({ subjectId });
      const quizIds = quizzes.map(q => q._id);
      filter.quizId = { $in: quizIds };
    }

    const results = await Result.find(filter).populate('quizId');
    
    if (results.length === 0) {
      return res.json({ 
        totalSubmissions: 0,
        averageScore: 0,
        passCount: 0,
        failCount: 0,
        passPercentage: 0
      });
    }

    const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
    const passCount = results.filter(r => r.percentage >= 40).length;
    const failCount = results.length - passCount;

    res.json({
      totalSubmissions: results.length,
      averageScore: Math.round(averageScore),
      passCount,
      failCount,
      passPercentage: Math.round((passCount / results.length) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};