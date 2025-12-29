// app/login/page.tsx
import { loginCustomer } from "@/lib/actions";
import { getCustomerId } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const customerId = await getCustomerId();

  if (customerId) {
    redirect("/");
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Login Customer</h1>
        <p>Masuk untuk memesan barang</p>

        <form action={loginCustomer}>
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

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }}>
            Masuk
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#94a3b8", textAlign: "center" }}>
          Hanya untuk customer terdaftar
        </p>
      </div>
    </div>
  );
}