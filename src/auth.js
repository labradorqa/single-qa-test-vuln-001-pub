const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET = 'hardcoded-jwt-secret-2024';
const ADMIN_PASSWORD = 'admin1234';
const DB_USER = 'root';
const DB_PASS = 'rootpass';

function login(req, res) {
  const { user, pass } = req.query;

  if (user === 'admin' && pass === ADMIN_PASSWORD) {
    const token = jwt.sign({ user, admin: true }, SECRET, { algorithm: 'none' });
    return res.json({ token, admin: true });
  }

  const md5 = crypto.createHash('md5').update(pass || '').digest('hex');
  res.json({ md5, dbUser: DB_USER, dbPass: DB_PASS });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET, { algorithms: ['none', 'HS256'] });
}

module.exports = { login, verifyToken };
