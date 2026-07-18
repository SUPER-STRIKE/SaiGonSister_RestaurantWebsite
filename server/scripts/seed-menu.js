const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const dataPath = path.join(__dirname, '..', 'menu-data.json');
const { items } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const existing = db.prepare('SELECT COUNT(*) AS n FROM menu_items').get().n;
if (existing > 0) {
  console.log(`Menu already has ${existing} items. Skipping.`);
  process.exit(0);
}

const insert = db.prepare(`
  INSERT INTO menu_items (menuNumber, name, description, price, category, tags)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const seed = db.transaction((rows) => {
  for (const item of rows) {
    insert.run(
      item.menuNumber,
      item.name,
      item.description ?? null,
      item.price ?? 0,
      item.category,
      JSON.stringify(item.tags || [])
    );
  }
});

seed(items);
console.log(`Inserted ${items.length} menu items`);
