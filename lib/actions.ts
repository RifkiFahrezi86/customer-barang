// customer-web/lib/actions.ts (UPDATED)
"use server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireCustomer } from "./auth";

// ==========================================
// AUTHENTICATION
// ==========================================

export async function loginCustomer(formData: FormData) {
  try {
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
    if (!user) {
      throw new Error("Customer tidak ditemukan");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Password salah");
    }

    const cookieStore = await cookies();

    cookieStore.set("customer_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("customer_name", user.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("✅ Customer login successful:", user.name);
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }

  redirect("/katalog");
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_id");
  cookieStore.delete("customer_name");
  redirect("/login");
}

// ==========================================
// CREATE ORDER (BARANG KELUAR)
// ==========================================

export async function createOrder(formData: FormData) {
  const customerName = await requireCustomer();

  const barangId = formData.get("barang_id")?.toString();
  const jumlah = Number(formData.get("jumlah"));
  const catatan = formData.get("catatan")?.toString() || "";

  if (!barangId || jumlah <= 0) {
    throw new Error("Data tidak valid");
  }

  const { rows } = await sql`
    SELECT stok FROM barang WHERE id = ${barangId}
  `;

  if (!rows[0]) throw new Error("Barang tidak ditemukan");
  if (rows[0].stok < jumlah) throw new Error("Stok tidak mencukupi");

  await sql`
    INSERT INTO barang_keluar
    (barang_id, jumlah, tujuan, catatan, status)
    VALUES (${barangId}, ${jumlah}, ${customerName}, ${catatan}, 'pending')
  `;

  console.log(`📦 Order created: ${jumlah}x ${barangId} by ${customerName}`);

  revalidatePath("/orders");
  revalidatePath("/katalog");
  redirect("/orders");
}

// ==========================================
// DELETE ORDER (Cancel - Only Pending)
// ==========================================

export async function deleteOrder(orderId: number) {
  const customerName = await requireCustomer();

  try {
    // Check if order exists and belongs to customer
    const { rows } = await sql`
      SELECT id, status, tujuan
      FROM barang_keluar
      WHERE id = ${orderId}
    `;

    if (!rows[0]) {
      throw new Error("Pesanan tidak ditemukan");
    }

    if (rows[0].tujuan !== customerName) {
      throw new Error("Anda tidak memiliki akses untuk menghapus pesanan ini");
    }

    // Only allow delete if status is pending
    if (rows[0].status !== "pending") {
      throw new Error(
        "Hanya pesanan dengan status pending yang dapat dibatalkan"
      );
    }

    // Delete order
    await sql`
      DELETE FROM barang_keluar
      WHERE id = ${orderId}
    `;

    console.log(`🗑️ Order ${orderId} deleted by ${customerName}`);

    revalidatePath("/orders");
    revalidatePath("/katalog");
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    throw error;
  }

  redirect("/orders");
}

// ==========================================
// CREATE REQUEST (BARANG MASUK)
// ==========================================

export async function createRequest(formData: FormData) {
  const customerName = await requireCustomer();

  const barangId = formData.get("barang_id")?.toString();
  const jumlah = Number(formData.get("jumlah"));
  const catatan = formData.get("catatan")?.toString() || "";

  if (!barangId || jumlah <= 0) {
    throw new Error("Data request tidak valid");
  }

  await sql`
    INSERT INTO barang_masuk
    (barang_id, jumlah, sumber, catatan, status)
    VALUES (${barangId}, ${jumlah}, ${customerName}, ${catatan}, 'pending')
  `;

  console.log(`📥 Request created: ${jumlah}x ${barangId} by ${customerName}`);

  revalidatePath("/request");
  redirect("/request");
}

// ==========================================
// DELETE REQUEST (Cancel - Only Pending)
// ==========================================

export async function deleteRequest(requestId: number) {
  const customerName = await requireCustomer();

  try {
    // Check if request exists and belongs to customer
    const { rows } = await sql`
      SELECT id, status, sumber
      FROM barang_masuk
      WHERE id = ${requestId}
    `;

    if (!rows[0]) {
      throw new Error("Request tidak ditemukan");
    }

    if (rows[0].sumber !== customerName) {
      throw new Error("Anda tidak memiliki akses untuk menghapus request ini");
    }

    // Only allow delete if status is pending
    if (rows[0].status !== "pending") {
      throw new Error(
        "Hanya request dengan status pending yang dapat dibatalkan"
      );
    }

    // Delete request
    await sql`
      DELETE FROM barang_masuk
      WHERE id = ${requestId}
    `;

    console.log(`🗑️ Request ${requestId} deleted by ${customerName}`);

    revalidatePath("/request");
  } catch (error) {
    console.error("❌ Error deleting request:", error);
    throw error;
  }

  redirect("/request");
}