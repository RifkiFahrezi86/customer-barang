// customer-web/app/request/page.tsx (UPDATED)
import { requireCustomer } from "@/lib/auth";
import { getCustomerRequests } from "@/lib/db";
import { deleteRequest } from "@/lib/actions";
import StatusBadge from "@/app/components/StatusBadge";
import Link from "next/link";
import {
  UploadIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  InfoIcon,
} from "@/lib/icons";

export default async function RequestPage() {
  const customerName = await requireCustomer();
  const requests = await getCustomerRequests(customerName);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            <UploadIcon size={32} className="inline-icon" />
            Request Saya
          </h1>
          <p>History request penambahan barang (Barang Masuk)</p>
        </div>
        <Link href="/request/create" className="btn-primary">
          <PlusIcon size={18} />
          Request Baru
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p>Belum ada request</p>
          <Link href="/request/create" className="btn-primary">
            Buat Request Baru
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
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.nama}</td>
                  <td>{req.jenis}</td>
                  <td>{req.jumlah}</td>
                  <td>{new Date(req.tanggal).toLocaleDateString("id-ID")}</td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        href={`/request/${req.id}`}
                        className="btn-detail"
                      >
                        <EyeIcon size={14} />
                        Detail
                      </Link>
                      {req.status === "pending" && (
                        <form
                          action={deleteRequest.bind(null, req.id)}
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
              <strong>⏳ Menunggu:</strong> Request sedang diproses admin. Anda
              bisa membatalkan request.
            </li>
            <li>
              <strong>✅ Disetujui:</strong> Request disetujui dan stok
              ditambahkan. Tidak bisa dibatalkan.
            </li>
            <li>
              <strong>❌ Ditolak:</strong> Request ditolak oleh admin. Tidak
              bisa dibatalkan.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}