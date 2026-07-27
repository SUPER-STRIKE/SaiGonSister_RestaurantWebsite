const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'saigon.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function addColumnIfMissing(table, column, definition) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menuNumber TEXT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('breakfast','lunch','dinner','drink')),
    tags TEXT DEFAULT '[]',
    choices TEXT DEFAULT '[]',
    addOns TEXT DEFAULT '[]',
    imageUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS otp_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS daily_specials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    special_date TEXT NOT NULL,
    UNIQUE(menu_item_id, special_date)
  );

  CREATE TABLE IF NOT EXISTS restaurant_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    hours_by_day TEXT NOT NULL DEFAULT '{}',
    hours_note TEXT NOT NULL DEFAULT ''
  );
`);

addColumnIfMissing('menu_items', 'choices', "TEXT DEFAULT '[]'");
addColumnIfMissing('menu_items', 'addOns', "TEXT DEFAULT '[]'");

// Older DBs used UNIQUE(special_date) (one specialty per day). Allow several.
(function migrateDailySpecials() {
  const row = db
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'daily_specials'")
    .get();
  if (!row?.sql || !row.sql.includes('special_date TEXT NOT NULL UNIQUE')) return;

  db.exec(`
    CREATE TABLE daily_specials_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
      special_date TEXT NOT NULL,
      UNIQUE(menu_item_id, special_date)
    );
    INSERT OR IGNORE INTO daily_specials_new (id, menu_item_id, special_date)
      SELECT id, menu_item_id, special_date FROM daily_specials;
    DROP TABLE daily_specials;
    ALTER TABLE daily_specials_new RENAME TO daily_specials;
  `);
})();

(function seedRestaurantInfo() {
  const existing = db.prepare('SELECT id FROM restaurant_info WHERE id = 1').get();
  if (existing) return;

  const hoursByDay = {
    Monday: '11:00 AM - 10:00 PM',
    Tuesday: '11:00 AM - 10:00 PM',
    Wednesday: '11:00 AM - 10:00 PM',
    Thursday: '11:00 AM - 10:00 PM',
    Friday: '11:00 AM - 11:00 PM',
    Saturday: '11:00 AM - 11:00 PM',
    Sunday: '11:00 AM - 9:00 PM',
  };

  db.prepare(
    `INSERT INTO restaurant_info (id, location, city, email, phone, hours_by_day, hours_note)
     VALUES (1, ?, ?, ?, ?, ?, ?)`
  ).run(
    '774 Yonge Street',
    'Toronto, ON',
    'hello@saigonsister.ca',
    '(416) 555-0199',
    JSON.stringify(hoursByDay),
    'Breakfast served weekends until 3 PM'
  );
})();

module.exports = db;
