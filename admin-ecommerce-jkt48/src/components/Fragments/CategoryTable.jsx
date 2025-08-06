import React from "react";
import Button from "../Elements/Button";

function CategoryTable({ categories, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white animate-fade-in">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="bg-gradient-to-r from-[#ffeaea] to-[#fff5f5] text-[#cd0c0d]">
            <th className="p-2 border">Nama Kategori</th>
            <th className="p-2 border">Slug</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr
              key={cat.category_id || idx}
              className={
                idx % 2 === 0
                  ? "bg-white"
                  : "bg-[#fff5f5] hover:bg-[#ffeaea] transition"
              }
            >
              <td className="border p-2 font-semibold">{cat.category_name}</td>
              <td className="border p-2">{cat.slug}</td>
              <td className="border p-2 flex gap-2">
                <Button
                  type="button"
                  className="btn btn-xs btn-warning"
                  onClick={() => onEdit(cat)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  className="btn btn-xs btn-danger bg-red-500 hover:bg-red-600"
                  onClick={() => onDelete(cat)}
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

export default CategoryTable;
