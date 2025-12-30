// customer-web/lib/types.ts
export type Barang = {
  id: string;
  nama: string;
  jenis: string;
  stok: number;
  satuan: string;
};

export type Order = {
  id: number;
  barang_id: string;
  nama: string;
  jenis: string;
  jumlah: number;
  tanggal: string;
  tujuan: string;
  catatan?: string;
  status: "pending" | "approved" | "rejected";
};

export type RequestBarang = {
  id: number;
  barang_id: string;
  nama: string;
  jenis: string;
  jumlah: number;
  tanggal: string;
  sumber: string;
  catatan?: string;
  status: "pending" | "approved" | "rejected";
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  role: "customer";
};