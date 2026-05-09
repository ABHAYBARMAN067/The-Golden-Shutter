const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/authMiddleware');
const {
  createBooking,
  getBookings,
  deleteBooking,
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', authenticateAdmin, getBookings);
router.delete('/:bookingId', authenticateAdmin, deleteBooking);

module.exports = router;
