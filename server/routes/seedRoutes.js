const express = require('express');
const router = express.Router();
const { seedDemoData, clearUserData } = require('../controllers/seedController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, seedDemoData);
router.post('/clear', protect, clearUserData);

module.exports = router;
