// app/layout.tsx
import { getCustomerId, getCustomerName } from "@/lib/auth";
import { logoutCustomer } from "@/lib/actions";
import Link from "next/link";
import "../public/styles/globals.css";

export const metadata = {
  title: "Customer Web - Gudang Barang",
  description: "Portal customer untuk memesan barang",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customerId = await getCustomerId();
  const customerName = await getCustomerName();

  return (
    <html lang="id">
      <body>
        {customerId && (
          <nav className="navbar">
            <div className="brand">🏪 Gudang Barang</div>
            <nav>
              <Link href="/">Katalog</Link>
              <Link href="/orders">Pesanan Saya</Link>
              <Link href="/request">Request Barang</Link>
            </nav>
            <div className="user-info">
              {customerName} |{" "}
              <form action={logoutCustomer} className="logout-form">
                <button type="submit" className="logout-btn">
                  Logout
                </button>
              </form>
            </div>
          </nav>
        )}
        {children}
      </body>
    </html>
  );
}