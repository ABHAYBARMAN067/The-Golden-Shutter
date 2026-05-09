const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  aspectRatio: { type: Number, required: true },
  category: { type: String, default: 'General' },
  public_id: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', gallerySchema);

