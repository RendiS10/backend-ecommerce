import React from "react";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-white p-8">{children}</main>
    </div>
  );
}

export default AdminLayout;
