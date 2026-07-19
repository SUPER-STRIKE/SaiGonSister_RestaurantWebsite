const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../config/database');
const { sendOtpEmail } = require('../config/mailer');

async function login(req, res) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    db.prepare('DELETE FROM otp_verifications WHERE email = ?').run(user.email);
    db.prepare(
      'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?)'
    ).run(user.email, otp, expiresAt);

    await sendOtpEmail(user.email, otp);

    return res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('login error:', err.message);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}

module.exports = { login };
