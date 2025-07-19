"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, History, Package } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/transaction/cart-context";

export function AppNavbar() {
  const pathname = usePathname();
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Hide navbar on landing page
  if (pathname === "/") return null;

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
      <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center gap-6 font-bold text-lg">
          <Link
            href="/transaction"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname === "/transaction"
                ? "text-orange-600 font-bold border-b-2 border-orange-600"
                : "hover:text-primary"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Transaction
          </Link>
          <Link
            href="/history"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname === "/history"
                ? "text-orange-600 font-bold border-b-2 border-orange-600"
                : "hover:text-primary"
            }`}
          >
            <History className="h-4 w-4" />
            History
          </Link>
          <Link
            href="/product"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname === "/product"
                ? "text-orange-600 font-bold border-b-2 border-orange-600"
                : "hover:text-primary"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <Badge variant="secondary" className="min-w-[20px] border-border">
              {itemCount}
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
}
