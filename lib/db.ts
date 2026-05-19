import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

// Initialize PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// JSON File Database Fallback (SQLite-like simple JSON db)
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to generate UUIDs
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Initial Mock Data
const initialData = {
  users: [
    {
      id: "admin-uuid-1111-2222-333333333333",
      email: "admin@egpmarket.com",
      password_hash: "$2a$12$L73r8X8.j35hCtf6jM1bSeiVvLd5a0gJq0jWpNu2c0m8wL4Q6.uCq", // password: adminpassword
      full_name: "مدير المنصة",
      role: "admin",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "user-uuid-1111-2222-333333333333",
      email: "user@egpmarket.com",
      password_hash: "$2a$12$L73r8X8.j35hCtf6jM1bSeiVvLd5a0gJq0jWpNu2c0m8wL4Q6.uCq", // password: adminpassword
      full_name: "أحمد مأمون",
      role: "user",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  banks: [
    { id: "bank-nbe", slug: "nbe", name_ar: "البنك الأهلي المصري", name_en: "National Bank of Egypt", logo_url: "/logos/nbe.png", website_url: "https://www.nbe.com.eg", is_active: true, created_at: new Date().toISOString() },
    { id: "bank-misr", slug: "banque-misr", name_ar: "بنك مصر", name_en: "Banque Misr", logo_url: "/logos/misr.png", website_url: "https://www.banquemisr.com", is_active: true, created_at: new Date().toISOString() },
    { id: "bank-cib", slug: "cib", name_ar: "البنك التجاري الدولي", name_en: "CIB", logo_url: "/logos/cib.png", website_url: "https://www.cibeg.com", is_active: true, created_at: new Date().toISOString() },
    { id: "bank-gold", slug: "market-gold", name_ar: "سوق الصاغة", name_en: "Gold Market", logo_url: "/logos/gold.png", website_url: "https://www.isagha.com", is_active: true, created_at: new Date().toISOString() },
    { id: "bank-binance", slug: "binance-p2p", name_ar: "بينانس P2P", name_en: "Binance P2P", logo_url: "/logos/binance.png", website_url: "https://p2p.binance.com", is_active: true, created_at: new Date().toISOString() }
  ],
  currencies: [
    { id: "curr-usd", code: "USD", name_ar: "دولار أمريكي", name_en: "US Dollar", symbol: "$", type: "fiat", created_at: new Date().toISOString() },
    { id: "curr-eur", code: "EUR", name_ar: "يورو", name_en: "Euro", symbol: "€", type: "fiat", created_at: new Date().toISOString() },
    { id: "curr-usdt", code: "USDT", name_ar: "دولار رقمي", name_en: "Tether USDT", symbol: "₮", type: "crypto", created_at: new Date().toISOString() },
    { id: "curr-gold24", code: "GOLD24", name_ar: "ذهب عيار 24", name_en: "Gold 24K", symbol: "g", type: "gold", created_at: new Date().toISOString() },
    { id: "curr-gold21", code: "GOLD21", name_ar: "ذهب عيار 21", name_en: "Gold 21K", symbol: "g", type: "gold", created_at: new Date().toISOString() }
  ],
  prices: [
    { id: generateUUID(), bank_id: "bank-nbe", currency_id: "curr-usd", buy_price: 48.40, sell_price: 48.50, last_updated: new Date().toISOString() },
    { id: generateUUID(), bank_id: "bank-misr", currency_id: "curr-usd", buy_price: 48.38, sell_price: 48.48, last_updated: new Date().toISOString() },
    { id: generateUUID(), bank_id: "bank-cib", currency_id: "curr-usd", buy_price: 48.42, sell_price: 48.52, last_updated: new Date().toISOString() },
    { id: generateUUID(), bank_id: "bank-binance", currency_id: "curr-usdt", buy_price: 49.10, sell_price: 49.10, last_updated: new Date().toISOString() },
    { id: generateUUID(), bank_id: "bank-gold", currency_id: "curr-gold24", buy_price: 3850.00, sell_price: 3950.00, last_updated: new Date().toISOString() },
    { id: generateUUID(), bank_id: "bank-gold", currency_id: "curr-gold21", buy_price: 3370.00, sell_price: 3450.00, last_updated: new Date().toISOString() }
  ],
  price_history: [
    { id: generateUUID(), bank_id: "bank-nbe", currency_id: "curr-usd", buy_price: 48.30, sell_price: 48.40, recorded_at: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: generateUUID(), bank_id: "bank-nbe", currency_id: "curr-usd", buy_price: 48.35, sell_price: 48.45, recorded_at: new Date(Date.now() - 3600000 * 1).toISOString() },
    { id: generateUUID(), bank_id: "bank-nbe", currency_id: "curr-usd", buy_price: 48.40, sell_price: 48.50, recorded_at: new Date().toISOString() }
  ],
  alerts: [],
  scraper_logs: []
};

// Check and read local database
function getLocalDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return initialData;
  }
}

