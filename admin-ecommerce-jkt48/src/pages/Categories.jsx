import React, { useEffect, useState } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";
import CategoryForm from "../components/Fragments/CategoryForm";
import CategoryTable from "../components/Fragments/CategoryTable";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_name: "", slug: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Gagal memuat kategori");
    }
    setLoading(false);
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
        ? `http://localhost:5000/api/categories/${editId}`
        : "http://localhost:5000/api/categories";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal menyimpan kategori");
      setForm({ category_name: "", slug: "" });
      setIsEdit(false);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = (cat) => {
    setForm({ category_name: cat.category_name, slug: cat.slug });
    setIsEdit(true);
    setEditId(cat.category_id);
  };

  const handleCancelEdit = () => {
    setForm({ category_name: "", slug: "" });
    setIsEdit(false);
    setEditId(null);
  };

  const handleDelete = async (cat) => {
    if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/categories/${cat.category_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Gagal menghapus kategori");
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manajemen Kategori</h1>
      <CategoryForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        onCancel={handleCancelEdit}
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-[#cd0c0d] font-semibold animate-pulse">
          Memuat data kategori...
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </AdminLayout>
  );
}

export default Categories;
