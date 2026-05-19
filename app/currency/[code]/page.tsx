"use client";

import { useEffect, useState } from "react";
import PriceChart from "@/components/PriceChart";
import { ArrowLeft, Bell, Star, Share2, TrendingUp, TrendingDown, Clock } from "lucide-react";
import Link from "next/link";
import AlertForm from "@/features/alerts/AlertForm";

import * as React from "react";

export default function CurrencyPage({ params }: { params: Promise<{ code: string }> }) {
  const unwrappedParams = React.use(params);
  const code = unwrappedParams.code;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlertForm, setShowAlertForm] = useState(false);

  useEffect(() => {
    fetch(`/api/prices/history/${code}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [code]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-cairo">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
            <ArrowLeft size={20} />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{code.toUpperCase()} / EGP</h1>
              <span className="bg-financial-green/10 text-financial-green text-xs font-bold px-2 py-1 rounded">
                مباشر
              </span>
            </div>
            <p className="text-gray-400 text-lg">تحليل وسجل سعر {code.toUpperCase()} مقابل الجنيه المصري</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAlertForm(!showAlertForm)}
              className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl hover:bg-gray-800 transition-all"
            >
              <Bell size={18} className="text-financial-green" />
              <span>تنبيه السعر</span>
            </button>
            <button className="p-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-all">
              <Star size={18} />
            </button>
            <button className="p-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {showAlertForm && (
            <div className="mb-8 max-w-xl">
                <AlertForm currencyId={code} currencyCode={code.toUpperCase()} />
            </div>
        )}

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">مخطط السعر التاريخي</h3>
                <div className="flex gap-2">
                  {['1D', '1W', '1M', '1Y'].map((t) => (
                    <button key={t} className={`text-xs px-3 py-1 rounded-md ${t === '1D' ? 'bg-financial-green text-black font-bold' : 'bg-gray-800 text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center bg-gray-900/20 rounded-xl animate-pulse text-gray-500">
                  جاري تحميل الرسم البياني...
                </div>
              ) : (
                <PriceChart data={history} />
              )}
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">أفضل سعر حالي</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-financial-green/5 rounded-xl border border-financial-green/20">
                  <span className="text-gray-400">أفضل شراء</span>
                  <div className="text-right">
                    <div className="text-financial-green text-xl font-bold">48.65</div>
                    <div className="text-[10px] text-gray-500">بنك مصر</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                  <span className="text-gray-400">أفضل بيع</span>
                  <div className="text-right">
                    <div className="text-red-500 text-xl font-bold">48.50</div>
                    <div className="text-[10px] text-gray-500">البنك الأهلي</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                إحصائيات (24 ساعة)
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-800/50">
                  <span className="text-gray-500">أعلى سعر</span>
                  <span className="font-mono">48.90</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800/50">
                  <span className="text-gray-500">أدنى سعر</span>
                  <span className="font-mono">48.40</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">التغير اليومي</span>
                  <div className="flex items-center text-financial-green gap-1">
                    <TrendingUp size={14} />
                    <span className="font-bold">+0.12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
