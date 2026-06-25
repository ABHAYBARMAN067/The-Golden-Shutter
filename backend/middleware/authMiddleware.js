const dotenv = require('dotenv');
dotenv.config();

const getAdminCredentials = () => ({
  username: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASS,
});

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing credentials' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');

    const admin = getAdminCredentials();
    if (username !== admin.username || password !== admin.password) {
      return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
    }

    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};


module.exports = authenticateAdmin;