// Write local database
function saveLocalDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Simple local query executor (mocks Postgres behavior)
function executeLocalQuery(text: string, params: any[] = []): { rows: any[] } {
  const db = getLocalDb();
  const sql = text.trim().replace(/\s+/g, " ");

  // 1. SELECT * FROM banks ORDER BY name_ar ASC
  if (sql.match(/SELECT \* FROM banks ORDER BY name_ar/i)) {
    const sorted = [...db.banks].sort((a, b) => a.name_ar.localeCompare(b.name_ar));
    return { rows: sorted };
  }

  // 2. SELECT id FROM banks WHERE slug = $1
  if (sql.match(/SELECT id FROM banks WHERE slug =/i)) {
    const slug = params[0] || (sql.match(/slug = '([^']+)'/i) || [])[1];
    const bank = db.banks.find((b: any) => b.slug === slug);
    return { rows: bank ? [{ id: bank.id }] : [] };
  }

  // 3. SELECT id FROM currencies WHERE code = $1
  if (sql.match(/SELECT id FROM currencies WHERE code =/i)) {
    const code = params[0] || (sql.match(/code = '([^']+)'/i) || [])[1];
    const currency = db.currencies.find((c: any) => c.code === code);
    return { rows: currency ? [{ id: currency.id }] : [] };
  }

  // 4. INSERT INTO banks
  if (sql.match(/INSERT INTO banks/i)) {
    const id = generateUUID();
    let slug = params[0], name_ar = params[1], name_en = params[2], logo_url = params[3], website_url = params[4];
    if (params.length === 0) {
      // Parse query parameters from statement if static
      const vals = sql.match(/VALUES \('([^']+)',\s*'([^']+)',\s*'([^']+)'\)/i);
      if (vals) {
        slug = vals[1]; name_ar = vals[2]; name_en = vals[3];
      }
    }
    const newBank = { id, slug, name_ar, name_en, logo_url, website_url, is_active: true, created_at: new Date().toISOString() };
    db.banks.push(newBank);
    saveLocalDb(db);
    return { rows: [{ id }] };
  }

  // 5. INSERT INTO currencies
  if (sql.match(/INSERT INTO currencies/i)) {
    const id = generateUUID();
    const code = params[0], name_ar = params[1], name_en = params[2], type = params[3];
    const newCurr = { id, code, name_ar, name_en, type, created_at: new Date().toISOString() };
    db.currencies.push(newCurr);
    saveLocalDb(db);
    return { rows: [{ id }] };
  }

  // 6. INSERT INTO prices ON CONFLICT
  if (sql.match(/INSERT INTO prices/i)) {
    const bank_id = params[0];
    const currency_id = params[1];
    const buy_price = parseFloat(params[2]);
    const sell_price = parseFloat(params[3]);
    const existingIndex = db.prices.findIndex((p: any) => p.bank_id === bank_id && p.currency_id === currency_id);
    
    if (existingIndex > -1) {
      db.prices[existingIndex].buy_price = buy_price;
      db.prices[existingIndex].sell_price = sell_price;
      db.prices[existingIndex].last_updated = new Date().toISOString();
    } else {
      db.prices.push({
        id: generateUUID(),
        bank_id,
        currency_id,
        buy_price,
        sell_price,
        last_updated: new Date().toISOString()
      });
    }
    saveLocalDb(db);
    return { rows: [] };
  }

  // 7. INSERT INTO price_history
  if (sql.match(/INSERT INTO price_history/i)) {
    const bank_id = params[0];
    const currency_id = params[1];
    const buy_price = parseFloat(params[2]);
    const sell_price = parseFloat(params[3]);
    db.price_history.push({
      id: generateUUID(),
      bank_id,
      currency_id,
      buy_price,
      sell_price,
      recorded_at: new Date().toISOString()
    });
    saveLocalDb(db);
    return { rows: [] };
  }

  // 8. INSERT INTO scraper_logs
  if (sql.match(/INSERT INTO scraper_logs/i)) {
    const bank_id = params[0];
    const status = params[1];
    db.scraper_logs.push({
      id: generateUUID(),
      bank_id,
      status,
      created_at: new Date().toISOString()
    });
    saveLocalDb(db);
    return { rows: [] };
  }

  // 9. SELECT * FROM prices with JOINs
  if (sql.match(/SELECT.*FROM prices p.*JOIN banks b.*JOIN currencies c/i)) {
    const resultRows = db.prices.map((p: any) => {
      const bank = db.banks.find((b: any) => b.id === p.bank_id) || {};
      const currency = db.currencies.find((c: any) => c.id === p.currency_id) || {};
      return {
        buy_price: String(p.buy_price),
        sell_price: String(p.sell_price),
        last_updated: p.last_updated,
        bank_name: bank.name_ar || "",
        bank_logo: bank.logo_url || "",
        currency_code: currency.code || "",
        currency_name: currency.name_ar || ""
      };
    });
    return { rows: resultRows };
  }

  // 10. SELECT * FROM gold prices
  if (sql.match(/c\.type = 'gold'/i)) {
    const goldCurrs = db.currencies.filter((c: any) => c.type === 'gold');
    const resultRows = db.prices
      .filter((p: any) => goldCurrs.some((gc: any) => gc.id === p.currency_id))
      .map((p: any) => {
        const currency = goldCurrs.find((gc: any) => gc.id === p.currency_id);
        return {
          buy_price: String(p.buy_price),
          sell_price: String(p.sell_price),
          last_updated: p.last_updated,
          code: currency.code,
          gold_name: currency.name_ar
        };
      });
    return { rows: resultRows };
  }

  // 11. SELECT COUNT(*) FROM users
  if (sql.match(/SELECT COUNT\(\*\) FROM users/i)) {
    return { rows: [{ count: db.users.length }] };
  }

  // 12. SELECT COUNT(*) FROM alerts
  if (sql.match(/SELECT COUNT\(\*\) FROM alerts/i)) {
    return { rows: [{ count: db.alerts.filter((a: any) => a.is_active).length }] };
  }

  // 13. SELECT COUNT(*) FROM prices
  if (sql.match(/SELECT COUNT\(\*\) FROM prices/i)) {
    return { rows: [{ count: db.prices.length }] };
  }

  // 14. SELECT * FROM scraper_logs
  if (sql.match(/SELECT \* FROM scraper_logs/i)) {
    const logs = [...db.scraper_logs].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);
    return { rows: logs };
  }

  // 15. SELECT * FROM users WHERE email = $1 or SELECT id FROM users WHERE email = $1
  if (sql.match(/SELECT.*FROM users WHERE email =/i)) {
    const email = params[0];
    const user = db.users.find((u: any) => u.email === email);
    if (!user) return { rows: [] };
    if (sql.match(/SELECT id/i)) {
      return { rows: [{ id: user.id }] };
    }
    return { rows: [user] };
  }

  // 16. INSERT INTO users
  if (sql.match(/INSERT INTO users/i)) {
    const id = generateUUID();
    const email = params[0];
    const password_hash = params[1];
    const full_name = params[2];
    const role = "user";
    const newUser = { id, email, password_hash, full_name, role, is_verified: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    db.users.push(newUser);
    saveLocalDb(db);
    return { rows: [newUser] };
  }
  // 17. SELECT recorded_at as date, buy_price as price FROM price_history ph JOIN currencies c ...
  if (sql.match(/recorded_at as date, buy_price as price/i)) {
    const code = params[0] || (sql.match(/c\.code = '([^']+)'/i) || [])[1];
    const currency = db.currencies.find((c: any) => c.code === code?.toUpperCase());
    if (!currency) return { rows: [] };
    const history = db.price_history
      .filter((ph: any) => ph.currency_id === currency.id)
      .sort((a: any, b: any) => a.recorded_at.localeCompare(b.recorded_at))
      .slice(0, 100)
      .map((ph: any) => ({
        date: ph.recorded_at,
        price: String(ph.buy_price)
      }));
    return { rows: history };
  }

  // 18. INSERT INTO alerts
  if (sql.match(/INSERT INTO alerts/i)) {
    const id = generateUUID();
    const user_id = params[0];
    const currency_id = params[1];
    const target_price = parseFloat(params[2]);
    const condition = params[3];
    const newAlert = {
      id,
      user_id,
      currency_id,
      target_price,
      condition,
      is_active: true,
      created_at: new Date().toISOString()
    };
    db.alerts.push(newAlert);
    saveLocalDb(db);
    return { rows: [{ id }] };
  }

  // 19. SELECT a.*, c.code, c.name_ar FROM alerts a JOIN currencies c ...
  if (sql.match(/FROM alerts a JOIN currencies c/i)) {
    const user_id = params[0];
    const userAlerts = db.alerts
      .filter((a: any) => a.user_id === user_id)
      .map((a: any) => {
        const currency = db.currencies.find((c: any) => c.id === a.currency_id) || {};
        return {
          ...a,
          code: currency.code || "",
          name_ar: currency.name_ar || ""
        };
      });
    return { rows: userAlerts };
  }

  // 20. SELECT id, email, full_name, role, is_verified, created_at FROM users ORDER BY created_at DESC
  if (sql.match(/SELECT id, email, full_name, role, is_verified, created_at FROM users/i)) {
    const sortedUsers = [...db.users]
      .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
      .map((u: any) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        is_verified: u.is_verified,
        created_at: u.created_at
      }));
    return { rows: sortedUsers };
  }

  // 21. UPDATE users SET role = $1 WHERE id = $2
  if (sql.match(/UPDATE users SET role =/i)) {
    const role = params[0];
    const userId = params[1];
    const index = db.users.findIndex((u: any) => u.id === userId);
    if (index > -1) {
      db.users[index].role = role;
      db.users[index].updated_at = new Date().toISOString();
      saveLocalDb(db);
    }
    return { rows: [] };
  }

  // 22. SELECT l.*, b.name_ar as bank_name FROM scraper_logs l LEFT JOIN banks b ...
  if (sql.match(/FROM scraper_logs l LEFT JOIN banks b/i)) {
    const logs = [...db.scraper_logs]
      .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))
      .slice(0, 50)
      .map((l: any) => {
        const bank = db.banks.find((b: any) => b.id === l.bank_id) || {};
        return {
          ...l,
          bank_name: bank.name_ar || ""
        };
      });
    return { rows: logs };
  }

  // Default fallback
  return { rows: [] };
}

// Core Query Function
export const query = async (text: string, params?: any[]) => {
  try {
    // Attempt real database connection
    const res = await pool.query(text, params);
    return res;
  } catch (error: any) {
    // Fallback to file-based JSON DB on connection issues
    if (
      error.code === "ECONNREFUSED" || 
      error.message.includes("connect") ||
      error.message.includes("no password") ||
      error.message.includes("does not exist") ||
      error.code === "57P01"
    ) {
      // Silent warning in production, active logging in development
      if (process.env.NODE_ENV !== "production") {
        console.warn("[DB Fallback] PostgreSQL connection failed. Querying local db.json database...");
      }
      return executeLocalQuery(text, params);
    }
    // Re-throw if it's a real SQL syntax error
    throw error;
  }
};

export default pool;
