"use client";

import Link from "next/link";
import { restaurantContent } from "../lib/restaurant-data";

type SiteNavProps = {
  tone?: "dark" | "light";
};

export function SiteNav({ tone = "dark" }: SiteNavProps) {
  return (
    <nav className={`nav ${tone === "light" ? "nav-light" : ""}`} aria-label="Main navigation">
      <Link className="brand" href="/#home" aria-label={`${restaurantContent.restaurantName} home`}>
        <span>
          <strong>{restaurantContent.restaurantName}</strong>
          <small>Vietnamese Kitchen</small>
        </span>
      </Link>
      <div className="nav-links">
        <Link href="/#home">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link className="staff-link" href="/login">Staff</Link>
      </div>
    </nav>
  );
}
