const express = require('express');
const router = express.Router();
const { 
  getAllSubjects, 
  getSubjectById, 
  getSubjectByCode 
} = require('../controllers/subjectController');
const { authMiddleware } = require('../middleware/auth');

// All subject routes require authentication
router.use(authMiddleware);

// Get all subjects
router.get('/', getAllSubjects);

// Get subject by ID
router.get('/:id', getSubjectById);

// Get subject by code
router.get('/code/:code', getSubjectByCode);

module.exports = router;