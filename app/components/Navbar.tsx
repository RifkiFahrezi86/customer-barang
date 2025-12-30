// customer-web/app/components/Navbar.tsx (UPDATED)
import Link from "next/link";
import { logoutCustomer } from "@/lib/actions";
import { getCustomer } from "@/lib/auth";
import {
  StoreIcon,
  BoxIcon,
  ShoppingCartIcon,
  UploadIcon,
  UserIcon,
  LogoutIcon,
} from "@/lib/icons";

export default async function Navbar() {
  const customer = await getCustomer();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/katalog">
          <StoreIcon size={24} />
          <span>Gudang Barang</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link href="/katalog" className="nav-link">
          <BoxIcon size={18} />
          Katalog
        </Link>
        <Link href="/orders" className="nav-link">
          <ShoppingCartIcon size={18} />
          Pesanan Saya
        </Link>
        <Link href="/request" className="nav-link">
          <UploadIcon size={18} />
          Request Saya
        </Link>
      </div>

      <div className="navbar-user">
        {customer && (
          <>
            <div className="user-info">
              <UserIcon size={18} />
              <span className="user-name">{customer.name}</span>
            </div>
            <form action={logoutCustomer}>
              <button type="submit" className="btn-logout">
                <LogoutIcon size={16} />
                Logout
              </button>
            </form>
          </>
        )}
      </div>
    </nav>
  );
}