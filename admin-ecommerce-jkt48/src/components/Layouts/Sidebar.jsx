import React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Produk", path: "/products" },
  { label: "Kategori", path: "/categories" },
  { label: "Varian Produk", path: "/variants" },
  { label: "News Product", path: "/news-product" },
  { label: "Pesanan", path: "/orders" },
  { label: "Transaksi", path: "/transactions" },
  { label: "Komplain", path: "/complaints" },
  { label: "Live Chat", path: "/chat" },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 h-screen bg-[#cd0c0d] text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Menu</h2>
      <nav className="flex-1">
        <ul className="space-y-4">
          {menu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded hover:bg-[#b00a0a] transition font-medium ${
                  location.pathname === item.path ? "bg-[#b00a0a]" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="mt-8 px-4 py-2 bg-white text-[#cd0c0d] rounded font-bold hover:bg-gray-100 border border-[#cd0c0d] transition"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
