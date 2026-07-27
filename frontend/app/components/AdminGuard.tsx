"use client";

import { useEffect, useState } from "react";
import { clearStaffToken, getStaffToken, isStaffTokenValid } from "../lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getStaffToken();
    if (!token || !isStaffTokenValid(token)) {
      clearStaffToken();
      window.location.replace("/login");
      return;
    }
    setAllowed(true);
  }, []);

  if (!allowed) {
    return (
      <main className="admin-loading">
        <p>Checking staff access...</p>
      </main>
    );
  }

  return children;
}
