// customer-web/app/login/page.tsx
import { loginCustomer } from "@/lib/actions";
import { getCustomer } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const customer = await getCustomer();
  
  // Jika sudah login, redirect ke katalog
  if (customer) {
    redirect("/katalog");
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🏪 Gudang Barang</h1>
          <p>Portal Customer</p>
        </div>

        <form action={loginCustomer} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="customer@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Account: customer1@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}