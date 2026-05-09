const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();

// DNS Fix
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = require('./config/db');

const galleryRoutes = require('./routes/galleryRoutes');
const weddingRoutes = require('./routes/weddingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

//MongoDB Connect
connectDB();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', require('./routes/contactRoutes'));


const PORT = process.env.PORT || 5000;


app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);