// customer-web/app/orders/page.tsx (UPDATED)
import { requireCustomer } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/db";
import { deleteOrder } from "@/lib/actions";
import StatusBadge from "@/app/components/StatusBadge";
import Link from "next/link";
import {
  ShoppingCartIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  InfoIcon,
} from "@/lib/icons";

export default async function OrdersPage() {
  const customerName = await requireCustomer();
  const orders = await getCustomerOrders(customerName);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            <ShoppingCartIcon size={32} className="inline-icon" />
            Pesanan Saya
          </h1>
          <p>History pemesanan barang (Barang Keluar)</p>
        </div>
        <Link href="/katalog" className="btn-primary">
          <PlusIcon size={18} />
          Pesan Barang
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada pesanan</p>
          <Link href="/katalog" className="btn-primary">
            Lihat Katalog
          </Link>
        </div>
      ) : (
        <div className="table-box">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Barang</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.nama}</td>
                  <td>{order.jenis}</td>
                  <td>{order.jumlah}</td>
                  <td>
                    {new Date(order.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        href={`/orders/${order.id}`}
                        className="btn-detail"
                      >
                        <EyeIcon size={14} />
                        Detail
                      </Link>
                      {order.status === "pending" && (
                        <form
                          action={deleteOrder.bind(null, order.id)}
                          style={{ display: "inline" }}
                        >
                          <button type="submit" className="btn-delete">
                            <TrashIcon size={14} />
                            Batal
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="page-info">
        <div className="info-box">
          <h4>
            <InfoIcon size={20} className="inline-icon" />
            Informasi
          </h4>
          <ul>
            <li>
              <strong>⏳ Menunggu:</strong> Pesanan sedang diproses admin. Anda
              bisa membatalkan pesanan.
            </li>
            <li>
              <strong>✅ Disetujui:</strong> Pesanan sudah disetujui dan stok
              dikurangi. Tidak bisa dibatalkan.
            </li>
            <li>
              <strong>❌ Ditolak:</strong> Pesanan ditolak oleh admin. Tidak
              bisa dibatalkan.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}