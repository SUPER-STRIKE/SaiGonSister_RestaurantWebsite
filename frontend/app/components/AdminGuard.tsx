"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readStaffSession } from "../lib/staff-auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const session = readStaffSession();

      if (!session) {
        router.replace("/login");
        setIsChecking(false);
        return;
      }

      setIsAllowed(true);
      setIsChecking(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  if (isChecking || !isAllowed) {
    return (
      <main className="admin-loading">
        <p>Checking staff access...</p>
      </main>
    );
  }

  return children;
}
