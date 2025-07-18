"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from "lucide-react";
import { useCart } from "@/components/transaction/cart-context";
import { ProductGrid } from "@/components/transaction/product-grid";
import { PaymentModal } from "@/components/transaction/payment-modal";

const TransactionPage = () => {
  const { cartItems, updateQuantity, removeItem, clearCart, total } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const tax = total * 0.1;
  const finalTotal = total + tax;

  const handlePaymentComplete = () => {
    clearCart();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Product Grid - Main Content Area */}
      <div className="flex-1 lg:pr-96 overflow-auto">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <ProductGrid />
        </div>
      </div>

      {/* Shopping Cart - Right Side (Fixed on desktop, bottom on mobile) */}
      <div className="w-full lg:fixed lg:right-0 lg:top-0 lg:w-96 lg:h-screen lg:z-10">
        <Card className="h-full flex flex-col border-0 lg:rounded-none floating-card transform-none hover:transform-none">
          <CardHeader className="pb-4 glass-header border-b-0 shrink-0">
            <CardTitle className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang
              </span>
              <Badge variant="secondary" className="glass-light border-border">
                {cartItems.length} item
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
            {/* Cart Items - Scrollable Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <div className="p-6 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Keranjang kosong</p>
                    <p className="text-xs mt-1">
                      Tambahkan produk dari daftar produk
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm leading-tight truncate">
                            {item.name}
                          </h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700 ml-2 shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">
                          Rp {item.price.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right border-t pt-2">
                        <span className="text-sm font-semibold">
                          Subtotal: Rp{" "}
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Summary - Fixed at Bottom */}
            {cartItems.length > 0 && (
              <div className="glass-strong rounded-t-2xl p-4 space-y-3 shrink-0 border-t border-border mt-auto">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Pajak (10%):</span>
                    <span>Rp {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base border-t border-border pt-2">
                    <span>Total:</span>
                    <span className="text-foreground">
                      Rp {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full transform-none hover:transform-none"
                    size="sm"
                    onClick={clearCart}
                  >
                    Kosongkan Keranjang
                  </Button>
                  <Button
                    className="w-full py-5 transform-none hover:transform-none"
                    size="lg"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proses Pembayaran
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        cartItems={cartItems}
        total={total}
        tax={tax}
        finalTotal={finalTotal}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default TransactionPage;
