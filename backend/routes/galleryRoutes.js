const express = require('express');
const router = express.Router();
const { getImages, uploadImage, deleteImage } = require('../controllers/galleryController');

router.get('/', getImages);
router.post('/upload', uploadImage);
router.delete('/:imageId', deleteImage);

module.exports = router;

