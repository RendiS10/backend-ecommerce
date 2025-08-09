import React, { useEffect, useState } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye } from "react-icons/fa";

function ProductImages() {
  const [productImages, setProductImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    alt_text: "",
    image: null,
    imagePreview: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Fetch product images and products
  useEffect(() => {
    fetchProductImages();
    fetchProducts();
  }, []);

  // Fetch product images berdasarkan filter produk
  useEffect(() => {
    if (selectedProductId) {
      fetchProductImages(selectedProductId);
    } else {
      fetchProductImages();
    }
  }, [selectedProductId]);

  const fetchProductImages = async (productId = "") => {
    setLoading(true);
    try {
      const url = productId
        ? `http://localhost:5000/api/product-images?product_id=${productId}`
        : "http://localhost:5000/api/product-images";
      const res = await fetch(url);
      const data = await res.json();
      setProductImages(data);
    } catch (err) {
      setError("Gagal memuat gambar produk");
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

    if (!form.product_id) {
      setError("Pilih produk terlebih dahulu");
      setLoading(false);
      return;
    }

    if (!isEdit && !form.image) {
      setError("Pilih gambar terlebih dahulu");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/product-images/${editId}`
        : "http://localhost:5000/api/product-images";

      const formData = new FormData();
      formData.append("product_id", form.product_id);
      formData.append("alt_text", form.alt_text);
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        fetchProductImages(selectedProductId);
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

  const handleEdit = (productImage) => {
    setForm({
      product_id: productImage.product_id,
      alt_text: productImage.alt_text || "",
      image: null,
      imagePreview: `http://localhost:5000/${productImage.image_path}`,
    });
    setIsEdit(true);
    setEditId(productImage.image_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus gambar ini?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/product-images/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          fetchProductImages(selectedProductId);
        } else {
          setError("Gagal menghapus gambar");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat menghapus");
      }
    }
  };

  const resetForm = () => {
    setForm({
      product_id: "",
      alt_text: "",
      image: null,
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
            Kelola Gambar Produk
          </h1>
          <button
            onClick={openAddModal}
            className="bg-[#cd0c0d] text-white px-4 py-2 rounded-lg hover:bg-[#b00a0a] transition flex items-center gap-2"
          >
            <FaPlus /> Tambah Gambar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filter Produk */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-gray-700 font-medium">
              Filter berdasarkan produk:
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
        </div>

        {/* Tabel Gambar Produk */}
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
                  Alt Text
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : productImages.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada gambar produk
                  </td>
                </tr>
              ) : (
                productImages.map((productImage) => (
                  <tr key={productImage.image_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{productImage.image_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`http://localhost:5000/${productImage.image_path}`}
                        alt={productImage.alt_text || "Product Image"}
                        className="h-16 w-16 object-cover rounded-lg border"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {productImage.Product?.product_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {productImage.alt_text || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(productImage)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(productImage.image_id)}
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEdit ? "Edit Gambar Produk" : "Tambah Gambar Produk"}
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
                    Produk *
                  </label>
                  <select
                    name="product_id"
                    value={form.product_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  >
                    <option value="">Pilih Produk</option>
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
                    Alt Text
                  </label>
                  <input
                    type="text"
                    name="alt_text"
                    value={form.alt_text}
                    onChange={handleChange}
                    placeholder="Deskripsi gambar"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar {!isEdit && "*"}
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                  />
                  {form.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border"
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

export default ProductImages;
