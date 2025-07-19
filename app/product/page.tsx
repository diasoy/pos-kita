"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppNavbar } from "@/components/app-navbar";

interface Product {
  id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    image_url: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, category_id, name, description, price, image_url, created_at, updated_at"
      )
      .order("id", { ascending: false });
    if (error) setError(error.message);
    setProducts(data || []);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      price: Number(form.price),
      category_id: form.category_id ? Number(form.category_id) : null,
      description: form.description || null,
      image_url: form.image_url || null,
    };
    if (editId) {
      // Update
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editId);
      if (error) setError(error.message);
    } else {
      // Create
      const { error } = await supabase.from("products").insert(payload);
      if (error) setError(error.message);
    }
    setForm({
      name: "",
      price: "",
      category_id: "",
      description: "",
      image_url: "",
    });
    setEditId(null);
    fetchProducts();
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id ? product.category_id.toString() : "",
      description: product.description || "",
      image_url: product.image_url || "",
    });
    setEditId(product.id);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <AppNavbar />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Memuat...</p>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Harga</th>
                  <th className="p-2 border">Kategori</th>
                  <th className="p-2 border">Deskripsi</th>
                  <th className="p-2 border">Gambar</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-2 border">{product.name}</td>
                    <td className="p-2 border">
                      Rp {product.price.toLocaleString()}
                    </td>
                    <td className="p-2 border">{product.category_id}</td>
                    <td className="p-2 border">{product.description}</td>
                    <td className="p-2 border">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-2 border flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
