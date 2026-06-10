const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'naviapex-super-secret-key-2026';

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'website')));

// Initialize SQLite DB
const db = new sqlite3.Database('./naviapex.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      balance REAL DEFAULT 0.0,
      joinDate TEXT
    )`, () => {
      // Seed Owner Account
      const hash = bcrypt.hashSync('NaviApex2026!', 10);
      db.run(`INSERT OR IGNORE INTO users (username, email, password, role, joinDate) 
              VALUES ('NaviOwner', 'owner@navipex.gg', ?, 'owner', ?)`, [hash, new Date().toISOString()]);
    });

    db.run(`CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      title TEXT,
      price REAL,
      status TEXT DEFAULT 'pending',
      seller TEXT,
      attributes TEXT,
      date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      buyer TEXT,
      listingId INTEGER,
      price REAL,
      status TEXT DEFAULT 'pending',
      date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT,
      sender_username TEXT,
      content TEXT,
      timestamp TEXT
    )`);
  }
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const hash = await bcrypt.hash(password, 10);
  const joinDate = new Date().toISOString();

  db.run(`INSERT INTO users (username, email, password, joinDate) VALUES (?, ?, ?, ?)`, 
    [username, email, hash, joinDate], 
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Username or Email already exists.' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, userId: this.lastID });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
    
    // Remove password from user object
    delete user.password;
    res.json({ success: true, token, user });
  });
});

// ----------------------------------------------------
// LISTINGS ENDPOINTS
// ----------------------------------------------------

app.get('/api/listings', (req, res) => {
  db.all(`SELECT * FROM listings`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Parse JSON attributes
    const listings = rows.map(r => ({ ...r, attributes: JSON.parse(r.attributes || '{}') }));
    res.json(listings);
  });
});

app.post('/api/listings', authenticateToken, (req, res) => {
  const { type, title, price, attributes } = req.body;
  const seller = req.user.username;
  const date = new Date().toISOString();
  
  db.run(`INSERT INTO listings (type, title, price, seller, attributes, date) VALUES (?, ?, ?, ?, ?, ?)`,
    [type, title, price, seller, JSON.stringify(attributes || {}), date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// ----------------------------------------------------
// ORDERS ENDPOINTS
// ----------------------------------------------------

app.get('/api/orders', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM orders WHERE buyer = ?`, [req.user.username], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const { listingId, price } = req.body;
  const buyer = req.user.username;
  const date = new Date().toISOString();

  db.run(`INSERT INTO orders (buyer, listingId, price, date) VALUES (?, ?, ?, ?)`,
    [buyer, listingId, price, date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// ----------------------------------------------------
// MESSAGES ENDPOINTS
// ----------------------------------------------------

app.get('/api/messages/conversations', authenticateToken, (req, res) => {
  db.all(`SELECT DISTINCT order_id FROM messages ORDER BY timestamp DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.order_id));
  });
});

app.get('/api/messages/:order_id', authenticateToken, (req, res) => {
  const { order_id } = req.params;
  db.all(`SELECT * FROM messages WHERE order_id = ? ORDER BY timestamp ASC`, [order_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/messages/:order_id', authenticateToken, (req, res) => {
  const { order_id } = req.params;
  const { content } = req.body;
  const sender_username = req.user.username;
  const timestamp = new Date().toISOString();

  db.run(`INSERT INTO messages (order_id, sender_username, content, timestamp) VALUES (?, ?, ?, ?)`,
    [order_id, sender_username, content, timestamp],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    });
});

// Seed default owner listings if database is empty
app.post('/api/seed', (req, res) => {
  const defaultListings = [
    { type: 'accounts', title: 'Diamond 1 | Sky Piercer Universal Heirloom...', price: 299.00, seller: 'NaviOwner' },
    { type: 'accounts', title: 'Gibraltor Heirloom | Masters Animated Badge...', price: 270.00, seller: 'NaviOwner' },
    { type: 'boosting', title: 'Rank Boosting Service', price: 19.99, seller: 'NaviOwner' },
    { type: 'coaching', title: '1-on-1 Pro Coaching', price: 24.99, seller: 'NaviOwner' }
  ];
  
  const stmt = db.prepare(`INSERT INTO listings (type, title, price, seller, status, date) VALUES (?, ?, ?, ?, 'active', ?)`);
  defaultListings.forEach(l => {
    stmt.run([l.type, l.title, l.price, l.seller, new Date().toISOString()]);
  });
  stmt.finalize();
  res.json({ success: true, message: 'Database seeded' });
});

// Serve frontend for all non-API routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'website', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`NaviApex running on http://localhost:${PORT}`);
});
