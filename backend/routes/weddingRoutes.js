const express = require('express');
const router = express.Router();
const {
  getAllWeddings,
  getWeddingWithPhotos,
  createWedding,
  updateWedding,
  deleteWedding,
} = require('../controllers/weddingController');

router.get('/', getAllWeddings);
router.get('/:weddingId', getWeddingWithPhotos);
router.post('/', createWedding);
router.put('/:weddingId', updateWedding);
router.delete('/:weddingId', deleteWedding);

module.exports = router;
