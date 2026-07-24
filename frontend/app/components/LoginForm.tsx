"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isStaffEmail, isStaffPassword, saveStaffSession } from "../lib/staff-auth";

type LoginMode = "login" | "forgot" | "verify" | "reset" | "done";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!isStaffEmail(normalizedEmail) || !isStaffPassword(password)) {
      setMessage("Email or password is not correct.");
      return;
    }

    saveStaffSession();
    router.push("/admin");
  }

  function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = recoveryEmail.trim().toLowerCase();

    if (!isStaffEmail(normalizedEmail)) {
      setMessage("No staff account found for that email.");
      return;
    }

    const nextCode = Math.floor(100000 + Math.random() * 900000).toString();
    setRecoveryEmail(normalizedEmail);
    setVerificationCode(nextCode);
    setEnteredCode("");
    setMessage("Verification code sent.");
    setMode("verify");
  }

  function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (enteredCode.trim() !== verificationCode) {
      setMessage("That code does not match. Please try again.");
      return;
    }

    setMessage("");
    setMode("reset");
  }

  function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Password updated.");
    setMode("done");
  }

  function returnToSignIn() {
    setMode("login");
    setMessage("");
    setEnteredCode("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
  }

  if (mode === "forgot") {
    return (
      <form className="admin-form" onSubmit={handleForgotPassword}>
        <label>
          Staff email
          <input
            onChange={(event) => setRecoveryEmail(event.target.value)}
            required
            type="email"
            value={recoveryEmail}
          />
        </label>
        {message ? <p className="login-message">{message}</p> : null}
        <div className="login-inline-actions">
          <button type="submit">Send verification</button>
          <button className="forgot-link" onClick={returnToSignIn} type="button">
            Back to sign in
          </button>
        </div>
      </form>
    );
  }

  if (mode === "verify") {
    return (
      <form className="admin-form" onSubmit={handleVerifyCode}>
        <p className="login-message">{message}</p>
        <p className="verification-code">Verification code: {verificationCode}</p>
        <label>
          Enter code
          <input
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setEnteredCode(event.target.value)}
            required
            value={enteredCode}
          />
        </label>
        <div className="login-inline-actions">
          <button type="submit">Verify code</button>
          <button className="forgot-link" onClick={returnToSignIn} type="button">
            Back to sign in
          </button>
        </div>
      </form>
    );
  }

  if (mode === "reset") {
    return (
      <form className="admin-form" onSubmit={handleResetPassword}>
        <label>
          New password
          <input
            minLength={8}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            type="password"
            value={newPassword}
          />
        </label>
        <label>
          Confirm password
          <input
            minLength={8}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            type="password"
            value={confirmPassword}
          />
        </label>
        {message ? <p className="login-message">{message}</p> : null}
        <button type="submit">Change password</button>
      </form>
    );
  }

  if (mode === "done") {
    return (
      <div className="admin-form">
        <p className="login-message">{message}</p>
        <button onClick={returnToSignIn} type="button">
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Email
        <input
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label>
        Password
        <input
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      {message ? <p className="login-message">{message}</p> : null}
      <div className="login-inline-actions">
        <button type="submit">Sign in</button>
        <button className="forgot-link" onClick={() => setMode("forgot")} type="button">
          Forgot password?
        </button>
      </div>
    </form>
  );
}
