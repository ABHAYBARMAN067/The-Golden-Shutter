const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/authMiddleware');
const { getImages, uploadImage, deleteImage } = require('../controllers/galleryController');

router.get('/', getImages);
router.post('/upload', authenticateAdmin, uploadImage);
router.delete('/:imageId', authenticateAdmin, deleteImage);

module.exports = router;

