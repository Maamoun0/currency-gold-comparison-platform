"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Activity, 
  Bell, 
  Database, 
  ShieldCheck, 
  RefreshCw,
  LogOut
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/logs")
      ]);
      const statsData = await statsRes.json();
      const logsData = await logsRes.json();
      setStats(statsData);
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin text-financial-green">
          <RefreshCw size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-cairo p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة التحكم (الإدارة)</h1>
            <p className="text-gray-500">مراقبة أداء المنصة والسكريبترز</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchAdminData}
              className="bg-gray-900 border border-gray-800 p-2 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
            <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">الخادم متصل</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "إجمالي المستخدمين", value: stats?.usersCount || 0, icon: Users, color: "text-blue-500" },
            { label: "تنبيهات نشطة", value: stats?.activeAlerts || 0, icon: Bell, color: "text-yellow-500" },
            { label: "تحديثات الأسعار", value: stats?.pricesCount || 0, icon: Database, color: "text-green-500" },
            { label: "حالة الأمان", value: "محمي", icon: ShieldCheck, color: "text-emerald-500" },
          ].map((card, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <card.icon className={card.color} size={24} />
                <span className="text-xs text-gray-500 font-medium">مباشر</span>
              </div>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <div className="text-sm text-gray-400">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Logs Section */}
          <div className="lg:col-span-2 bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2">
                <Activity size={18} className="text-financial-green" />
                سجل مراقبة الـ Scrapers
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-800/50 text-gray-400">
                  <tr>
                    <th className="p-4 font-medium">المصدر</th>
                    <th className="p-4 font-medium">الحالة</th>
                    <th className="p-4 font-medium">التوقيت</th>
                    <th className="p-4 font-medium">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <tr key={i} className="hover:bg-gray-800/20">
                      <td className="p-4 font-bold">{log.bank_name || 'System'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] ${
                          log.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {log.status === 'success' ? 'ناجح' : 'فشل'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(log.created_at).toLocaleString('ar-EG')}
                      </td>
                      <td className="p-4 text-gray-400 max-w-xs truncate">
                        {log.error_message || '-'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">لا توجد سجلات حالياً</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & System Info */}
          <div className="space-y-6">
            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <button className="w-full text-right p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-sm flex items-center justify-between">
                  <span>تشغيل السكريبرز الآن</span>
                  <Activity size={14} />
                </button>
                <button className="w-full text-right p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-sm flex items-center justify-between">
                  <span>تصفير سجل الأخطاء</span>
                  <Database size={14} />
                </button>
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-red-500 mb-4">منطقة الخطر</h3>
              <button className="w-full text-right p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm flex items-center justify-between">
                <span>تفعيل وضع الصيانة</span>
                <ShieldCheck size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-850 mt-24 py-8 bg-gray-950/20 text-center">
        <p className="text-gray-500 text-xs">
          تم التطوير والتصميم بواسطة Ahmed Maamoun. جميع الحقوق محفوظة © 2026.
        </p>
      </footer>
    </div>
  );
}
