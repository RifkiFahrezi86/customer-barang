// app/request/page.tsx
import { requireAuth, getCustomerName } from "@/lib/auth";
import { getBarangById, getCustomerRequests } from "@/lib/db";
import { createRequest } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RequestPage({
  searchParams,
}: {
  searchParams: { barang_id?: string };
}) {
  try {
    await requireAuth();
  } catch (error) {
    redirect("/login");
  }

  const customerName = await getCustomerName();

  if (!customerName) {
    redirect("/login");
  }

  const barangId = searchParams.barang_id;

  if (barangId) {
    const barang = await getBarangById(barangId);

    if (!barang) {
      redirect("/request");
    }

    return (
      <div className="container">
        <h1 className="page-title">📥 Request Barang Masuk</h1>

        <div className="form-box">
          <h2>{barang.nama}</h2>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            Jenis: {barang.jenis}
          </p>

          <form action={createRequest}>
            <input type="hidden" name="barang_id" value={barang.id} />

            <div className="form-group">
              <label htmlFor="jumlah">Jumlah Request</label>
              <input
                type="number"
                id="jumlah"
                name="jumlah"
                min="1"
                placeholder="Masukkan jumlah"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="catatan">Catatan</label>
              <textarea
                id="catatan"
                name="catatan"
                placeholder="Alasan request barang masuk..."
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <Link href="/request" className="btn btn-secondary">
                ← Batal
              </Link>
              <button type="submit" className="btn btn-primary">
                ✅ Kirim Request
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const requests = await getCustomerRequests(customerName);

  return (
    <div className="container">
      <h1 className="page-title">📥 Request Barang Masuk</h1>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>Belum ada request</h3>
          <p>Mulai request barang dari katalog</p>
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
                <th>Catatan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req.id}>
                  <td>{index + 1}</td>
                  <td>{req.nama}</td>
                  <td>{req.jenis}</td>
                  <td>{req.jumlah}</td>
                  <td>
                    {new Date(req.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>{req.catatan || "-"}</td>
                  <td>
                    <span className={`badge ${req.status}`}>
                      {req.status === "pending" && "Menunggu"}
                      {req.status === "approved" && "Disetujui"}
                      {req.status === "rejected" && "Ditolak"}
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