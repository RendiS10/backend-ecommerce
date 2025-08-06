import React from "react";
import Input from "../Elements/Input";
import Button from "../Elements/Button";

function CategoryForm({ form, onChange, onSubmit, isEdit, onCancel }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6 max-w-md"
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nama Kategori</label>
        <Input
          name="category_name"
          value={form.category_name}
          onChange={onChange}
          placeholder="Nama kategori"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Slug</label>
        <Input
          name="slug"
          value={form.slug}
          onChange={onChange}
          placeholder="Slug kategori (tanpa spasi)"
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
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

export default CategoryForm;
