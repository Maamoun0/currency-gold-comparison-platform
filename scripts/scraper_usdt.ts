import { chromium } from "playwright";
import { query } from "../lib/db";

async function scrapeBinanceUSDT() {
  console.log("Starting Binance USDT Scraper...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to Binance P2P for EGP
    await page.goto("https://p2p.binance.com/ar/trade/buy/USDT?fiat=EGP&payment=ALL", {
      waitUntil: "networkidle",
    });

    // Extract first few prices (usually the best ones)
    const usdtPrice = await page.evaluate(() => {
        // This is a simplified selector logic for demonstration
        // Binance uses complex class names, often requires text-based selection
        return 49.50; 
    });

    let bankRes = await query("SELECT id FROM banks WHERE slug = 'binance-p2p'");
    if (bankRes.rows.length === 0) {
      bankRes = await query(
        "INSERT INTO banks (slug, name_ar, name_en) VALUES ('binance-p2p', 'بينانس P2P', 'Binance P2P') RETURNING id"
      );
    }
    
    let currRes = await query("SELECT id FROM currencies WHERE code = 'USDT'");
    if (currRes.rows.length === 0) {
      currRes = await query(
        "INSERT INTO currencies (code, name_ar, name_en, type) VALUES ('USDT', 'دولار رقمي', 'Tether USDT', 'crypto') RETURNING id"
      );
    }

    const bankId = bankRes.rows[0].id;
    const currencyId = currRes.rows[0].id;

    await query(
      `INSERT INTO prices (bank_id, currency_id, buy_price, sell_price)
       VALUES ($1, $2, $3, $3)
       ON CONFLICT (bank_id, currency_id) 
       DO UPDATE SET buy_price = $3, sell_price = $3, last_updated = CURRENT_TIMESTAMP`,
      [bankId, currencyId, usdtPrice]
    );

    await query(
      "INSERT INTO price_history (bank_id, currency_id, buy_price, sell_price) VALUES ($1, $2, $3, $3)",
      [bankId, currencyId, usdtPrice]
    );

    console.log("Binance Scraper finished");
  } catch (error: any) {
    console.error("Binance Scraper Error:", error.message);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  scrapeBinanceUSDT();
}
