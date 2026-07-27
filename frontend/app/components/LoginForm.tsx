"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ApiError, loginRequest, verifyOtpRequest } from "../lib/api";
import { setStaffToken } from "../lib/auth";

type LoginMode = "login" | "verify";

export function LoginForm() {
  const [mode, setMode] = useState<LoginMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    try {
      const result = await loginRequest(username.trim(), password);
      setMessage(`${result.message} Use the newest Mailtrap email.`);
      setMode("verify");
      setOtp("");
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Login failed.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    try {
      const result = await verifyOtpRequest(otp.trim());
      setStaffToken(result.token);
      window.location.assign("/admin");
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "OTP verification failed.");
      inFlight.current = false;
      setBusy(false);
    }
  }

  if (mode === "verify") {
    return (
      <form className="admin-form" onSubmit={handleVerify}>
        <p className="login-message">
          {message || "Enter the 6-digit code sent to your admin email."}
        </p>
        <label>
          Verification code
          <input
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            required
            value={otp}
          />
        </label>
        <div className="login-inline-actions">
          <button disabled={busy || otp.length !== 6} type="submit">
            {busy ? "Checking..." : "Verify code"}
          </button>
          <button
            className="forgot-link"
            onClick={() => {
              setMode("login");
              setMessage("");
              setOtp("");
              inFlight.current = false;
              setBusy(false);
            }}
            type="button"
          >
            Back to sign in
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="admin-form" onSubmit={handleLogin}>
      <label>
        Username
        <input
          autoComplete="username"
          onChange={(event) => setUsername(event.target.value)}
          required
          value={username}
        />
      </label>
      <label>
        Password
        <input
          autoComplete="current-password"
          minLength={1}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      {message ? <p className="login-message">{message}</p> : null}
      <div className="login-inline-actions">
        <button disabled={busy} type="submit">
          {busy ? "Sending OTP..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
