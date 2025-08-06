import React from "react";

function NewsForm({
  form,
  onChange,
  onSubmit,
  isEdit,
  onCancel,
  productOptions,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-xl mx-auto animate-fade-in"
    >
      <h2 className="text-xl font-bold mb-6 text-[#cd0c0d] flex items-center gap-2">
        {isEdit ? (
          <>
            Edit News
            <button
              type="button"
              className="ml-4 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-semibold border border-gray-300"
              onClick={onCancel}
            >
              Batal
            </button>
          </>
        ) : (
          <>Tambah News</>
        )}
      </h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Produk Terkait</label>
        <select
          name="product_id"
          value={form.product_id}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
          required
        >
          <option value="">Pilih Produk</option>
          {productOptions &&
            productOptions.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.product_name}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Image Highlight (URL)</label>
        <input
          type="text"
          name="image_highlight"
          value={form.image_highlight}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Highlight Link</label>
        <input
          type="text"
          name="highlight_link"
          value={form.highlight_link}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Alt Text</label>
        <input
          type="text"
          name="alt_text"
          value={form.alt_text}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Display Order</label>
        <input
          type="number"
          name="display_order"
          value={form.display_order}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Aktif?</label>
        <select
          name="is_active"
          value={form.is_active}
          onChange={onChange}
          className="block w-full text-black bg-white border-2 border-black rounded-lg focus:outline-none focus:border-[#cd0c0d] focus:ring-2 focus:ring-[#cd0c0d] py-2 px-3 transition-colors duration-200"
        >
          <option value={true}>Ya</option>
          <option value={false}>Tidak</option>
        </select>
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
        {isEdit ? "Update" : "Tambah"} News
      </button>
    </form>
  );
}

export default NewsForm;
