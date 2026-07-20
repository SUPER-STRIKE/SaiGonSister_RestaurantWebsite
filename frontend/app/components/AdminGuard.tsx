"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const staffSessionKey = "saigonSisterStaffSession";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isBrowser = typeof window !== "undefined";
  const isAllowed = isBrowser && window.localStorage.getItem(staffSessionKey) === "active";

  useEffect(() => {
    if (isBrowser && !isAllowed) {
      router.replace("/#home");
    }
  }, [isAllowed, isBrowser, router]);

  if (!isAllowed) {
    return (
      <main className="admin-loading">
        <p>Checking staff access...</p>
      </main>
    );
  }

  return children;
}

export { staffSessionKey };
