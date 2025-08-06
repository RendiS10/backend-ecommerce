import React, { useEffect, useState } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";
import VariantForm from "../components/Fragments/VariantForm";
import VariantTable from "../components/Fragments/VariantTable";

function ProductVariants() {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    color: "",
    size: "",
    variant_stock: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, []);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/variants");
      const data = await res.json();
      setVariants(data);
    } catch (err) {
      setError("Gagal memuat varian");
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Gagal memuat produk");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/variants/${editId}`
        : "http://localhost:5000/api/variants";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal menyimpan varian");
      setForm({ product_id: "", color: "", size: "", variant_stock: "" });
      setIsEdit(false);
      setEditId(null);
      fetchVariants();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = (v) => {
    setForm({
      product_id: v.product_id,
      color: v.color || "",
      size: v.size || "",
      variant_stock: v.variant_stock,
    });
    setIsEdit(true);
    setEditId(v.variant_id);
  };

  const handleCancelEdit = () => {
    setForm({ product_id: "", color: "", size: "", variant_stock: "" });
    setIsEdit(false);
    setEditId(null);
  };

  const handleDelete = async (v) => {
    if (!window.confirm("Yakin ingin menghapus varian ini?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/variants/${v.variant_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Gagal menghapus varian");
      fetchVariants();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manajemen Varian Produk</h1>
      <VariantForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        onCancel={handleCancelEdit}
        productOptions={products}
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-[#cd0c0d] font-semibold animate-pulse">
          Memuat data varian...
        </div>
      ) : (
        <VariantTable
          variants={variants}
          onEdit={handleEdit}
          onDelete={handleDelete}
          productOptions={products}
        />
      )}
    </AdminLayout>
  );
}

export default ProductVariants;
