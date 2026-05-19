import { chromium } from "playwright";
import { query } from "../lib/db";

async function scrapeGoldPrices() {
  console.log("Starting Gold Scraper...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Visit a reliable gold price provider for Egypt (e.g., iSagh or similar)
    // Note: This is an architectural example. Selectors depend on the source.
    await page.goto("https://www.isagha.com/ar", { waitUntil: "networkidle" });

    const goldPrices = await page.evaluate(() => {
      // Dummy logic to simulate extraction from DOM
      return [
        { name: "Gold 24K", code: "GOLD24", buy: 3850, sell: 3950 },
        { name: "Gold 21K", code: "GOLD21", buy: 3370, sell: 3450 },
      ];
    });

    // 2. Identify/Create Gold 'Bank' (Source)
    let sourceRes = await query("SELECT id FROM banks WHERE slug = 'market-gold'");
    if (sourceRes.rows.length === 0) {
      sourceRes = await query(
        "INSERT INTO banks (slug, name_ar, name_en) VALUES ('market-gold', 'سوق الصاغة', 'Gold Market') RETURNING id"
      );
    }
    const sourceId = sourceRes.rows[0].id;

    for (const gold of goldPrices) {
      // 3. Ensure Currency exists for Gold type
      let currRes = await query("SELECT id FROM currencies WHERE code = $1", [gold.code]);
      if (currRes.rows.length === 0) {
        currRes = await query(
          "INSERT INTO currencies (code, name_ar, name_en, type) VALUES ($1, $2, $3, 'gold') RETURNING id",
          [gold.code, gold.name, gold.name, 'gold']
        );
      }
      const currencyId = currRes.rows[0].id;

      // 4. Update Prices
      await query(
        `INSERT INTO prices (bank_id, currency_id, buy_price, sell_price)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (bank_id, currency_id) 
         DO UPDATE SET buy_price = $3, sell_price = $4, last_updated = CURRENT_TIMESTAMP`,
        [sourceId, currencyId, gold.buy, gold.sell]
      );
      
      // 5. Add to history for charts
      await query(
        "INSERT INTO price_history (bank_id, currency_id, buy_price, sell_price) VALUES ($1, $2, $3, $4)",
        [sourceId, currencyId, gold.buy, gold.sell]
      );
    }

    console.log("Gold Scraper finished successfully");
  } catch (error: any) {
    console.error("Gold Scraper Error:", error.message);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  scrapeGoldPrices();
}
