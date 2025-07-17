"use client";

import { CartProvider } from "@/components/transaction/cart-context";

export default function TransactionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <main>{children}</main>
      </div>
    </CartProvider>
  );
}
