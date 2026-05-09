const Gallery = require('../models/Gallery');

exports.getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { imageUrl, aspectRatio, category, public_id } = req.body;
    const newImage = new Gallery({ imageUrl, aspectRatio, category, public_id });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

