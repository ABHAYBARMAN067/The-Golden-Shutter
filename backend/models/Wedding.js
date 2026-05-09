const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema({
  coupleName: { type: String, required: true },
  location: { type: String, required: true },
  weddingDate: { type: Date, required: true },
  featuredImage: { type: String, required: true },
  category: { type: String, enum: ['PreWedding', 'Weddings'], default: 'Weddings', required: true },
  description: { type: String, default: '' },
  videos: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Wedding', weddingSchema);
