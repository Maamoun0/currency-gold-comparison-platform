"use client";

import { useState } from "react";
import { Bell, TrendingUp, DollarSign } from "lucide-react";

export default function AlertForm({ currencyId, currencyCode }: { currencyId: string, currencyCode: string }) {
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState("above");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        body: JSON.stringify({
          currencyId,
          targetPrice: parseFloat(targetPrice),
          condition,
        }),
      });
      
      if (res.ok) {
        setMessage("تم إنشاء التنبيه بنجاح!");
      } else {
        setMessage("حدث خطأ ما. تأكد من تسجيل الدخول.");
      }
    } catch (err) {
      setMessage("فشل الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="text-financial-green" size={20} />
        <h3 className="font-bold">إنشاء تنبيه سعر لـ {currencyCode}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">عندما يكون السعر</label>
          <select 
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 focus:border-financial-green outline-none"
          >
            <option value="above">أعلى من</option>
            <option value="below">أقل من</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">السعر المستهدف (EGP)</label>
          <div className="relative">
            <input 
              type="number" 
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="مثال: 49.50"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 focus:border-financial-green outline-none pr-10"
              required
            />
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-financial-green text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : "تفعيل التنبيه"}
        </button>

        {message && (
          <p className={`text-center text-sm ${message.includes("نجاح") ? "text-financial-green" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
