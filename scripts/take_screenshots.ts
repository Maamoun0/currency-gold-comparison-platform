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

  // Helper to wait for the page compilation and styles to load
  async function navigateAndEnsureStyles(url: string) {
    console.log(`Navigating to ${url}...`);
    // First load to trigger Next.js compilation
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Reload the page to ensure it gets served fully styled and compiled
    console.log(`Reloading ${url} to verify styles...`);
    await page.reload({ waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(5000);
  }

  try {
    // 1. Homepage
    await navigateAndEnsureStyles("http://localhost:3000/");
    const homepagePath = path.join(screenshotDir, "homepage.png");
    await page.screenshot({ path: homepagePath, fullPage: false });
    console.log(`Captured homepage to ${homepagePath}`);

    // 2. Currency Details Page (USD)
    await navigateAndEnsureStyles("http://localhost:3000/currency/usd");
    const detailsPath = path.join(screenshotDir, "currency_details.png");
    await page.screenshot({ path: detailsPath, fullPage: false });
    console.log(`Captured details page to ${detailsPath}`);

    // 3. Login Page
    await navigateAndEnsureStyles("http://localhost:3000/login");
    const loginPath = path.join(screenshotDir, "login_page.png");
    await page.screenshot({ path: loginPath, fullPage: false });
    console.log(`Captured login page to ${loginPath}`);

    // 4. Fill in Admin credentials & log in
    console.log("Performing admin login...");
    await page.fill('input[type="email"]', "admin@egpmarket.com");
    await page.fill('input[type="password"]', "adminpassword");
    
    // Submit form
    await page.click('button[type="submit"]');
    console.log("Waiting for login submission...");
    await page.waitForTimeout(5000);
    console.log("URL after login click:", page.url());
    const cookiesList = await context.cookies();
    console.log("Cookies after login click:", JSON.stringify(cookiesList, null, 2));

    // 5. Admin Dashboard
    console.log("Navigating to admin dashboard...");
    await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(5000);
    console.log("URL after navigating to admin dashboard:", page.url());
    console.log("Cookies after navigating to admin dashboard:", JSON.stringify(await context.cookies(), null, 2));
    
    // Reload admin dashboard to ensure all stats/logs are rendered and compiled
    console.log("Reloading admin dashboard...");
    await page.reload({ waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(5000);
    console.log("URL after reload:", page.url());
    
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
