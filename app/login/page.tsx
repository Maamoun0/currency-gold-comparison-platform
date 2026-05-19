"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Activity, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin 
      ? { email, password } 
      : { email, password, fullName };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ ما");
      }

      // Success
      if (data.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "فشلت العملية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-cairo flex flex-col justify-between">
      {/* Header / Nav */}
      <nav className="border-b border-gray-900 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-financial-green rounded-lg flex items-center justify-center font-bold text-black">
              $
            </div>
            <span className="text-xl font-bold tracking-tight">EGP Market</span>
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <span>الرئيسية</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-gray-900/40 border border-gray-800 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-financial-green/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLogin 
                ? "مرحباً بك مجدداً في منصة أسعار الصرف والذهب" 
                : "سجل الآن لتلقي إشعارات الأسعار ومتابعة السوق"}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أحمد مأمون"
                    className="w-full bg-gray-950/80 border border-gray-800 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-financial-green transition-colors text-right"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-950/80 border border-gray-800 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-financial-green transition-colors text-left dir-ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-950/80 border border-gray-800 rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-financial-green transition-colors text-left dir-ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-financial-green text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-55"
            >
              {loading ? "جاري المعالجة..." : (isLogin ? "دخول" : "إنشاء حساب")}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-500 relative z-10">
            {isLogin ? (
              <p>
                ليس لديك حساب؟{" "}
                <button onClick={() => setIsLogin(false)} className="text-financial-green hover:underline">
                  سجل الآن
                </button>
              </p>
            ) : (
              <p>
                لديك حساب بالفعل؟{" "}
                <button onClick={() => setIsLogin(true)} className="text-financial-green hover:underline">
                  تسجيل الدخول
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 bg-gray-950/30 text-center">
        <p className="text-gray-500 text-xs">
          تم التطوير والتصميم بواسطة Ahmed Maamoun. جميع الحقوق محفوظة © 2026.
        </p>
      </footer>
    </div>
  );
}
