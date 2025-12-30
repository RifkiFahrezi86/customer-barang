// customer-web/app/request/[id]/page.tsx (UPDATED)
import { requireCustomer } from "@/lib/auth";
import { deleteRequest } from "@/lib/actions";
import { sql } from "@vercel/postgres";
import { notFound } from "next/navigation";
import StatusBadge from "@/app/components/StatusBadge";
import Link from "next/link";
import {
  UploadIcon,
  ArrowLeftIcon,
  BarChartIcon,
  PackageIcon,
  FileTextIcon,
  InfoIcon,
  BoxIcon,
  PlusIcon,
  TrashIcon,
} from "@/lib/icons";

type Props = {
  params: { id: string };
};

type RequestDetail = {
  id: number;
  barang_id: string;
  nama: string;
  jenis: string;
  jumlah: number;
  tanggal: string;
  sumber: string;
  catatan?: string;
  status: "pending" | "approved" | "rejected";
  satuan: string;
  stok_sekarang: number;
};

async function getRequestDetail(
  requestId: string,
  customerName: string
): Promise<RequestDetail | null> {
  try {
    const { rows } = await sql<RequestDetail>`
      SELECT
        bm.id,
        bm.barang_id,
        b.nama,
        b.jenis,
        b.satuan,
        b.stok as stok_sekarang,
        bm.jumlah,
        bm.tanggal,
        bm.sumber,
        bm.catatan,
        bm.status
      FROM barang_masuk bm
      JOIN barang b ON b.id = bm.barang_id
      WHERE bm.id = ${requestId} AND bm.sumber = ${customerName}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error fetching request detail:", error);
    return null;
  }
}

export default async function RequestDetailPage({ params }: Props) {
  const customerName = await requireCustomer();
  const request = await getRequestDetail(params.id, customerName);

  if (!request) {
    notFound();
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <UploadIcon size={32} className="inline-icon" />
            Detail Request #{request.id}
          </h1>
          <p>Informasi lengkap request barang masuk</p>
        </div>
        <Link href="/request" className="btn-secondary">
          <ArrowLeftIcon size={18} />
          Kembali
        </Link>
      </div>

      {/* Status Card */}
      <div className="detail-card">
        <div className="detail-section">
          <h3>
            <BarChartIcon size={20} className="inline-icon" />
            Status Request
          </h3>
          <div className="status-display">
            <StatusBadge status={request.status} />
            <span className="status-date">
              {new Date(request.tanggal).toLocaleString("id-ID", {
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
              <span className="value">{request.barang_id}</span>
            </div>
            <div className="info-item">
              <span className="label">Nama Barang:</span>
              <span className="value">{request.nama}</span>
            </div>
            <div className="info-item">
              <span className="label">Jenis:</span>
              <span className="value">{request.jenis}</span>
            </div>
            <div className="info-item">
              <span className="label">Jumlah Request:</span>
              <span className="value highlight">
                {request.jumlah} {request.satuan}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Stok Saat Ini:</span>
              <span className="value">
                {request.stok_sekarang} {request.satuan}
              </span>
            </div>
            {request.status === "approved" && (
              <div className="info-item">
                <span className="label">Stok Setelah Approved:</span>
                <span className="value success">
                  {request.stok_sekarang} {request.satuan}
                  <small style={{ marginLeft: "8px", color: "#22c55e" }}>
                    (+{request.jumlah} dari request ini)
                  </small>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Info */}
      <div className="detail-card">
        <div className="detail-section">
          <h3>
            <FileTextIcon size={20} className="inline-icon" />
            Detail Request
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">ID Request:</span>
              <span className="value">#{request.id}</span>
            </div>
            <div className="info-item">
              <span className="label">Pemohon:</span>
              <span className="value">{request.sumber}</span>
            </div>
            <div className="info-item">
              <span className="label">Tanggal Request:</span>
              <span className="value">
                {new Date(request.tanggal).toLocaleDateString("id-ID")}
              </span>
            </div>
            <div className="info-item full-width">
              <span className="label">Catatan:</span>
              <span className="value">
                {request.catatan || "Tidak ada catatan"}
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
          {request.status === "pending" && (
            <>
              <li>
                <strong>⏳ Status:</strong> Request Anda sedang menunggu
                persetujuan dari admin.
              </li>
              <li>
                Stok akan bertambah setelah admin menyetujui request Anda.
              </li>
              <li>
                Anda masih bisa membatalkan request dengan tombol "Batalkan
                Request" di bawah.
              </li>
            </>
          )}
          {request.status === "approved" && (
            <>
              <li>
                <strong>✅ Status:</strong> Request Anda telah disetujui!
              </li>
              <li>
                Stok barang telah ditambahkan sebanyak {request.jumlah}{" "}
                {request.satuan}.
              </li>
              <li>
                Stok sekarang: {request.stok_sekarang} {request.satuan}
              </li>
            </>
          )}
          {request.status === "rejected" && (
            <>
              <li>
                <strong>❌ Status:</strong> Request Anda ditolak oleh admin.
              </li>
              <li>
                Kemungkinan request tidak sesuai kebijakan atau alasan lain.
              </li>
              <li>Silakan hubungi admin untuk informasi lebih lanjut.</li>
            </>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="detail-actions">
        <Link href="/request" className="btn-primary">
          <ArrowLeftIcon size={18} />
          Kembali ke Daftar Request
        </Link>
        <Link href="/request/create" className="btn-secondary">
          <PlusIcon size={18} />
          Request Baru
        </Link>
        <Link href="/katalog" className="btn-secondary">
          <BoxIcon size={18} />
          Lihat Katalog
        </Link>
        {request.status === "pending" && (
          <form action={deleteRequest.bind(null, request.id)}>
            <button type="submit" className="btn-danger">
              <TrashIcon size={18} />
              Batalkan Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}