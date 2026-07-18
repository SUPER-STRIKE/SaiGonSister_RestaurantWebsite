const path = require('path');
const fs = require('fs');
const db = require('../config/database');

const force = process.argv.includes('--force');
const dataPath = path.join(__dirname, '..', 'menu-data.json');
const { items } = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const existing = db.prepare('SELECT COUNT(*) AS n FROM menu_items').get().n;
if (existing > 0 && !force) {
  console.log(`Menu already has ${existing} items. Skipping. Use --force to re-import.`);
  process.exit(0);
}

if (existing > 0 && force) {
  db.exec('DELETE FROM daily_specials');
  db.exec('DELETE FROM menu_items');
  console.log('Cleared existing menu items.');
}

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
console.log(`Inserted ${items.length} menu items`);
