import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-bold text-lg">
              <Link href="/" className="text-orange-600 dark:text-orange-400">
                ☕ POS-Kita
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center gap-12 px-4 max-w-4xl text-center">
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <div className="text-6xl">☕</div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
              POS-Kita
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              Sistem Point of Sale Modern untuk Cafe Anda
            </p>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Kelola pesanan, inventory, dan transaksi cafe dengan mudah.
              Interface yang intuitif, laporan real-time, dan fitur lengkap
              untuk bisnis cafe modern.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 w-full mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2">Interface Modern</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Desain yang mudah digunakan untuk staff cafe dengan navigasi
                yang intuitif
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">Laporan Real-time</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor penjualan, stok, dan performa cafe dengan dashboard
                analytics
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-semibold text-lg mb-2">Multi Payment</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Terima pembayaran cash, kartu, dan digital wallet dengan mudah
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/transaction"
              className="bg-orange-600 dark:bg-orange-400 text-white dark:hover:bg-orange-500 px-6 py-3 rounded-lg shadow-lg transition-colors font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-xl"
            >
              🚀 Mulai Sekarang
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                100+
              </div>
              <div className="text-sm text-gray-500">Cafe Partner</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                50K+
              </div>
              <div className="text-sm text-gray-500">Transaksi/Bulan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                99.9%
              </div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                24/7
              </div>
              <div className="text-sm text-gray-500">Support</div>
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t border-gray-200 dark:border-gray-700 mx-auto text-center text-xs gap-8 py-8 bg-white/50 dark:bg-gray-900/50">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 POS-Kita. Dibuat dengan ❤️ untuk cafe Indonesia
          </p>
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline text-orange-600 dark:text-orange-400"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
