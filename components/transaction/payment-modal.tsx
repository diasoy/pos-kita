"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Banknote, Receipt, CheckCircle } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  tax: number;
  finalTotal: number;
  onPaymentComplete: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  cartItems,
  total,
  tax,
  finalTotal,
  onPaymentComplete,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [cashAmount, setCashAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cashValue = parseFloat(cashAmount) || 0;
  const change = cashValue - finalTotal;

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);

    // Auto close after success
    setTimeout(() => {
      setIsSuccess(false);
      onPaymentComplete();
      onClose();
      setCashAmount("");
    }, 2000);
  };

  const canProcessPayment = () => {
    if (paymentMethod === "cash") {
      return cashValue >= finalTotal;
    }
    return true; // For card payments
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Pembayaran Berhasil!</h3>
            <p className="text-muted-foreground text-center">
              Transaksi telah diproses dengan sukses
            </p>
            {paymentMethod === "cash" && change > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Kembalian:{" "}
                  <span className="font-semibold">
                    Rp {change.toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Proses Pembayaran
          </DialogTitle>
          <DialogDescription>
            Pilih metode pembayaran dan konfirmasi transaksi
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h4 className="font-medium">Ringkasan Pesanan</h4>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          x{item.quantity}
                        </span>
                      </div>
                      <span>
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>Rp {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pajak (10%):</span>
                    <span>Rp {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      Rp {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h4 className="font-medium">Metode Pembayaran</h4>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cash")}
                className="flex items-center gap-2"
              >
                <Banknote className="h-4 w-4" />
                Tunai
              </Button>
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => setPaymentMethod("card")}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Kartu
              </Button>
            </div>

            {/* Cash Payment Details */}
            {paymentMethod === "cash" && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cash-amount">Jumlah Uang Diterima</Label>
                  <Input
                    id="cash-amount"
                    type="number"
                    placeholder="0"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                {cashValue > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Uang Diterima:</span>
                      <span>Rp {cashValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Bayar:</span>
                      <span>Rp {finalTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-1 pt-1 border-t">
                      <span>Kembalian:</span>
                      <span
                        className={
                          change >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        Rp {change.toLocaleString()}
                      </span>
                    </div>
                    {change < 0 && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Uang tidak mencukupi
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Card Payment Details */}
            {paymentMethod === "card" && (
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-blue-700">
                  Siapkan kartu untuk pembayaran
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!canProcessPayment() || isProcessing}
            className="min-w-32"
          >
            {isProcessing ? "Memproses..." : "Bayar Sekarang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
