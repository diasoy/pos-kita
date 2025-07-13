"use client";

import { Header } from "@/components/transaction/header";
import { CartProvider } from "@/components/transaction/cart-context";

export default function TransactionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </CartProvider>
  );
}
