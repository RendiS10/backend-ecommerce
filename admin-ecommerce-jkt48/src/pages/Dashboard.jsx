import React from "react";
import AdminLayout from "../components/Layouts/AdminLayout";

function Dashboard() {
  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
