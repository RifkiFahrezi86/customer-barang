// customer-web/app/request/create/page.tsx (UPDATED)
import { requireCustomer } from "@/lib/auth";
import { getAllBarang } from "@/lib/db";
import { createRequest } from "@/lib/actions";
import Link from "next/link";
import {
  UploadIcon,
  ArrowLeftIcon,
  InfoIcon,
  LightbulbIcon,
} from "@/lib/icons";

export default async function CreateRequestPage() {
  await requireCustomer();
  const barangList = await getAllBarang();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>
            <UploadIcon size={32} className="inline-icon" />
            Request Barang Baru
          </h1>
          <p>Form untuk request penambahan stok barang</p>
        </div>
        <Link href="/request" className="btn-secondary">
          <ArrowLeftIcon size={18} />
          Kembali
        </Link>
      </div>

      {/* Info Box */}
      <div className="info-box" style={{ marginBottom: "24px" }}>
        <h4>
          <InfoIcon size={20} className="inline-icon" />
          Informasi Request
        </h4>
        <ul>
          <li>
            <strong>Request Barang:</strong> Digunakan untuk meminta penambahan
            stok barang yang sudah ada.
          </li>
          <li>
            Setelah submit, admin akan mereview dan menyetujui/menolak request
            Anda.
          </li>
          <li>
            Jika disetujui, stok barang akan bertambah sesuai jumlah request.
          </li>
        </ul>
      </div>

      {/* Form */}
      <div className="form-box">
        <form action={createRequest}>
          <div className="form-grid">
            {/* Pilih Barang */}
            <div className="form-group full-width">
              <label htmlFor="barang_id">
                Pilih Barang <span className="required">*</span>
              </label>
              <select
                id="barang_id"
                name="barang_id"
                required
                className="form-select"
              >
                <option value="">-- Pilih Barang --</option>
                {barangList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} - {item.jenis} (Stok: {item.stok} {item.satuan}
                    )
                  </option>
                ))}
              </select>
              <small className="form-hint">
                Pilih barang yang ingin Anda request untuk penambahan stok
              </small>
            </div>

            {/* Jumlah */}
            <div className="form-group">
              <label htmlFor="jumlah">
                Jumlah Request <span className="required">*</span>
              </label>
              <input
                type="number"
                id="jumlah"
                name="jumlah"
                min="1"
                required
                placeholder="Contoh: 10"
                className="form-input"
              />
              <small className="form-hint">
                Masukkan jumlah yang ingin Anda request
              </small>
            </div>

            {/* Catatan */}
            <div className="form-group full-width">
              <label htmlFor="catatan">Catatan (Opsional)</label>
              <textarea
                id="catatan"
                name="catatan"
                rows={4}
                placeholder="Tambahkan catatan atau alasan request..."
                className="form-textarea"
              />
              <small className="form-hint">
                Jelaskan alasan atau kebutuhan request Anda (opsional)
              </small>
            </div>

            {/* Actions */}
            <div className="form-actions full-width">
              <Link href="/request" className="btn-secondary">
                Batal
              </Link>
              <button type="submit" className="btn-primary">
                <UploadIcon size={18} />
                Submit Request
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Example Box */}
      <div className="example-box">
        <h4>
          <LightbulbIcon size={20} className="inline-icon" />
          Contoh Penggunaan
        </h4>
        <div className="example-item">
          <strong>Scenario 1:</strong> Stok barang "Laptop HP" tinggal 2 unit,
          Anda perlu 10 unit tambahan.
          <br />→ Request: Laptop HP, Jumlah: 10, Catatan: "Untuk project
          kantor baru"
        </div>
        <div className="example-item">
          <strong>Scenario 2:</strong> Barang "Mouse Logitech" habis, perlu
          restock.
          <br />→ Request: Mouse Logitech, Jumlah: 50, Catatan: "Stok habis,
          restock bulanan"
        </div>
      </div>
    </div>
  );
}