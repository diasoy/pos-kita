"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "./cart-context";
import { Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const { addToCart } = useCart();

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
    <div className="h-full flex flex-col p-6 space-y-6">
      {/* Search and Filters */}
      <Card className="shrink-0">
        <CardHeader>
          <CardTitle>Cari Produk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="flex items-center gap-2"
            >
              Semua
              <Badge variant="secondary" className="text-xs">
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
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {getCategoryCount(category.id)}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="flex-1 overflow-hidden">
        <Card className="shadow-sm h-full flex flex-col">
          <CardHeader className="pb-4 shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-lg">Produk</span>
                {selectedCategory !== "all" && (
                  <span className="text-sm font-normal text-muted-foreground">
                    - {getCategoryName(selectedCategory)}
                  </span>
                )}
              </span>
              <Badge variant="outline" className="px-3 py-1">
                {filteredProducts.length} produk
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1 overflow-y-auto">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                  >
                    <div className="relative">
                      {/* Product Image */}
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {/* {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-200"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        </div>
                      )} */}

                        {/* Stock Badge */}
                        {product.stock &&
                          product.stock <= 5 &&
                          product.stock > 0 && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="destructive" className="text-xs">
                                Stok Sedikit
                              </Badge>
                            </div>
                          )}

                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-sm">
                              Habis
                            </Badge>
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
                          <h4 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h4>

                          {/* Description */}
                          {/* {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                            {product.description}
                          </p>
                        )} */}

                          {/* Price and Stock */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-green-600 text-sm">
                                Rp {product.price.toLocaleString()}
                              </span>
                              {/* <span className="text-xs text-muted-foreground">
                              Stok: {product.stock || "Tersedia"}
                            </span> */}
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleAddToCart(product)}
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
