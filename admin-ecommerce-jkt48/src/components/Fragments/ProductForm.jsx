import React from "react";

function ProductForm({ form, onChange, onSubmit, isEdit, onCancel }) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-xl mx-auto animate-fade-in"
    >
      <h2 className="text-xl font-bold mb-6 text-[#cd0c0d] flex items-center gap-2">
        {isEdit ? (
          <>
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6"
              />
            </svg>
            Edit Produk
            <button
              type="button"
              className="ml-4 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-semibold border border-gray-300"
              onClick={onCancel}
            >
              Batal
            </button>
          </>
        ) : (
          <>
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Produk
          </>
        )}
      </h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nama Produk</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Harga</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Kategori</label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
            required
          >
            <option value="">Pilih Kategori</option>
            {form.categoryOptions &&
              form.categoryOptions.map((cat, idx) => (
                <option key={cat.category_id || idx} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Foto (Upload)</label>
        <div className="relative">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onChange}
            className="block w-full text-sm text-gray-700 border-2 border-black rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-2 focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] transition-colors duration-200 py-2 px-3"
            required={!isEdit}
            style={{ minHeight: 44 }}
          />
        </div>
        {form.imagePreview && (
          <img
            src={
              form.imagePreview.startsWith("blob:") ||
              form.imagePreview.startsWith("data:")
                ? form.imagePreview
                : form.imagePreview.startsWith("uploads/") ||
                  form.imagePreview.startsWith("/uploads/")
                ? `http://localhost:5000/${form.imagePreview.replace(
                    /^\/+/,
                    ""
                  )}`
                : form.imagePreview
            }
            alt="Preview"
            className="mt-2 w-24 h-24 object-cover rounded shadow border border-gray-200 animate-fade-in"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/no-image.png";
            }}
          />
        )}
      </div>
      <button
        type="submit"
        className={`btn w-full py-3 mt-4 text-lg font-bold rounded transition duration-200 ${
          isEdit
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-[#cd0c0d] hover:bg-[#b00a0a]"
        }`}
        style={{ cursor: "pointer" }}
      >
        {isEdit ? "Update" : "Tambah"} Produk
      </button>
    </form>
  );
}

export default ProductForm;
