// app/cart/page.tsx
import { requireAuth } from "@/lib/auth";
import { getBarangById } from "@/lib/db";
import { createOrder } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CartPage({
  searchParams,
}: {
  searchParams: { barang_id?: string };
}) {
  try {
    await requireAuth();
  } catch (error) {
    redirect("/login");
  }

  const barangId = searchParams.barang_id;

  if (!barangId) {
    redirect("/");
  }

  const barang = await getBarangById(barangId);

  if (!barang) {
    redirect("/");
  }

  return (
    <div className="container">
      <h1 className="page-title">🛒 Pesan Barang</h1>

      <div className="form-box">
        <h2>{barang.nama}</h2>
        <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Jenis: {barang.jenis} | Stok tersedia: {barang.stok} {barang.satuan}
        </p>

        <form action={createOrder}>
          <input type="hidden" name="barang_id" value={barang.id} />

          <div className="form-group">
            <label htmlFor="jumlah">Jumlah Pesanan</label>
            <input
              type="number"
              id="jumlah"
              name="jumlah"
              min="1"
              max={barang.stok}
              placeholder="Masukkan jumlah"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="catatan">Catatan (Opsional)</label>
            <textarea
              id="catatan"
              name="catatan"
              placeholder="Tambahkan catatan untuk pesanan..."
            ></textarea>
          </div>

          <div className="form-actions">
            <Link href="/" className="btn btn-secondary">
              ← Batal
            </Link>
            <button type="submit" className="btn btn-primary">
              ✅ Kirim Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}