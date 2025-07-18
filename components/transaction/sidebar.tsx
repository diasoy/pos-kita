"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "./cart-context";
import { Plus } from "lucide-react";

const categories = [
  { id: "all", name: "Semua", count: 25 },
  { id: "makanan", name: "Makanan", count: 12 },
  { id: "minuman", name: "Minuman", count: 8 },
  { id: "snack", name: "Snack", count: 5 },
];

const products = [
  { id: 1, name: "Nasi Goreng", price: 15000, category: "makanan", stock: 10 },
  { id: 2, name: "Mie Ayam", price: 12000, category: "makanan", stock: 8 },
  { id: 3, name: "Ayam Bakar", price: 18000, category: "makanan", stock: 6 },
  { id: 4, name: "Es Teh", price: 5000, category: "minuman", stock: 15 },
  { id: 5, name: "Kopi", price: 8000, category: "minuman", stock: 12 },
  { id: 6, name: "Jus Jeruk", price: 10000, category: "minuman", stock: 10 },
  { id: 7, name: "Keripik", price: 10000, category: "snack", stock: 20 },
  { id: 8, name: "Biskuit", price: 7000, category: "snack", stock: 18 },
  { id: 9, name: "Coklat", price: 12000, category: "snack", stock: 15 },
];

export function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart } = useCart();

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="w-80 border-r glass-light backdrop-blur-lg p-4 space-y-4">
      {/* Categories */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">Kategori</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span>{category.name}</span>
              <Badge variant="secondary">{category.count}</Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Products */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-lg">
            Produk
            {selectedCategory !== "all" && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                - {categories.find((c) => c.id === selectedCategory)?.name}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{product.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {categories.find((c) => c.id === product.category)?.name}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-green-600">
                    Rp {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Stok: {product.stock}
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {product.stock === 0 ? "Stok Habis" : "Tambah"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
