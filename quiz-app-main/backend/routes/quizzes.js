const express = require('express');
const router = express.Router();
const { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  getQuizzesBySubject,
  updateQuiz, 
  deleteQuiz 
} = require('../controllers/quizController');
const { 
  submitQuiz, 
  getQuizResult, 
  getMyResults, 
  getLeaderboard,
  getClassAnalytics
} = require('../controllers/resultController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Quiz routes
router.post('/', adminMiddleware, createQuiz);
router.get('/', getQuizzes);
router.get('/my-results', getMyResults);
router.get('/subject/:subjectId', getQuizzesBySubject);
router.get('/leaderboard/:quizId', getLeaderboard);
router.get('/class-analytics', authMiddleware, adminMiddleware, getClassAnalytics);
router.get('/:id', getQuizById);
router.put('/:id', adminMiddleware, updateQuiz);
router.delete('/:id', adminMiddleware, deleteQuiz);

// Submission routes
router.post('/:quizId/submit', submitQuiz);
router.get('/:quizId/result', getQuizResult);

module.exports = router;