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

  const tax = total * 0.1; // 10% tax
  const finalTotal = total + tax;

  const handlePaymentComplete = () => {
    clearCart();
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Products Grid - Main Content Area */}
      <div className="flex-1 pr-96">
        <ProductGrid />
      </div>

      {/* Shopping Cart - Right Side (Fixed Position) */}
      <div className="fixed right-0 top-16 w-96 h-[calc(100vh-64px)] bg-white z-10 border-l shadow-lg">
        <Card className="h-full flex flex-col border-0 rounded-none">
          <CardHeader className="pt-6">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang
              </span>
              <Badge variant="secondary">{cartItems.length} item</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Cart Items */}
            <div
              className="flex-1 space-y-3 overflow-y-auto px-6"
              style={{ maxHeight: "calc(100vh - 350px)" }}
            >
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
                  <div key={item.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-green-600 font-semibold">
                        Rp {item.price.toLocaleString()}
                      </span>

                      <div className="flex items-center gap-2">
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

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <div className="border-t pt-4 space-y-3 bg-gray-50 -mx-6 mt-4 p-6 rounded-b-none">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pajak (10%):</span>
                    <span>Rp {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">
                      Rp {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proses Pembayaran
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Kosongkan Keranjang
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
