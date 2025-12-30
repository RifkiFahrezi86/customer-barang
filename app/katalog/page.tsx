// customer-web/app/katalog/page.tsx (UPDATED)
import { requireCustomer } from "@/lib/auth";
import { getAllBarang, searchBarang } from "@/lib/db";
import { createOrder, createRequest } from "@/lib/actions";
import {
  BoxIcon,
  SearchIcon,
  ShoppingCartIcon,
  UploadIcon,
} from "@/lib/icons";

type Props = {
  searchParams: { q?: string };
};

export default async function KatalogPage({ searchParams }: Props) {
  await requireCustomer();

  const query = searchParams.q || "";
  const barang = query ? await searchBarang(query) : await getAllBarang();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>
            <BoxIcon size={32} className="inline-icon" />
            Katalog Barang
          </h1>
          <p>Browse barang yang tersedia dan lakukan pemesanan</p>
        </div>
      </div>

      {/* Search Bar */}
        <div className="search-form">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Cari nama barang atau jenis..."
            className="search-input"
          />

          <button
            type="submit"
            formAction="/katalog"
            formMethod="GET"
            className="btn-search"
          >
            <SearchIcon size={18} />
            Cari
          </button>
        </div>


      {/* Barang Grid */}
      {barang.length === 0 ? (
        <div className="empty-state">
          <p>Tidak ada barang tersedia</p>
        </div>
      ) : (
        <div className="barang-grid">
          {barang.map((item) => (
            <div key={item.id} className="barang-card">
              <div className="card-header">
                <h3>{item.nama}</h3>
                <span className="badge-jenis">{item.jenis}</span>
              </div>

              <div className="card-body">
                <div className="stok-info">
                  <span className="label">Stok Tersedia:</span>
                  <span className="value">
                    {item.stok} {item.satuan}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                {/* Button Pesan (Order) */}
                <form action={createOrder} className="action-form">
                  <input type="hidden" name="barang_id" value={item.id} />
                  <input
                    type="number"
                    name="jumlah"
                    min="1"
                    max={item.stok}
                    placeholder="Jumlah"
                    required
                    className="input-jumlah"
                  />
                  <button type="submit" className="btn-order">
                    <ShoppingCartIcon size={16} />
                    Pesan
                  </button>
                </form>

                {/* Button Request */}
                <form action={createRequest} className="action-form">
                  <input type="hidden" name="barang_id" value={item.id} />
                  <input
                    type="number"
                    name="jumlah"
                    min="1"
                    placeholder="Jumlah"
                    required
                    className="input-jumlah"
                  />
                  <button type="submit" className="btn-request">
                    <UploadIcon size={16} />
                    Request
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}