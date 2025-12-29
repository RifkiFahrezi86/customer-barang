// app/page.tsx
import { requireAuth } from "@/lib/auth";
import { getAllBarang, searchBarang } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  try {
    await requireAuth();
  } catch (error) {
    redirect("/login");
  }

  const query = searchParams.q || "";
  const barangList = query ? await searchBarang(query) : await getAllBarang();

  return (
    <div className="container">
      <h1 className="page-title">📦 Katalog Barang</h1>

      <div className="search-box">
        <form method="GET">
          <input
            type="text"
            name="q"
            placeholder="Cari barang..."
            defaultValue={query}
          />
          <button type="submit">🔍 Cari</button>
        </form>
      </div>

      {barangList.length === 0 ? (
        <div className="empty-state">
          <h3>Tidak ada barang ditemukan</h3>
          <p>Coba cari dengan kata kunci lain</p>
        </div>
      ) : (
        <div className="catalog-grid">
          {barangList.map((barang) => (
            <div key={barang.id} className="catalog-item">
              <h3>{barang.nama}</h3>
              <p className="jenis">Jenis: {barang.jenis}</p>
              <p className="stok">
                Stok: {barang.stok} {barang.satuan}
              </p>
              <div className="actions">
                <Link href={`/cart?barang_id=${barang.id}`} className="btn btn-primary">
                  🛒 Pesan
                </Link>
                <Link href={`/request?barang_id=${barang.id}`} className="btn btn-secondary">
                  📥 Request
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}