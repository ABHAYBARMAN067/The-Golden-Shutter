const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const galleryRoutes = require('./routes/galleryRoutes');
const weddingRoutes = require('./routes/weddingRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));


app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/weddings', weddingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

