// customer-web/app/layout.tsx
import "@/styles/globals.css";
import { getCustomer } from "@/lib/auth";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Customer Portal - Gudang Barang",
  description: "Portal untuk customer memesan dan request barang",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCustomer();

  return (
    <html lang="id">
      <body>
        {customer && <Navbar />}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}