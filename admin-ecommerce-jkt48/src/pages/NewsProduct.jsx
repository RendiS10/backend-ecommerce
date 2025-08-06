import React, { useEffect, useState } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";
import NewsForm from "../components/Fragments/NewsForm";
import Button from "../components/Elements/Button";

const NewsProduct = () => {
  const [news, setNews] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    image_highlight: "",
    highlight_link: "",
    alt_text: "",
    display_order: "",
    is_active: true,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNews();
    fetchProducts();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/news");
      const data = await res.json();
      setNews(data);
    } catch (err) {
      setError("Gagal memuat news");
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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/news/${editId}`
        : "http://localhost:5000/api/news";
      const body = JSON.stringify({
        ...form,
        is_active: form.is_active === "false" ? false : Boolean(form.is_active),
      });
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!res.ok) throw new Error("Gagal menyimpan news");
      setForm({
        product_id: "",
        image_highlight: "",
        highlight_link: "",
        alt_text: "",
        display_order: "",
        is_active: true,
      });
      setIsEdit(false);
      setEditId(null);
      fetchNews();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setForm({
      product_id: item.product_id,
      image_highlight: item.image_highlight,
      highlight_link: item.highlight_link,
      alt_text: item.alt_text,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setIsEdit(true);
    setEditId(item.news_id);
  };

  const handleCancelEdit = () => {
    setForm({
      product_id: "",
      image_highlight: "",
      highlight_link: "",
      alt_text: "",
      display_order: "",
      is_active: true,
    });
    setIsEdit(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus news ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus news");
      fetchNews();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">News Product</h1>
        <NewsForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isEdit={isEdit}
          onCancel={handleCancelEdit}
          productOptions={products}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Produk</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Link</th>
                  <th className="px-4 py-2 border">Alt</th>
                  <th className="px-4 py-2 border">Urutan</th>
                  <th className="px-4 py-2 border">Aktif</th>
                  <th className="px-4 py-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.news_id}>
                    <td className="px-4 py-2 border">
                      {item.Product
                        ? item.Product.product_name
                        : item.product_id}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.image_highlight && (
                        <img
                          src={item.image_highlight}
                          alt={item.alt_text}
                          className="w-16 h-16 object-cover rounded shadow border border-gray-200"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      <a
                        href={item.highlight_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {item.highlight_link}
                      </a>
                    </td>
                    <td className="px-4 py-2 border">{item.alt_text}</td>
                    <td className="px-4 py-2 border">{item.display_order}</td>
                    <td className="px-4 py-2 border">
                      {item.is_active ? "Ya" : "Tidak"}
                    </td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button
                        onClick={() => handleEdit(item)}
                        type="button"
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.news_id)}
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs"
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsProduct;
