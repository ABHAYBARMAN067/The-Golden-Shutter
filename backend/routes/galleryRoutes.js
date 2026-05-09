const express = require('express');
const router = express.Router();
const { getImages, uploadImage } = require('../controllers/galleryController');

router.get('/', getImages);
router.post('/upload', uploadImage);

module.exports = router;

