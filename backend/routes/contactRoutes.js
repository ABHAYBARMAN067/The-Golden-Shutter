const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactById,
  deleteContact,
} = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/', createContact);

// Protected routes (admin only)
router.get('/', authMiddleware, getContacts);
router.get('/:id', authMiddleware, getContactById);
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;
