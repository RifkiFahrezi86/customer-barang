// app/orders/page.tsx
import { requireAuth, getCustomerName } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  try {
    await requireAuth();
  } catch (error) {
    redirect("/login");
  }

  const customerName = await getCustomerName();

  if (!customerName) {
    redirect("/login");
  }

  const orders = await getCustomerOrders(customerName);

  return (
    <div className="container">
      <h1 className="page-title">📋 Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>Belum ada pesanan</h3>
          <p>Mulai pesan barang dari katalog</p>
        </div>
      ) : (
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Barang</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.nama}</td>
                  <td>{order.jenis}</td>
                  <td>{order.jumlah}</td>
                  <td>
                    {new Date(order.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <span className={`badge ${order.status}`}>
                      {order.status === "pending" && "Menunggu"}
                      {order.status === "approved" && "Disetujui"}
                      {order.status === "rejected" && "Ditolak"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}