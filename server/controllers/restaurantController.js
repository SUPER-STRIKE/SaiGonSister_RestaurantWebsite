const db = require('../config/database');

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function parseHours(value) {
  if (value == null || value === '') return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function formatInfo(row) {
  return {
    location: row.location,
    city: row.city,
    email: row.email,
    phone: row.phone || '',
    hoursByDay: parseHours(row.hours_by_day),
    hoursNote: row.hours_note || '',
  };
}

function getRestaurantInfo(_req, res) {
  try {
    const row = db.prepare('SELECT * FROM restaurant_info WHERE id = 1').get();
    if (!row) {
      return res.status(404).json({ error: 'Restaurant info not found' });
    }
    return res.json(formatInfo(row));
  } catch (err) {
    console.error('getRestaurantInfo error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch restaurant info' });
  }
}

function updateRestaurantInfo(req, res) {
  try {
    const existing = db.prepare('SELECT * FROM restaurant_info WHERE id = 1').get();
    if (!existing) {
      return res.status(404).json({ error: 'Restaurant info not found' });
    }

    const location = req.body.location ?? existing.location;
    const city = req.body.city ?? existing.city;
    const email = req.body.email ?? existing.email;
    const phone = req.body.phone !== undefined ? req.body.phone : existing.phone;
    const hoursNote =
      req.body.hoursNote !== undefined ? req.body.hoursNote : existing.hours_note;

    let hoursByDay = parseHours(existing.hours_by_day);
    if (req.body.hoursByDay && typeof req.body.hoursByDay === 'object') {
      hoursByDay = { ...hoursByDay, ...req.body.hoursByDay };
    }

    for (const day of WEEK_DAYS) {
      if (typeof hoursByDay[day] !== 'string') {
        return res.status(400).json({ error: `hoursByDay.${day} must be a string` });
      }
    }

    db.prepare(
      `UPDATE restaurant_info
       SET location = ?, city = ?, email = ?, phone = ?, hours_by_day = ?, hours_note = ?
       WHERE id = 1`
    ).run(location, city, email, phone, JSON.stringify(hoursByDay), hoursNote);

    const row = db.prepare('SELECT * FROM restaurant_info WHERE id = 1').get();
    return res.json(formatInfo(row));
  } catch (err) {
    console.error('updateRestaurantInfo error:', err.message);
    return res.status(500).json({ error: 'Failed to update restaurant info' });
  }
}

module.exports = { getRestaurantInfo, updateRestaurantInfo };
