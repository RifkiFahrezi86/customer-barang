// customer-web/app/page.tsx
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/auth";

export default async function HomePage() {
  const customer = await getCustomer();

  // Jika sudah login, redirect ke katalog
  // Jika belum login, redirect ke login
  if (customer) {
    redirect("/katalog");
  } else {
    redirect("/login");
  }
}