import React, { useEffect, useState } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaEye,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

function ProductNews() {
  const [productNews, setProductNews] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    highlight_link: "",
    alt_text: "",
    display_order: 1,
    is_active: true,
    image_highlight: null,
    imagePreview: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Fetch product news and products
  useEffect(() => {
    fetchProductNews();
    fetchProducts();
  }, []);

  // Fetch product news berdasarkan filter
  useEffect(() => {
    fetchProductNews();
  }, [selectedProductId, showActiveOnly]);

  const fetchProductNews = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:5000/api/news";
      const params = new URLSearchParams();

      if (selectedProductId) {
        params.append("product_id", selectedProductId);
      }

      if (showActiveOnly) {
        params.append("is_active", "true");
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setProductNews(data);
    } catch (err) {
      setError("Gagal memuat product news");
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
    if (e.target.name === "image_highlight") {
      const file = e.target.files[0];
      if (file) {
        setForm((prev) => ({
          ...prev,
          image_highlight: file,
          imagePreview: URL.createObjectURL(file),
        }));
      }
    } else if (e.target.name === "is_active") {
      setForm({ ...form, [e.target.name]: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.highlight_link) {
      setError("Link highlight wajib diisi");
      setLoading(false);
      return;
    }

    if (!form.alt_text) {
      setError("Alt text wajib diisi");
      setLoading(false);
      return;
    }

    if (!isEdit && !form.image_highlight) {
      setError("Pilih gambar terlebih dahulu");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/news/${editId}`
        : "http://localhost:5000/api/news";

      const formData = new FormData();
      if (form.product_id) {
        formData.append("product_id", form.product_id);
      }
      formData.append("highlight_link", form.highlight_link);
      formData.append("alt_text", form.alt_text);
      formData.append("display_order", form.display_order);
      formData.append("is_active", form.is_active);

      if (form.image_highlight instanceof File) {
        formData.append("image_highlight", form.image_highlight);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        fetchProductNews();
        resetForm();
        setShowModal(false);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Terjadi kesalahan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan");
    }
    setLoading(false);
  };

  const handleEdit = (news) => {
    setForm({
      product_id: news.product_id || "",
      highlight_link: news.highlight_link || "",
      alt_text: news.alt_text || "",
      display_order: news.display_order || 1,
      is_active: news.is_active,
      image_highlight: null,
      imagePreview: news.image_highlight
        ? `http://localhost:5000/${news.image_highlight}`
        : "",
    });
    setIsEdit(true);
    setEditId(news.news_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus product news ini?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/news/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          fetchProductNews();
        } else {
          setError("Gagal menghapus product news");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat menghapus");
      }
    }
  };

  const toggleStatus = async (news) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("is_active", !news.is_active);

      const res = await fetch(
        `http://localhost:5000/api/news/${news.news_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        fetchProductNews();
      } else {
        setError("Gagal mengubah status");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengubah status");
    }
  };

  const resetForm = () => {
    setForm({
      product_id: "",
      highlight_link: "",
      alt_text: "",
      display_order: 1,
      is_active: true,
      image_highlight: null,
      imagePreview: "",
    });
    setIsEdit(false);
    setEditId(null);
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Kelola Product News
          </h1>
          <button
            onClick={openAddModal}
            className="bg-[#cd0c0d] text-white px-4 py-2 rounded-lg hover:bg-[#b00a0a] transition flex items-center gap-2"
          >
            <FaPlus /> Tambah News
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex gap-4 items-center flex-wrap">
            <div>
              <label className="text-gray-700 font-medium mr-2">
                Filter Produk:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
              >
                <option value="">Semua Produk</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="text-gray-700 font-medium mr-2">
                Tampilkan:
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showActiveOnly}
                  onChange={(e) => setShowActiveOnly(e.target.checked)}
                  className="mr-2"
                />
                Hanya yang aktif
              </label>
            </div>
          </div>
        </div>

        {/* Tabel Product News */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gambar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urutan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : productNews.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada product news
                  </td>
                </tr>
              ) : (
                productNews.map((news) => (
                  <tr key={news.news_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{news.news_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {news.image_highlight ? (
                        <img
                          src={`http://localhost:5000/${news.image_highlight}`}
                          alt={news.alt_text || "News Image"}
                          className="h-16 w-16 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {news.Product?.product_name || "Tidak ada produk"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      <a
                        href={news.highlight_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {news.highlight_link}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {news.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(news)}
                        className={`text-xl ${
                          news.is_active ? "text-green-600" : "text-gray-400"
                        }`}
                        title={news.is_active ? "Aktif" : "Nonaktif"}
                      >
                        {news.is_active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(news)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(news.news_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEdit ? "Edit Product News" : "Tambah Product News"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produk (Optional)
                  </label>
                  <select
                    name="product_id"
                    value={form.product_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  >
                    <option value="">Pilih Produk (Optional)</option>
                    {products.map((product) => (
                      <option
                        key={product.product_id}
                        value={product.product_id}
                      >
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Highlight *
                  </label>
                  <input
                    type="url"
                    name="highlight_link"
                    value={form.highlight_link}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    name="alt_text"
                    value={form.alt_text}
                    onChange={handleChange}
                    required
                    placeholder="Deskripsi gambar"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Aktif
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar Highlight {!isEdit && "*"}
                  </label>
                  <input
                    type="file"
                    name="image_highlight"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  />
                  {form.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        className="h-32 w-full object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#cd0c0d] text-white py-2 rounded-lg hover:bg-[#b00a0a] transition disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ProductNews;
