const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const CATEGORIES = new Set(['breakfast', 'lunch', 'dinner', 'drink']);

function parseJsonField(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function toJsonString(value, fallback) {
  if (value == null || value === '') return JSON.stringify(fallback);
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return JSON.stringify(fallback);
    }
  }
  return JSON.stringify(value);
}

function removeImageFile(imageUrl) {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function getMenuItems(req, res) {
  try {
    const { category, tag, specialty } = req.query;
    const clauses = [];
    const params = [];

    if (category) {
      if (!CATEGORIES.has(category)) {
        return res.status(400).json({
          error: 'category must be breakfast, lunch, dinner, or drink',
        });
      }
      clauses.push('m.category = ?');
      params.push(category);
    }

    if (tag) {
      clauses.push("m.tags LIKE ?");
      params.push(`%"${tag}"%`);
    }

    let sql = 'SELECT m.* FROM menu_items m';

    if (specialty === 'true') {
      const today = new Date().toISOString().slice(0, 10);
      sql += ' INNER JOIN daily_specials d ON d.menu_item_id = m.id AND d.special_date = ?';
      params.unshift(today);
    }

    if (clauses.length) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }

    sql += ' ORDER BY m.id ASC';

    const rows = db.prepare(sql).all(...params);
    return res.json(rows.map(formatItem));
  } catch (err) {
    console.error('getMenuItems error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}

function createMenuItem(req, res) {
  try {
    const { name, description, price, category, menuNumber } = req.body || {};

    if (!name || price == null || !category) {
      return res.status(400).json({ error: 'name, price, and category are required' });
    }
    if (!CATEGORIES.has(category)) {
      return res.status(400).json({ error: 'category must be breakfast, lunch, dinner, or drink' });
    }

    const tags = toJsonString(req.body.tags, []);
    const choices = toJsonString(req.body.choices, []);
    const addOns = toJsonString(req.body.addOns, []);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db
      .prepare(
        `INSERT INTO menu_items (menuNumber, name, description, price, category, tags, choices, addOns, imageUrl)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        menuNumber ?? null,
        name,
        description ?? null,
        Number(price),
        category,
        tags,
        choices,
        addOns,
        imageUrl
      );

    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(formatItem(item));
  } catch (err) {
    console.error('createMenuItem error:', err.message);
    return res.status(500).json({ error: 'Failed to create menu item' });
  }
}

function updateMenuItem(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const name = req.body.name ?? existing.name;
    const description =
      req.body.description !== undefined ? req.body.description : existing.description;
    const price = req.body.price !== undefined ? Number(req.body.price) : existing.price;
    const category = req.body.category ?? existing.category;
    const menuNumber =
      req.body.menuNumber !== undefined ? req.body.menuNumber : existing.menuNumber;

    if (!CATEGORIES.has(category)) {
      return res.status(400).json({ error: 'category must be breakfast, lunch, dinner, or drink' });
    }

    const tags =
      req.body.tags !== undefined ? toJsonString(req.body.tags, []) : existing.tags;
    const choices =
      req.body.choices !== undefined
        ? toJsonString(req.body.choices, [])
        : existing.choices;
    const addOns =
      req.body.addOns !== undefined ? toJsonString(req.body.addOns, []) : existing.addOns;

    let imageUrl = existing.imageUrl;
    if (req.file) {
      removeImageFile(existing.imageUrl);
      imageUrl = `/uploads/${req.file.filename}`;
    }

    db.prepare(
      `UPDATE menu_items
       SET menuNumber = ?, name = ?, description = ?, price = ?, category = ?,
           tags = ?, choices = ?, addOns = ?, imageUrl = ?
       WHERE id = ?`
    ).run(menuNumber, name, description, price, category, tags, choices, addOns, imageUrl, id);

    const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    return res.json(formatItem(item));
  } catch (err) {
    console.error('updateMenuItem error:', err.message);
    return res.status(500).json({ error: 'Failed to update menu item' });
  }
}

function deleteMenuItem(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    removeImageFile(existing.imageUrl);

    return res.json({ message: 'Menu item deleted' });
  } catch (err) {
    console.error('deleteMenuItem error:', err.message);
    return res.status(500).json({ error: 'Failed to delete menu item' });
  }
}

function formatItem(row) {
  return {
    ...row,
    tags: parseJsonField(row.tags, []),
    choices: parseJsonField(row.choices, []),
    addOns: parseJsonField(row.addOns, []),
  };
}

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
