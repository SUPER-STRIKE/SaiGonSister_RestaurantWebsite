const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
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

function verifyOtp(req, res) {
  try {
    const { otp } = req.body || {};

    if (!otp) {
      return res.status(400).json({ error: 'OTP is required' });
    }

    const now = new Date().toISOString();
    const row = db
      .prepare(
        'SELECT * FROM otp_verifications WHERE otp_code = ? AND expires_at > ? ORDER BY id DESC LIMIT 1'
      )
      .get(String(otp), now);

    if (!row) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    const user = db.prepare('SELECT id, username FROM users WHERE email = ?').get(row.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    db.prepare('DELETE FROM otp_verifications WHERE id = ?').run(row.id);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT_SECRET is not configured' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secret,
      { expiresIn: '8h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('verifyOtp error:', err.message);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
}

module.exports = { login, verifyOtp };
