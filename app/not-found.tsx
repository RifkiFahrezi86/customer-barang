// customer-web/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container">
      <div className="empty-state" style={{ paddingTop: "120px" }}>
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔍</div>
        <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
          404 - Halaman Tidak Ditemukan
        </h1>
        <p style={{ marginBottom: "32px" }}>
          Maaf, halaman yang Anda cari tidak ditemukan.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/katalog" className="btn-primary">
            📦 Ke Katalog
          </Link>
          <Link href="/orders" className="btn-secondary">
            🛒 Ke Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}