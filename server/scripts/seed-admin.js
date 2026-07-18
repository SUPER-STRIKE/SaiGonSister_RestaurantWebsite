require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const db = require('../config/database');

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
const email = process.env.ADMIN_EMAIL;

if (!username || !password || !email) {
  console.error('Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_EMAIL in server/.env');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const result = db
  .prepare('INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)')
  .run(username, hash, email);

if (result.changes === 0) {
  console.log(`Admin "${username}" already exists`);
} else {
  console.log(`Admin "${username}" created`);
}
