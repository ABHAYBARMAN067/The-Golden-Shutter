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
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:5000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.type('application/json').send({});
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'The Golden Shutter Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      gallery: '/api/gallery',
      weddings: '/api/weddings',
      bookings: '/api/bookings',
      contact: '/api/contact'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', require('./routes/contactRoutes'));


const PORT = process.env.PORT || 5000;


app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
