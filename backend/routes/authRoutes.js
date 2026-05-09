const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'password';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === adminUser && password === adminPass) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid username or password' });
});

module.exports = router;
