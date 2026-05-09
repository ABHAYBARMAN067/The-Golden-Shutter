const Wedding = require('../models/Wedding');
const Gallery = require('../models/Gallery');

const createSlug = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSlug = async (coupleName, weddingId = null) => {
  const baseSlug = createSlug(coupleName) || 'wedding-story';
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (weddingId) query._id = { $ne: weddingId };
    const existing = await Wedding.findOne(query);
    if (!existing) break;
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

// Get all weddings
exports.getAllWeddings = async (req, res) => {
  try {
    const weddings = await Wedding.find().sort({ createdAt: -1 });
    res.json(weddings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single wedding with its photos by id or slug
exports.getWeddingWithPhotos = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let wedding;

    if (/^[0-9a-fA-F]{24}$/.test(slugOrId)) {
      wedding = await Wedding.findById(slugOrId);
    }

    if (!wedding) {
      wedding = await Wedding.findOne({ slug: slugOrId });
    }

    if (!wedding) return res.status(404).json({ error: 'Wedding not found' });

    const photos = await Gallery.find({ weddingId: wedding._id }).sort({ createdAt: -1 });
    res.json({ ...wedding.toObject(), photos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new wedding
exports.createWedding = async (req, res) => {
  try {
    const { coupleName, location, weddingDate, featuredImage, description, videos, category } = req.body;

    if (!coupleName || !location || !weddingDate || !featuredImage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slug = await generateUniqueSlug(coupleName);
    const newWedding = new Wedding({
      coupleName,
      slug,
      location,
      weddingDate,
      featuredImage,
      category,
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
    const { coupleName, location, weddingDate, featuredImage, description, videos, category } = req.body;

    const slug = coupleName ? await generateUniqueSlug(coupleName, weddingId) : undefined;
    const updateData = {
      coupleName,
      location,
      weddingDate,
      featuredImage,
      category,
      description,
      videos: Array.isArray(videos) ? videos : [],
      updatedAt: new Date(),
    };

    if (slug) updateData.slug = slug;

    const wedding = await Wedding.findByIdAndUpdate(weddingId, updateData, { new: true });

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
