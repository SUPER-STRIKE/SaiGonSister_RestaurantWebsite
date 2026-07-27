"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearStaffToken, getStaffToken, isStaffTokenValid } from "../lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getStaffToken();
    if (!isStaffTokenValid(token)) {
      clearStaffToken();
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <main className="admin-loading">
        <p>Checking staff access...</p>
      </main>
    );
  }

  return children;
}
