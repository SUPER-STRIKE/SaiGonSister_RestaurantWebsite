const db = require('../config/database');

const rows = db
  .prepare(
    `SELECT menuNumber, sectionId, sectionTitle
     FROM menu_items
     WHERE menuNumber IN ('11', '71', '52', 'D1')
     ORDER BY menuNumber`
  )
  .all();

const missing = db
  .prepare(
    `SELECT COUNT(*) AS n FROM menu_items
     WHERE sectionId IS NULL OR sectionId = ''`
  )
  .get();

console.log(rows);
console.log('missing headers:', missing.n);
if (missing.n > 0) process.exit(1);
