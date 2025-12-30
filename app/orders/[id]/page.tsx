// customer-web/app/orders/[id]/page.tsx (UPDATED)
import { requireCustomer } from "@/lib/auth";
import { deleteOrder } from "@/lib/actions";
import { sql } from "@vercel/postgres";
import { notFound } from "next/navigation";
import StatusBadge from "@/app/components/StatusBadge";
import Link from "next/link";
import {
  ShoppingCartIcon,
  ArrowLeftIcon,
  BarChartIcon,
  PackageIcon,
  FileTextIcon,
  InfoIcon,
  BoxIcon,
  TrashIcon,
} from "@/lib/icons";

type Props = {
  params: { id: string };
};

type OrderDetail = {
  id: number;
  barang_id: string;
  nama: string;
  jenis: string;
  jumlah: number;
  tanggal: string;
  tujuan: string;
  catatan?: string;
  status: "pending" | "approved" | "rejected";
  satuan: string;
  stok_sekarang: number;
};

async function getOrderDetail(
  orderId: string,
  customerName: string
): Promise<OrderDetail | null> {
  try {
    const { rows } = await sql<OrderDetail>`
      SELECT
        bk.id,
        bk.barang_id,
        b.nama,
        b.jenis,
        b.satuan,
        b.stok as stok_sekarang,
        bk.jumlah,
        bk.tanggal,
        bk.tujuan,
        bk.catatan,
        bk.status
      FROM barang_keluar bk
      JOIN barang b ON b.id = bk.barang_id
      WHERE bk.id = ${orderId} AND bk.tujuan = ${customerName}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error fetching order detail:", error);
    return null;
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const customerName = await requireCustomer();
  const order = await getOrderDetail(params.id, customerName);

  if (!order) {
    notFound();
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <ShoppingCartIcon size={32} className="inline-icon" />
            Detail Pesanan #{order.id}
          </h1>
          <p>Informasi lengkap pesanan barang keluar</p>
        </div>
        <Link href="/orders" className="btn-secondary">
          <ArrowLeftIcon size={18} />
          Kembali
        </Link>
      </div>

      {/* Status Card */}
      <div className="detail-card">
        <div className="detail-section">
          <h3>
            <BarChartIcon size={20} className="inline-icon" />
            Status Pesanan
          </h3>
          <div className="status-display">
            <StatusBadge status={order.status} />
            <span className="status-date">
              {new Date(order.tanggal).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Barang Info */}
      <div className="detail-card">
        <div className="detail-section">
          <h3>
            <PackageIcon size={20} className="inline-icon" />
            Informasi Barang
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">ID Barang:</span>
              <span className="value">{order.barang_id}</span>
            </div>
            <div className="info-item">
              <span className="label">Nama Barang:</span>
              <span className="value">{order.nama}</span>
            </div>
            <div className="info-item">
              <span className="label">Jenis:</span>
              <span className="value">{order.jenis}</span>
            </div>
            <div className="info-item">
              <span className="label">Jumlah Pesanan:</span>
              <span className="value highlight">
                {order.jumlah} {order.satuan}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Stok Saat Ini:</span>
              <span className="value">
                {order.stok_sekarang} {order.satuan}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="detail-card">
        <div className="detail-section">
          <h3>
            <FileTextIcon size={20} className="inline-icon" />
            Detail Pesanan
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">ID Pesanan:</span>
              <span className="value">#{order.id}</span>
            </div>
            <div className="info-item">
              <span className="label">Pemesan:</span>
              <span className="value">{order.tujuan}</span>
            </div>
            <div className="info-item">
              <span className="label">Tanggal Pesanan:</span>
              <span className="value">
                {new Date(order.tanggal).toLocaleDateString("id-ID")}
              </span>
            </div>
            <div className="info-item full-width">
              <span className="label">Catatan:</span>
              <span className="value">
                {order.catatan || "Tidak ada catatan"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Info */}
      <div className="info-box">
        <h4>
          <InfoIcon size={20} className="inline-icon" />
          Informasi Status
        </h4>
        <ul>
          {order.status === "pending" && (
            <>
              <li>
                <strong>⏳ Status:</strong> Pesanan Anda sedang menunggu
                persetujuan dari admin.
              </li>
              <li>Stok akan dikurangi setelah admin menyetujui pesanan.</li>
              <li>
                Anda masih bisa membatalkan pesanan dengan tombol "Batalkan
                Pesanan" di bawah.
              </li>
            </>
          )}
          {order.status === "approved" && (
            <>
              <li>
                <strong>✅ Status:</strong> Pesanan Anda telah disetujui!
              </li>
              <li>
                Stok barang telah dikurangi sebanyak {order.jumlah}{" "}
                {order.satuan}.
              </li>
              <li>Silakan ambil barang Anda di gudang.</li>
            </>
          )}
          {order.status === "rejected" && (
            <>
              <li>
                <strong>❌ Status:</strong> Pesanan Anda ditolak oleh admin.
              </li>
              <li>Kemungkinan stok tidak mencukupi atau alasan lain.</li>
              <li>Silakan hubungi admin untuk informasi lebih lanjut.</li>
            </>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="detail-actions">
        <Link href="/orders" className="btn-primary">
          <ArrowLeftIcon size={18} />
          Kembali ke Daftar Pesanan
        </Link>
        <Link href="/katalog" className="btn-secondary">
          <BoxIcon size={18} />
          Lihat Katalog
        </Link>
        {order.status === "pending" && (
          <form action={deleteOrder.bind(null, order.id)}>
            <button type="submit" className="btn-danger">
              <TrashIcon size={18} />
              Batalkan Pesanan
            </button>
          </form>
        )}
      </div>
    </div>
  );
}