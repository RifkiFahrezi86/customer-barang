// lib/db.ts
import { sql } from "@vercel/postgres";
import { Barang, Order, RequestBarang } from "./types";

export async function getAllBarang(): Promise<Barang[]> {
  const { rows } = await sql<Barang>`
    SELECT id, nama, jenis, stok, satuan
    FROM barang
    WHERE stok > 0
    ORDER BY nama ASC
  `;
  return rows;
}

export async function getBarangById(id: string): Promise<Barang | null> {
  const { rows } = await sql<Barang>`
    SELECT id, nama, jenis, stok, satuan
    FROM barang
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] || null;
}

export async function getCustomerOrders(customerName: string): Promise<Order[]> {
  const { rows } = await sql<Order>`
    SELECT
      bk.id,
      bk.barang_id,
      b.nama,
      b.jenis,
      bk.jumlah,
      bk.tanggal,
      bk.tujuan,
      bk.status
    FROM barang_keluar bk
    JOIN barang b ON b.id = bk.barang_id
    WHERE bk.tujuan = ${customerName}
    ORDER BY bk.tanggal DESC
  `;
  return rows;
}

export async function getCustomerRequests(customerName: string): Promise<RequestBarang[]> {
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
}

export async function searchBarang(query: string): Promise<Barang[]> {
  const { rows } = await sql<Barang>`
    SELECT id, nama, jenis, stok, satuan
    FROM barang
    WHERE stok > 0
      AND (nama ILIKE ${"%" + query + "%"} OR jenis ILIKE ${"%" + query + "%"})
    ORDER BY nama ASC
  `;
  return rows;
}