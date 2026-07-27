import Link from "next/link";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-shell" aria-labelledby="login-title">
        <Link className="login-brand" href="/">
          <span>
            <strong>SaiGonSister</strong>
            <small>Staff access</small>
          </span>
        </Link>
        <div className="login-panel">
          <div>
            <p className="eyebrow">Staff login</p>
            <h1 id="login-title">Sign in to manage the restaurant.</h1>
            <p>
              Sign in with your admin username and password. A one-time code is emailed for
              verification.
            </p>
          </div>
          <LoginForm />
          <Link className="login-back" href="/">
            Back to website
          </Link>
        </div>
      </section>
    </main>
  );
}
