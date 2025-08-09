import React, { useEffect, useState } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaUser,
  FaUserShield,
  FaSearch,
} from "react-icons/fa";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    address: "",
    city: "",
    postal_code: "",
    role: "customer",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    search: "",
  });

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users berdasarkan filter
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:5000/api/users";
      const params = new URLSearchParams();

      if (filters.role) {
        params.append("role", filters.role);
      }

      if (filters.search) {
        params.append("search", filters.search);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError("Gagal memuat data users");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi input
    if (!form.full_name || !form.email || !form.role) {
      setError("Nama lengkap, email, dan role wajib diisi");
      setLoading(false);
      return;
    }

    if (!isEdit && !form.password) {
      setError("Password wajib diisi untuk user baru");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `http://localhost:5000/api/users/${editId}`
        : "http://localhost:5000/api/users";

      const submitData = { ...form };
      // Jika edit dan password kosong, jangan kirim password
      if (isEdit && !form.password) {
        delete submitData.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        fetchUsers();
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

  const handleEdit = (user) => {
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: "", // Kosongkan password untuk edit
      phone_number: user.phone_number || "",
      address: user.address || "",
      city: user.city || "",
      postal_code: user.postal_code || "",
      role: user.role,
    });
    setIsEdit(true);
    setEditId(user.user_id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus user ini?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          fetchUsers();
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Gagal menghapus user");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat menghapus");
      }
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "customer" : "admin";

    if (
      confirm(`Yakin ingin mengubah role ${user.full_name} menjadi ${newRole}?`)
    ) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/users/${user.user_id}/role`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newRole }),
          }
        );

        if (res.ok) {
          fetchUsers();
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Gagal mengubah role");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengubah role");
      }
    }
  };

  const resetForm = () => {
    setForm({
      full_name: "",
      email: "",
      password: "",
      phone_number: "",
      address: "",
      city: "",
      postal_code: "",
      role: "customer",
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Kelola Users</h1>
          <button
            onClick={openAddModal}
            className="bg-[#cd0c0d] text-white px-4 py-2 rounded-lg hover:bg-[#b00a0a] transition flex items-center gap-2"
          >
            <FaPlus /> Tambah User
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
                Filter Role:
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
              >
                <option value="">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div className="flex-1 max-w-md">
              <label className="text-gray-700 font-medium mr-2">Cari:</label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Cari nama atau email..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Users */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama & Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dibuat
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
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada users
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{user.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.phone_number || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.address ? (
                          <div>
                            <div className="max-w-xs truncate">
                              {user.address}
                            </div>
                            {user.city && (
                              <div className="text-xs text-gray-500">
                                {user.city} {user.postal_code}
                              </div>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRole(user)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }`}
                          title={`Klik untuk ubah ke ${
                            user.role === "admin" ? "customer" : "admin"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <FaUserShield className="mr-1" />
                          ) : (
                            <FaUser className="mr-1" />
                          )}
                          {user.role}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user.user_id)}
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
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEdit ? "Edit User" : "Tambah User"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password{" "}
                      {isEdit ? "(Kosongkan jika tidak ingin mengubah)" : "*"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required={!isEdit}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kota
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cd0c0d]"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
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

export default Users;
