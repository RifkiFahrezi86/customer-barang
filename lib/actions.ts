// lib/actions.ts
"use server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function loginCustomer(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  const { rows } = await sql`
    SELECT id, name, role, password
    FROM users
    WHERE email = ${email} AND role = 'customer'
  `;

  const user = rows[0];
  if (!user) throw new Error("Customer tidak ditemukan");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Password salah");

  const cookieStore = await cookies();

  cookieStore.set("customer_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("customer_name", user.name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_id");
  cookieStore.delete("customer_name");
  redirect("/login");
}

export async function createOrder(formData: FormData) {
  const cookieStore = await cookies();
  const customerName = cookieStore.get("customer_name")?.value;

  if (!customerName) {
    throw new Error("Unauthorized");
  }

  const barangId = formData.get("barang_id") as string;
  const jumlah = Number(formData.get("jumlah"));
  const catatan = formData.get("catatan") as string;

  if (!barangId || isNaN(jumlah) || jumlah <= 0) {
    throw new Error("Data tidak valid");
  }

  const { rows } = await sql`
    SELECT stok FROM barang WHERE id = ${barangId}
  `;

  if (!rows[0] || rows[0].stok < jumlah) {
    throw new Error("Stok tidak mencukupi");
  }

  await sql`
    INSERT INTO barang_keluar (barang_id, jumlah, tanggal, tujuan, catatan, status)
    VALUES (
      ${barangId},
      ${jumlah},
      NOW(),
      ${customerName},
      ${catatan || "Pesanan dari customer"},
      'pending'
    )
  `;

  revalidatePath("/");
  revalidatePath("/orders");
  redirect("/orders");
}

export async function createRequest(formData: FormData) {
  const cookieStore = await cookies();
  const customerName = cookieStore.get("customer_name")?.value;

  if (!customerName) {
    throw new Error("Unauthorized");
  }

  const barangId = formData.get("barang_id") as string;
  const jumlah = Number(formData.get("jumlah"));
  const catatan = formData.get("catatan") as string;

  if (!barangId || isNaN(jumlah) || jumlah <= 0) {
    throw new Error("Data tidak valid");
  }

  await sql`
    INSERT INTO barang_masuk (barang_id, jumlah, tanggal, sumber, catatan, status)
    VALUES (
      ${barangId},
      ${jumlah},
      NOW(),
      ${customerName},
      ${catatan || "Request dari customer"},
      'pending'
    )
  `;

  revalidatePath("/");
  revalidatePath("/request");
  redirect("/request");
}