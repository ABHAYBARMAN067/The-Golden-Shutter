const Gallery = require('../models/Gallery');

exports.getImages = async (req, res) => {
  try {
    const { weddingId } = req.query;
    
    // If weddingId provided, get images for that wedding only
    const filter = weddingId ? { weddingId } : {};
    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { imageUrl, aspectRatio, category, public_id, weddingId } = req.body;
    
    if (!weddingId) {
      return res.status(400).json({ error: 'weddingId is required' });
    }

    const newImage = new Gallery({ 
      weddingId,
      imageUrl, 
      aspectRatio, 
      category, 
      public_id 
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await Gallery.findByIdAndDelete(imageId);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted', image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

