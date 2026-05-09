const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

exports.getImages = async (req, res) => {
  try {
    const { weddingId } = req.query;

    const filter = weddingId ? { weddingId } : {};
    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload gallery image to Cloudinary and save metadata in MongoDB
// Frontend sends:
//  - imageUrl: base64 data URL (data:image/...;base64,...)
//  - aspectRatio, category, weddingId
exports.uploadImage = async (req, res) => {
  try {
    const { imageUrl, aspectRatio, category, weddingId } = req.body;

    if (!weddingId) {
      return res.status(400).json({ error: 'weddingId is required' });
    }

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl (base64) is required' });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: process.env.CLOUDINARY_FOLDER || 'wedding-gallery',
      resource_type: 'image',
    });

    const newImage = new Gallery({
      weddingId,
      imageUrl: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      aspectRatio,
      category,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    console.error('uploadImage error:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await Gallery.findById(imageId);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    // Best-effort Cloudinary deletion
    if (image.public_id) {
      try {
        await cloudinary.uploader.destroy(image.public_id);
      } catch (e) {
        console.warn('Cloudinary destroy failed:', e.message);
      }
    }

    await Gallery.findByIdAndDelete(imageId);
    res.json({ message: 'Image deleted', image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


