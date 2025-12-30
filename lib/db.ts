// customer-web/lib/db.ts
import { sql } from "@vercel/postgres";
import { Barang, Order, RequestBarang } from "./types";

// ==========================================
// KATALOG BARANG
// ==========================================

export async function getAllBarang(): Promise<Barang[]> {
  try {
    const { rows } = await sql<Barang>`
      SELECT id, nama, jenis, stok, satuan
      FROM barang
      WHERE stok > 0
      ORDER BY nama ASC
    `;
    return rows;
  } catch (error) {
    console.error("❌ Error fetching barang:", error);
    return [];
  }
}

export async function getBarangById(id: string): Promise<Barang | null> {
  try {
    const { rows } = await sql<Barang>`
      SELECT id, nama, jenis, stok, satuan
      FROM barang
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error fetching barang by id:", error);
    return null;
  }
}

export async function searchBarang(query: string): Promise<Barang[]> {
  try {
    const searchTerm = `%${query}%`;
    const { rows } = await sql<Barang>`
      SELECT id, nama, jenis, stok, satuan
      FROM barang
      WHERE stok > 0
        AND (nama ILIKE ${searchTerm} OR jenis ILIKE ${searchTerm})
      ORDER BY nama ASC
    `;
    return rows;
  } catch (error) {
    console.error("❌ Error searching barang:", error);
    return [];
  }
}

// ==========================================
// ORDERS (BARANG KELUAR)
// ==========================================

export async function getCustomerOrders(customerName: string): Promise<Order[]> {
  try {
    const { rows } = await sql<Order>`
      SELECT
        bk.id,
        bk.barang_id,
        b.nama,
        b.jenis,
        bk.jumlah,
        bk.tanggal,
        bk.tujuan,
        bk.catatan,
        bk.status
      FROM barang_keluar bk
      JOIN barang b ON b.id = bk.barang_id
      WHERE bk.tujuan = ${customerName}
      ORDER BY bk.tanggal DESC
    `;
    return rows;
  } catch (error) {
    console.error("❌ Error fetching customer orders:", error);
    return [];
  }
}

export async function getOrderById(
  id: number,
  customerName: string
): Promise<Order | null> {
  try {
    const { rows } = await sql<Order>`
      SELECT
        bk.id,
        bk.barang_id,
        b.nama,
        b.jenis,
        bk.jumlah,
        bk.tanggal,
        bk.tujuan,
        bk.catatan,
        bk.status
      FROM barang_keluar bk
      JOIN barang b ON b.id = bk.barang_id
      WHERE bk.id = ${id} AND bk.tujuan = ${customerName}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error fetching order by id:", error);
    return null;
  }
}

// ==========================================
// REQUESTS (BARANG MASUK)
// ==========================================

export async function getCustomerRequests(
  customerName: string
): Promise<RequestBarang[]> {
  try {
    const { rows } = await sql<RequestBarang>`
      SELECT
        bm.id,
        bm.barang_id,
        b.nama,
        b.jenis,
        bm.jumlah,
        bm.tanggal,
        bm.sumber,
        bm.catatan,
        bm.status
      FROM barang_masuk bm
      JOIN barang b ON b.id = bm.barang_id
      WHERE bm.sumber = ${customerName}
      ORDER BY bm.tanggal DESC
    `;
    return rows;
  } catch (error) {
    console.error("❌ Error fetching customer requests:", error);
    return [];
  }
}

export async function getRequestById(
  id: number,
  customerName: string
): Promise<RequestBarang | null> {
  try {
    const { rows } = await sql<RequestBarang>`
      SELECT
        bm.id,
        bm.barang_id,
        b.nama,
        b.jenis,
        bm.jumlah,
        bm.tanggal,
        bm.sumber,
        bm.catatan,
        bm.status
      FROM barang_masuk bm
      JOIN barang b ON b.id = bm.barang_id
      WHERE bm.id = ${id} AND bm.sumber = ${customerName}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error fetching request by id:", error);
    return null;
  }
}