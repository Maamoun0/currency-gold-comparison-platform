import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

async function takeScreenshots() {
  console.log("Starting Screenshot Capture Utility...");

  const screenshotDir = path.join(__dirname, "..", "public", "screenshots");
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
    console.log(`Created screenshots directory at ${screenshotDir}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: "ar-EG",
  });
  const page = await context.newPage();

  try {
    // 1. Homepage
    console.log("Loading homepage...");
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const homepagePath = path.join(screenshotDir, "homepage.png");
    await page.screenshot({ path: homepagePath, fullPage: false });
    console.log(`Captured homepage to ${homepagePath}`);

    // 2. Currency Details Page (USD)
    console.log("Loading currency details page for USD...");
    await page.goto("http://localhost:3000/currency/usd", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const detailsPath = path.join(screenshotDir, "currency_details.png");
    await page.screenshot({ path: detailsPath, fullPage: false });
    console.log(`Captured details page to ${detailsPath}`);

    // 3. Login Page
    console.log("Loading login page...");
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    const loginPath = path.join(screenshotDir, "login_page.png");
    await page.screenshot({ path: loginPath, fullPage: false });
    console.log(`Captured login page to ${loginPath}`);

    // 4. Fill in Admin credentials & log in
    console.log("Performing admin login...");
    await page.fill('input[type="email"]', "admin@egpmarket.com");
    await page.fill('input[type="password"]', "adminpassword");
    
    // Submit form (click the button containing "دخول" or submit the form)
    await page.click('button[type="submit"]');
    
    // Wait for navigation/redirect
    console.log("Waiting for redirection to Admin Dashboard...");
    await page.waitForTimeout(5000);

    // 5. Admin Dashboard
    // In case it didn't auto-redirect, navigate explicitly
    if (page.url() !== "http://localhost:3000/admin") {
      console.log("Manually navigating to admin dashboard...");
      await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });
      await page.waitForTimeout(3000);
    }
    
    const adminPath = path.join(screenshotDir, "admin_dashboard.png");
    await page.screenshot({ path: adminPath, fullPage: false });
    console.log(`Captured admin dashboard to ${adminPath}`);

    console.log("All screenshots captured successfully!");
  } catch (error: any) {
    console.error("Screenshot Capture Error:", error.message);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
