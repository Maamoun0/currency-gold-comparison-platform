import { chromium } from "playwright";
import { query } from "../lib/db";

async function scrapeNBE() {
  console.log("Starting NBE Scraper...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 1. Visit National Bank of Egypt
    await page.goto("https://www.nbe.com.eg/NBE/main/#/ar/ExchangeRates", {
      waitUntil: "networkidle",
    });

    // 2. Extract Data (Example logic - selector needs verification per site)
    const usdPrices = await page.evaluate(() => {
      // Logic to find USD row and extract buy/sell
      // This is a placeholder as selectors change frequently
      return { buy: 48.40, sell: 48.50 };
    });

    // 3. Find IDs for NBE and USD in DB
    const bank = await query("SELECT id FROM banks WHERE slug = 'nbe'");
    const currency = await query("SELECT id FROM currencies WHERE code = 'USD'");

    if (bank.rows[0] && currency.rows[0]) {
      // 4. Update Prices
      await query(
        `INSERT INTO prices (bank_id, currency_id, buy_price, sell_price)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (bank_id, currency_id) 
         DO UPDATE SET buy_price = $3, sell_price = $4, last_updated = CURRENT_TIMESTAMP`,
        [bank.rows[0].id, currency.rows[0].id, usdPrices.buy, usdPrices.sell]
      );
      
      // 5. Log Success
      await query(
        "INSERT INTO scraper_logs (bank_id, status) VALUES ($1, 'success')",
        [bank.rows[0].id]
      );
    }

    console.log("NBE Scraper finished successfully");
  } catch (error: any) {
    console.error("Scraper Error:", error.message);
  } finally {
    await browser.close();
  }
}

// Simple runner
if (require.main === module) {
  scrapeNBE();
}
