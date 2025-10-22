const express = require('express');
const router = express.Router();
const {
  createInsight,
  getInsights,
  deleteInsight,
} = require('../controllers/insightController');
const auth = require('../utils/authMiddleware');

// Manager routes
router.post('/', auth, createInsight);
router.get('/', auth, getInsights);
router.delete('/:id', auth, deleteInsight); // ✅ NEW delete route

module.exports = router;
