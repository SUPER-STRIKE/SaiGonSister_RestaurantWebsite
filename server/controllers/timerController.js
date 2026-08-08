const db = require('../config/database');

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function getTimerRow() {
  return db.prepare('SELECT ends_at FROM site_timer WHERE id = 1').get();
}

function getTimer(_req, res) {
  const row = getTimerRow();
  return res.json({ endsAt: row ? row.ends_at : null });
}

function startTimer(_req, res) {
  const existing = getTimerRow();
  if (existing) {
    return res.status(409).json({ error: 'Timer already started' });
  }

  const endsAt = Date.now() + THIRTY_DAYS_MS;
  db.prepare('INSERT INTO site_timer (id, ends_at) VALUES (1, ?)').run(endsAt);
  return res.json({ endsAt });
}

function ownerTimer(req, res) {
  const secret = process.env.TIMER_OWNER_SECRET || '';
  if (!secret || req.body?.secret !== secret) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const action = String(req.body?.action || '').trim();
  if (action === 'clear') {
    db.prepare('DELETE FROM site_timer WHERE id = 1').run();
    return res.json({ endsAt: null });
  }

  if (action === 'renew') {
    const endsAt = Date.now() + THIRTY_DAYS_MS;
    db.prepare(
      `INSERT INTO site_timer (id, ends_at) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET ends_at = excluded.ends_at`
    ).run(endsAt);
    return res.json({ endsAt });
  }

  // Force expired so you can test the contact message UI.
  if (action === 'expire') {
    const endsAt = Date.now() - 1;
    db.prepare(
      `INSERT INTO site_timer (id, ends_at) VALUES (1, ?)
       ON CONFLICT(id) DO UPDATE SET ends_at = excluded.ends_at`
    ).run(endsAt);
    return res.json({ endsAt });
  }

  return res.status(400).json({ error: 'action must be clear, renew, or expire' });
}

module.exports = { getTimer, startTimer, ownerTimer };
