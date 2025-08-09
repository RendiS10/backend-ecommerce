import React, { useState, useEffect } from "react";
import AdminLayout from "../components/Layouts/AdminLayout";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data pesanan");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, trackingNumber = "") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_status: newStatus,
            tracking_number: trackingNumber || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memperbarui status pesanan");
      }

      // Refresh data orders
      fetchOrders();
      alert("Status pesanan berhasil diperbarui");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Gagal memperbarui status pesanan");
    }
  };

  const formatRupiah = (amount) => {
    if (!amount || isNaN(amount)) return "Rp0";
    return "Rp" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      "Menunggu Konfirmasi": {
        text: "Menunggu Konfirmasi",
        color: "bg-yellow-100 text-yellow-800",
      },
      Diproses: { text: "Diproses", color: "bg-purple-100 text-purple-800" },
      Dikirim: { text: "Dikirim", color: "bg-indigo-100 text-indigo-800" },
      Selesai: { text: "Selesai", color: "bg-green-100 text-green-800" },
      Dibatalkan: { text: "Dibatalkan", color: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center text-red-500 py-8">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
        <button
          onClick={fetchOrders}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada pesanan
            </h3>
            <p className="text-gray-600">Belum ada pesanan yang masuk</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white border rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Order #{order.order_id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer:{" "}
                    {order.User?.name || order.User?.email || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tanggal:{" "}
                    {new Date(order.order_date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {getStatusBadge(order.order_status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Total Pembayaran</p>
                  <p className="font-semibold text-lg">
                    {formatRupiah(order.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Metode Pembayaran</p>
                  <p className="font-medium">
                    {order.payment_method?.toUpperCase() || "COD"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nomor Resi</p>
                  <p className="font-medium text-sm text-blue-600">
                    {order.tracking_number || "Belum tersedia"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                  <p className="font-medium text-sm">
                    {order.shipping_address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kota & Kode Pos</p>
                  <p className="font-medium text-sm">
                    {order.shipping_city}, {order.shipping_postal_code}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {order.OrderItems && order.OrderItems.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  <h4 className="font-medium mb-3">
                    Item Pesanan ({order.OrderItems.length} item):
                  </h4>
                  <div className="space-y-2">
                    {order.OrderItems.map((item, index) => (
                      <div
                        key={item.order_item_id || index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <span className="font-medium">
                            {item.Product?.product_name || "Unknown Product"}
                          </span>
                          <span className="text-gray-600 text-sm block">
                            Qty: {item.quantity} ×{" "}
                            {formatRupiah(item.price_at_purchase)}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {formatRupiah(item.price_at_purchase * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Management */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Kelola Status Pesanan:</h4>
                <div className="flex flex-wrap gap-2">
                  {order.order_status === "Menunggu Konfirmasi" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.order_id, "Diproses")
                      }
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                    >
                      Proses Pesanan
                    </button>
                  )}

                  {order.order_status === "Diproses" && (
                    <button
                      onClick={() => {
                        const trackingNumber = prompt("Masukkan nomor resi:");
                        if (trackingNumber) {
                          updateOrderStatus(
                            order.order_id,
                            "Dikirim",
                            trackingNumber
                          );
                        }
                      }}
                      className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
                    >
                      Kirim Pesanan
                    </button>
                  )}

                  {order.order_status === "Dikirim" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(order.order_id, "Selesai")
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Selesaikan Pesanan
                    </button>
                  )}

                  {["Menunggu Konfirmasi", "Diproses"].includes(
                    order.order_status
                  ) && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Apakah Anda yakin ingin membatalkan pesanan ini?"
                          )
                        ) {
                          updateOrderStatus(order.order_id, "Dibatalkan");
                        }
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Batalkan Pesanan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default Orders;
