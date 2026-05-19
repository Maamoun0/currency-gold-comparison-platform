# EGP Market: Premium Currency & Gold Tracker

EGP Market is a premium, real-time gold, USDT, and currency exchange rates tracking and bank comparison platform for the Egyptian Pound (EGP). Designed with a sleek modern aesthetic, it helps users track and compare exchange rates across all major banks, the gold market, and parallel USDT rates in one unified dashboard.

Designed, developed, and maintained by **Ahmed Maamoun**.

---

## 📸 Platform Screenshots

### Home Page & Currency Board
Detailed price board tracking buy/sell rates, daily changes, and currency highlights.
![Home Page](public/screenshots/homepage_v2.png)

### Live Interactive Charts
Historical rate tracking and comparative visual analytics for EGP fluctuation.
![Currency Details](public/screenshots/currency_details_v2.png)

### Secure Admin Login
Administrative authentication portal for managing prices, users, and scrapers.
![Login Page](public/screenshots/login_page_v2.png)

### Scraper & System Control Center
Real-time scraper logs, manual executions, and critical maintenance actions.
![Admin Dashboard](public/screenshots/admin_dashboard_v2.png)

---

## ✨ Features

- **Multi-Source Scraping**: Automated Playwright scrapers for the National Bank of Egypt (NBE), iSagha Gold, and Binance P2P.
- **Sleek Glassmorphic Design**: Modern dark theme utilizing curated HSL palettes, Tailwind CSS, and micro-interactions powered by Framer Motion.
- **Interactive Charts**: Responsive charts showcasing historical exchange rates and trends.
- **Real-time Price Comparison**: Direct side-by-side comparison of currency buy/sell rates across official banking systems.
- **Smart Alerts System**: Custom user-defined thresholds with email and system notifications.
- **Full Admin Panel**: Dashboard for managing mock databases, scraping tasks, and error logs.
- **Database Fallback**: Smooth transition between PostgreSQL connection and local SQLite-like JSON data.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15.0.0 (App Router)
- **Frontend & Logic**: React 19, TypeScript, Lucide Icons
- **Styling**: Tailwind CSS (Tailwind v3), HSL variables, custom CSS animations
- **Scrapers / Automation**: Playwright, TypeScript Node (ts-node)
- **Database**: PostgreSQL (pg) with JSON local DB fallback
- **Authentication**: JWT-based session cookies with middleware routing protection

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or later)
- PostgreSQL (Optional, fallback database is built-in)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Maamoun0/currency-gold-comparison-platform.git
   cd currency-gold-comparison-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (use `.env.example` as a template):
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/egpmarket
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Running the Scrapers
To update currency rates, gold prices, and USDT values from live sources, run the background scripts:
```bash
# Update bank rates (NBE)
npm run scrape:nbe

# Update gold rates (iSagha)
npm run scrape:gold

# Update USDT parallel rate (Binance)
npm run scrape:usdt
```

---

## 🧑‍💻 Author & Designer

- **Ahmed Maamoun** (Software Engineer & Designer)
- Email: [ee602000@gmail.com](mailto:ee602000@gmail.com)
- GitHub: [@Maamoun0](https://github.com/Maamoun0)

*All rights reserved © 2026. Designed and developed from scratch by Ahmed Maamoun.*
