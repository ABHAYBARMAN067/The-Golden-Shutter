const Wedding = require('../models/Wedding');
const Gallery = require('../models/Gallery');

// Get all weddings
exports.getAllWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find().sort({ createdAt: -1 });
    res.json(weddings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single wedding with its photos
exports.getWeddingWithPhotos = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const wedding = await Wedding.findById(weddingId);
    if (!wedding) return res.status(404).json({ error: 'Wedding not found' });

    const photos = await Gallery.find({ weddingId }).sort({ createdAt: -1 });
    res.json({ ...wedding.toObject(), photos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new wedding
exports.createWedding = async (req, res) => {
  try {
    const { coupleName, location, weddingDate, featuredImage, description, videos } = req.body;


    if (!coupleName || !location || !weddingDate || !featuredImage) {

      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newWedding = new Wedding({
      coupleName,
      location,
      weddingDate,
      featuredImage,
      description,
      videos: Array.isArray(videos) ? videos : [],
    });


    await newWedding.save();
    res.status(201).json(newWedding);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update wedding
exports.updateWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { coupleName, location, weddingDate, featuredImage, description, videos } = req.body;


    const wedding = await Wedding.findByIdAndUpdate(
      weddingId,
      {
        coupleName,
        location,
        weddingDate,
        featuredImage,
        description,
        videos: Array.isArray(videos) ? videos : [],
        updatedAt: new Date(),

      },
      { new: true }
    );

    if (!wedding) return res.status(404).json({ error: 'Wedding not found' });
    res.json(wedding);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete wedding (and its photos)
exports.deleteWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;

    const wedding = await Wedding.findByIdAndDelete(weddingId);
    if (!wedding) return res.status(404).json({ error: 'Wedding not found' });

    // Delete all photos for this wedding
    await Gallery.deleteMany({ weddingId });

    res.json({ message: 'Wedding and all photos deleted', wedding });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
