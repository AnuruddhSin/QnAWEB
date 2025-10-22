
const express = require('express');
const router = express.Router();
const { addAnswer, getAnswersByQuestion ,getAllAnswers } = require('../controllers/answerController');
const auth = require('../utils/authMiddleware');

router.post('/', auth, addAnswer);
router.get('/:questionId', auth, getAnswersByQuestion);
router.get('/', auth, getAllAnswers); // add this line

module.exports = router;
