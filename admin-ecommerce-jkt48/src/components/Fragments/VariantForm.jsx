import React from "react";
import Input from "../Elements/Input";
import Button from "../Elements/Button";

function VariantForm({
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
      className="bg-white p-4 rounded-lg shadow mb-6 max-w-md"
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium">Produk</label>
        <select
          name="product_id"
          value={form.product_id}
          onChange={onChange}
          className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-[#cd0c0d] bg-transparent mb-6"
          required
        >
          <option value="">Pilih Produk</option>
          {productOptions.map((p) => (
            <option key={p.product_id} value={p.product_id}>
              {p.product_name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Warna</label>
        <Input
          name="color"
          value={form.color}
          onChange={onChange}
          placeholder="Contoh: Merah, Biru, dll"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Ukuran</label>
        <Input
          name="size"
          value={form.size}
          onChange={onChange}
          placeholder="Contoh: S, M, L, XL, ALL SIZE"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Stok Varian</label>
        <Input
          name="variant_stock"
          type="number"
          value={form.variant_stock}
          onChange={onChange}
          placeholder="Stok untuk varian ini"
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {isEdit ? "Simpan Perubahan" : "Tambah Varian"}
        </Button>
        {isEdit && (
          <Button
            type="button"
            className="bg-gray-400 hover:bg-gray-500"
            onClick={onCancel}
          >
            Batal
          </Button>
        )}
      </div>
    </form>
  );
}

export default VariantForm;
