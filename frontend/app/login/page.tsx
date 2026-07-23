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
              Menu changes, daily specials, add-ons, images, and restaurant details live behind
              staff access.
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
