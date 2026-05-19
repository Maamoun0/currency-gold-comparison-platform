"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, Search, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PriceData {
  bank_name: string;
  bank_logo: string;
  currency_code: string;
  currency_name: string;
  buy_price: string;
  sell_price: string;
  last_updated: string;
}

export default function HomePage() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch prices
    fetch("/api/prices")
      .then((res) => res.json())
      .then((data) => {
        setPrices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data.session))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-cairo">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-financial-green rounded-lg flex items-center justify-center font-bold text-black">
              $
            </div>
            <span className="text-xl font-bold tracking-tight">EGP Market</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-financial-green transition-colors text-white">الرئيسية</Link>
            <a href="#" className="hover:text-financial-green transition-colors">البنوك</a>
            <a href="#" className="hover:text-financial-green transition-colors">الذهب</a>
            <a href="#" className="hover:text-financial-green transition-colors">USDT</a>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                {session.user.role === "admin" && (
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium bg-gray-900 border border-gray-800 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <LayoutDashboard size={15} />
                    <span>لوحة التحكم</span>
                  </Link>
                )}
                <span className="text-sm text-gray-400 font-medium hidden sm:inline">{session.user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors border border-transparent hover:border-red-500/10"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 text-sm font-medium bg-financial-green text-black rounded-lg hover:bg-emerald-400 transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            مقارنة أسعار العملات <span className="text-financial-green">لحظة بلحظة</span>
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            نظام ذكي لمتابعة أسعار صرف العملات في كافة البنوك المصرية والسوق الموازي، بالإضافة إلى أسعار الذهب والعملات الرقمية.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "USD / EGP", price: "48.50", change: "+0.2%", up: true },
            { label: "Gold 24K", price: "3,850", change: "-1.5%", up: false },
            { label: "USDT / EGP", price: "49.10", change: "+0.5%", up: true },
            { label: "EUR / EGP", price: "52.30", change: "+0.1%", up: true }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-financial-green/50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                <span className={`flex items-center text-xs font-bold ${item.up ? 'text-financial-green' : 'text-red-500'}`}>
                  {item.up ? <TrendingUp size={14} className="mr-1"/> : <TrendingDown size={14} className="mr-1"/>}
                  {item.change}
                </span>
              </div>
              <div className="text-2xl font-bold group-hover:text-financial-green transition-colors">
                {item.price} <span className="text-xs text-gray-500 font-normal">EGP</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              أسعار الصرف في البنوك المصرية
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="ابحث عن بنك..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-950 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-financial-green w-full md:w-64 transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-800">
                  <th className="p-4 font-medium text-right">البنك</th>
                  <th className="p-4 font-medium">سعر الشراء</th>
                  <th className="p-4 font-medium">سعر البيع</th>
                  <th className="p-4 font-medium">آخر تحديث</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="p-8 bg-gray-900/10"></td>
                    </tr>
                  ))
                ) : prices.filter(p => p.bank_name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
                  prices.filter(p => p.bank_name.toLowerCase().includes(searchTerm.toLowerCase())).map((price, i) => (
                    <tr key={i} className="hover:bg-gray-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                            {price.bank_name[0]}
                          </div>
                          <span className="font-bold">{price.bank_name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-financial-green">{price.buy_price}</td>
                      <td className="p-4 font-mono">{price.sell_price}</td>
                      <td className="p-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(price.last_updated).toLocaleTimeString('ar-EG')}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link 
                          href={`/currency/${price.currency_code.toLowerCase()}`}
                          className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md transition-colors inline-block"
                        >
                          التفاصيل
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      لا توجد نتائج مطابقة أو لم يتم بدء تشغيل الـ Scraper بعد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-24 py-12 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            تم التطوير والتصميم بواسطة Ahmed Maamoun. جميع الحقوق محفوظة © 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
