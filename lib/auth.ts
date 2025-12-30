// customer-web/lib/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCustomer() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("customer_id")?.value;
  const customerName = cookieStore.get("customer_name")?.value;

  if (!customerId || !customerName) {
    return null;
  }

  return { id: customerId, name: customerName };
}

export async function requireCustomer() {
  const customer = await getCustomer();
  
  if (!customer) {
    redirect("/login");
  }

  return customer.name;
}