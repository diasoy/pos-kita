"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { useCart } from "./cart-context";
import {
  Plus,
  Search,
  Home,
  Package,
  // History,
  // Settings,
  ShoppingCart,
  CreditCard,
  History,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "../theme-switcher";
import { usePathname } from "next/navigation";

interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems } = useCart();
  const pathname = usePathname();

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const fetchCategoriesAndProducts = async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);

    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, created_at, updated_at")
        .order("name");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        setError("Gagal memuat kategori");
        setCategories([]);
      } else {
        setCategories(categoriesData || []);
      }

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(
          "id, name, description, price, category_id, image_url, created_at, updated_at"
        )
        .order("name");

      if (productsError) {
        console.error("Error fetching products:", productsError);
        setError("Gagal memuat produk");
        setProducts([]);
      } else {
        setProducts(productsData || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Terjadi kesalahan yang tidak terduga");
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (categoryId: number) => {
    return (
      categories.find((c) => c.id === categoryId)?.name ||
      `Category ${categoryId}`
    );
  };

  const getCategoryCount = (categoryId: number) => {
    return products.filter((p) => p.category_id === categoryId).length;
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category_id.toString(),
      stock: product.stock || 99,
    });
  };

  if (loading) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium mb-2">Terjadi Kesalahan</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchCategoriesAndProducts}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shrink-0 floating-card border-0 transform-none hover:transform-none">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <div className="flex items-center gap-4">
              <nav className="flex items-center space-x-6 flex-1">
                <Link
                  href="/"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors
                    ${
                      pathname === "/"
                        ? "text-orange-600 font-bold border-b-2 border-orange-600"
                        : "hover:text-primary"
                    }
                  `}
                >
                  <Home className="h-4 w-4" />
                  Landing
                </Link>
                <Link
                  href="/transaction"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors
                    ${
                      pathname === "/transaction"
                        ? "text-orange-600 font-bold border-b-2 border-orange-600"
                        : "hover:text-primary"
                    }
                  `}
                >
                  <CreditCard className="h-4 w-4" />
                  Transaction
                </Link>
                <Link
                  href="/history"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors
                    ${
                      pathname === "/history"
                        ? "text-orange-600 font-bold border-b-2 border-orange-600"
                        : "hover:text-primary"
                    }
                  `}
                >
                  <History className="h-4 w-4" />
                  History
                </Link>
                <Link
                  href="/product"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors
                    ${
                      pathname === "/product"
                        ? "text-orange-600 font-bold border-b-2 border-orange-600"
                        : "hover:text-primary"
                    }
                  `}
                >
                  <Package className="h-4 w-4" />
                  Products
                </Link>
              </nav>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <ThemeSwitcher />
              {/* Cart Info */}
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <Badge
                  variant="secondary"
                  className="min-w-[20px] glass-light border-border"
                >
                  {itemCount}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-light border-border"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200
                  ${
                    selectedCategory === "all"
                      ? "bg-orange-600 text-white shadow-lg "
                      : "bg-white dark:bg-gray-900 text-orange-600 border  hover:bg-orange-50 dark:hover:bg-orange-950"
                  }
                  hover:scale-105
                `}
              >
                Semua
                <Badge
                  variant="secondary"
                  className={`text-xs px-2 py-1 rounded-full ml-2 font-bold
                    ${
                      selectedCategory === "all"
                        ? "bg-white text-orange-600 border border-orange-400"
                        : "bg-orange-100 text-orange-600 border border-orange-200"
                    }
                  `}
                >
                  {products.length}
                </Badge>
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200
                    ${
                      selectedCategory === category.id
                        ? "bg-orange-600 text-white shadow-lg "
                        : "bg-white dark:bg-gray-900 text-orange-600 border  hover:bg-orange-50 dark:hover:bg-orange-950"
                    }
                    hover:scale-105
                  `}
                >
                  {category.name}
                  <Badge
                    variant="secondary"
                    className={`text-xs px-2 py-1 rounded-full ml-2 font-bold
                      ${
                        selectedCategory === category.id
                          ? "bg-white text-orange-600 border border-orange-400"
                          : "bg-orange-100 text-orange-600 border border-orange-200"
                      } 
                    `}
                  >
                    {getCategoryCount(category.id)}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="pb-6">
        <Card className="shadow-sm floating-card border-0 transform-none hover:transform-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <span className="text-lg">Produk</span>
                {selectedCategory !== "all" && (
                  <span className="text-sm font-normal text-muted-foreground">
                    - {getCategoryName(selectedCategory)}
                  </span>
                )}
              </span>
              <Badge
                variant="outline"
                className="px-3 py-1 glass-light border-border"
              >
                {filteredProducts.length} produk
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-muted-foreground">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm ? "Produk tidak ditemukan" : "Belum ada produk"}
                  </h3>
                  <p className="text-sm">
                    {searchTerm
                      ? `Tidak ada produk yang cocok dengan pencarian "${searchTerm}"`
                      : "Tidak ada produk dalam kategori ini"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden floating-card border-0 transition-all duration-300 group cursor-pointer transform-none hover:scale-105"
                    onClick={() =>
                      product.stock !== 0 && handleAddToCart(product)
                    }
                  >
                    <div className="relative">
                      {/* Product Image */}
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          {/* Category Badge */}
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(product.category_id)}
                          </Badge>

                          {/* Product Name */}
                          <h4 className="font-semibold text-sm">
                            {product.name}
                          </h4>

                          {/* Price and Stock */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm">
                                Rp {product.price.toLocaleString()}
                              </span>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={product.stock === 0}
                              variant={
                                product.stock === 0 ? "outline" : "default"
                              }
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {product.stock === 0 ? "Habis" : "Tambah"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
