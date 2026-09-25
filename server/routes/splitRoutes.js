const express = require('express');
const router = express.Router();
const {
  getGroups,
  getGroupById,
  createGroup,
  addGroupExpense,
  deleteGroupExpense,
  toggleSettlement,
  deleteGroup,
} = require('../controllers/splitController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getGroups)
  .post(createGroup);

router.route('/:id')
  .get(getGroupById)
  .delete(deleteGroup);

router.post('/:id/expenses', addGroupExpense);
router.delete('/:id/expenses/:expenseId', deleteGroupExpense);
router.post('/:id/settle', toggleSettlement);

module.exports = router;
