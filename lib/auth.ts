// lib/auth.ts
import { cookies } from "next/headers";

export async function getCustomerId(): Promise<string | null> {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;
  return customerId || null;
}

export async function getCustomerName(): Promise<string | null> {
  const cookieStore = await cookies();
  const customerName = cookieStore.get("customer_name")?.value;
  return customerName || null;
}

export async function requireAuth() {
  const customerId = await getCustomerId();
  if (!customerId) {
    throw new Error("Unauthorized");
  }
  return customerId;
}