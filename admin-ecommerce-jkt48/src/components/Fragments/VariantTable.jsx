import React from "react";
import Button from "../Elements/Button";

function VariantTable({ variants, onEdit, onDelete, productOptions }) {
  const getProductName = (id) => {
    const prod = productOptions.find((p) => p.product_id === id);
    return prod ? prod.product_name : id;
  };
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white animate-fade-in">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-gradient-to-r from-[#ffeaea] to-[#fff5f5] text-[#cd0c0d]">
            <th className="p-2 border">Produk</th>
            <th className="p-2 border">Warna</th>
            <th className="p-2 border">Ukuran</th>
            <th className="p-2 border">Stok</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v, idx) => (
            <tr
              key={v.variant_id || idx}
              className={
                idx % 2 === 0
                  ? "bg-white"
                  : "bg-[#fff5f5] hover:bg-[#ffeaea] transition"
              }
            >
              <td className="border p-2 font-semibold">
                {getProductName(v.product_id)}
              </td>
              <td className="border p-2">{v.color || "-"}</td>
              <td className="border p-2">{v.size || "-"}</td>
              <td className="border p-2">{v.variant_stock}</td>
              <td className="border p-2 flex gap-2">
                <Button
                  type="button"
                  className="btn btn-xs btn-warning"
                  onClick={() => onEdit(v)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="btn btn-xs btn-danger bg-red-500 hover:bg-red-600"
                  onClick={() => onDelete(v)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VariantTable;
