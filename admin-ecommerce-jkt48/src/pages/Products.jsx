import React, { useEffect, useState } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";
import ProductForm from "../components/Fragments/ProductForm";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    imagePreview: "",
    categoryOptions: [],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Gagal memuat produk");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
      setForm((prev) => ({ ...prev, categoryOptions: data }));
    } catch (err) {
      setError("Gagal memuat kategori");
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setForm((prev) => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file),
        }));
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/products/${editId}`
        : "http://localhost:5000/api/products";
      let body;
      let headers = { Authorization: `Bearer ${token}` };
      // Jangan set Content-Type jika menggunakan FormData agar boundary otomatis
      if (form.image instanceof File) {
        body = new FormData();
        body.append("product_name", form.name);
        body.append("description", form.description);
        body.append("price", form.price);
        body.append("category_id", form.category);
        body.append("stock", 1);
        body.append("main_image", form.image);
        // Hapus Content-Type jika ada
        delete headers["Content-Type"];
      } else {
        body = new FormData();
        body.append("product_name", form.name);
        body.append("description", form.description);
        body.append("price", form.price);
        body.append("category_id", form.category);
        body.append("stock", 1);
        body.append("main_image", form.image);
        delete headers["Content-Type"];
      }
      const res = await fetch(url, {
        method,
        headers,
        body,
      });
      if (!res.ok) throw new Error("Gagal menyimpan produk");
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        imagePreview: "",
      });
      setIsEdit(false);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.product_name || product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category_id || product.category || "",
      image: "",
      imagePreview: product.main_image || product.image || "",
      categoryOptions: categories,
    });
    setIsEdit(true);
    setEditId(product.id || product.product_id);
  };

  const handleCancelEdit = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      imagePreview: "",
      categoryOptions: categories,
    });
    setIsEdit(false);
    setEditId(null);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#cd0c0d]">
        <FaPlus className="text-green-600" /> Manajemen Produk
      </h1>
      <ProductForm
        form={{ ...form, categoryOptions: categories }}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isEdit={isEdit}
        onCancel={handleCancelEdit}
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="flex items-center gap-2 text-lg text-[#cd0c0d] font-semibold animate-pulse">
          <svg
            className="w-6 h-6 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 018-8"
              strokeWidth="4"
              className="opacity-75"
            />
          </svg>
          Memuat data produk...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-4 bg-white animate-fade-in">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gradient-to-r from-[#ffeaea] to-[#fff5f5] text-[#cd0c0d]">
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Deskripsi</th>
                <th className="p-2 border">Harga</th>
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Foto</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr
                  key={p.id || p.product_id || idx}
                  className={
                    idx % 2 === 0
                      ? "bg-white"
                      : "bg-[#fff5f5] hover:bg-[#ffeaea] transition"
                  }
                >
                  <td className="border p-2 font-semibold flex items-center gap-2">
                    <FaPlus className="text-[#cd0c0d]" />{" "}
                    {p.product_name || p.name}
                  </td>
                  <td className="border p-2 text-gray-700">{p.description}</td>
                  <td className="border p-2 text-green-700 font-bold">
                    Rp {Number(p.price).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {categories.find(
                      (cat) => cat.category_id === (p.category_id || p.category)
                    )
                      ? categories.find(
                          (cat) =>
                            cat.category_id === (p.category_id || p.category)
                        ).category_name
                      : p.category_id || p.category}
                  </td>
                  <td className="border p-2">
                    {p.main_image || p.image ? (
                      <img
                        src={
                          p.main_image &&
                          (p.main_image.startsWith("uploads/") ||
                            p.main_image.startsWith("/uploads/"))
                            ? `http://localhost:5000/${p.main_image.replace(
                                /^\/+/,
                                ""
                              )}`
                            : p.main_image && p.main_image.startsWith("http")
                            ? p.main_image
                            : p.image && p.image.startsWith("uploads/")
                            ? `http://localhost:5000/${p.image.replace(
                                /^\/+/,
                                ""
                              )}`
                            : p.image && p.image.startsWith("http")
                            ? p.image
                            : "/no-image.png"
                        }
                        alt={p.product_name || p.name}
                        className="w-16 h-16 object-cover rounded shadow border border-gray-200 hover:scale-110 transition-transform duration-200"
                        crossOrigin={undefined}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/no-image.png";
                        }}
                      />
                    ) : null}
                  </td>
                  <td className="border p-2 flex gap-2 items-center justify-center">
                    <button
                      className="btn btn-xs btn-warning flex items-center gap-1 hover:bg-yellow-400/80 transition"
                      onClick={() => handleEdit(p)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-xs btn-danger flex items-center gap-1 hover:bg-red-500/80 transition"
                      onClick={async () => {
                        if (
                          window.confirm("Yakin ingin menghapus produk ini?")
                        ) {
                          try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(
                              `http://localhost:5000/api/products/${
                                p.id || p.product_id
                              }`,
                              {
                                method: "DELETE",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            if (!res.ok)
                              throw new Error("Gagal menghapus produk");
                            fetchProducts();
                          } catch (err) {
                            alert(err.message);
                          }
                        }
                      }}
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default Products;
