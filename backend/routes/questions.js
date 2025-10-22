
const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, getQuestionById, deleteQuestion } = require('../controllers/questionController');
const auth = require('../utils/authMiddleware');

router.get('/', auth, getQuestions);
router.post('/', auth, createQuestion);
router.get('/:id', auth, getQuestionById);
router.delete('/:id', auth, deleteQuestion);

module.exports = router;
