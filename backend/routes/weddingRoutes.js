const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/authMiddleware');
const {
  getAllWeddings,
  getWeddingWithPhotos,
  createWedding,
  updateWedding,
  deleteWedding,
} = require('../controllers/weddingController');

router.get('/', authenticateAdmin, getAllWeddings);
router.get('/:weddingId', getWeddingWithPhotos);
router.post('/', authenticateAdmin, createWedding);
router.put('/:weddingId', authenticateAdmin, updateWedding);
router.delete('/:weddingId', authenticateAdmin, deleteWedding);

module.exports = router;
