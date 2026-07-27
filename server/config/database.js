const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function resolveDbPath() {
  if (process.env.DB_PATH) {
    return path.isAbsolute(process.env.DB_PATH)
      ? process.env.DB_PATH
      : path.join(process.cwd(), process.env.DB_PATH);
  }
  return path.join(__dirname, '..', 'saigon.db');
}

function openDatabase() {
  const preferred = resolveDbPath();
  try {
    fs.mkdirSync(path.dirname(preferred), { recursive: true });
    return new Database(preferred);
  } catch (err) {
    const fallback = path.join('/tmp', 'saigon.db');
    console.error(`DB open failed at ${preferred}: ${err.message}`);
    console.error(`Falling back to ${fallback}`);
    return new Database(fallback);
  }
}

const db = openDatabase();

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

// Sync admin login from env without wiping DB (menu stays). Single-admin app.
(function syncAdminFromEnv() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL;
  if (!username || !password || !email) return;

  const bcrypt = require('bcrypt');
  const hash = bcrypt.hashSync(password, 10);

  const byName = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (byName) {
    db.prepare('UPDATE users SET password = ?, email = ? WHERE id = ?').run(
      hash,
      email,
      byName.id
    );
    console.log(`Synced admin "${username}" from env`);
    return;
  }

  const any = db.prepare('SELECT id FROM users ORDER BY id ASC LIMIT 1').get();
  if (any) {
    db.prepare('UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?').run(
      username,
      hash,
      email,
      any.id
    );
    console.log(`Renamed admin to "${username}" from env`);
    return;
  }

  db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)').run(
    username,
    hash,
    email
  );
  console.log(`Bootstrapped admin user "${username}" from env`);
})();

// ponytail: Railway disk is ephemeral; re-seed stock menu when DB is empty. Ceiling: admin wipe-all returns on restart until persistent volume.
(function seedMenuIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM menu_items').get().n;
  if (count > 0) return;

  const dataPath = path.join(__dirname, '..', 'menu-data.json');
  if (!fs.existsSync(dataPath)) return;

  const { items } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (!Array.isArray(items) || items.length === 0) return;

  const insert = db.prepare(`
    INSERT INTO menu_items (menuNumber, name, description, price, category, tags, choices, addOns)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const seed = db.transaction((rows) => {
    for (const item of rows) {
      insert.run(
        item.menuNumber,
        item.name,
        item.description ?? null,
        item.price ?? 0,
        item.category,
        JSON.stringify(item.tags || []),
        JSON.stringify(item.choices || []),
        JSON.stringify(item.addOns || [])
      );
    }
  });
  seed(items);
  console.log(`Bootstrapped ${items.length} menu items from menu-data.json`);
})();

module.exports = db;
