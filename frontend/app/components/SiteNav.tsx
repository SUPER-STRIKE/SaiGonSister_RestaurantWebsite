"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { restaurantContent } from "../lib/restaurant-data";

type SiteNavProps = {
  tone?: "dark" | "light";
};

export function SiteNav({ tone = "dark" }: SiteNavProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isMovingDown = currentScrollY > lastScrollY.current;

      setIsHidden(isMovingDown && currentScrollY > 120);
      lastScrollY.current = currentScrollY;
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`nav ${tone === "light" ? "nav-light" : ""} ${isHidden ? "nav-hidden" : ""}`}
      aria-label="Main navigation"
    >
      <Link className="brand" href="/#home" aria-label={`${restaurantContent.restaurantName} home`}>
        <Image alt="" className="brand-logo" height={58} src="/logo.svg" width={58} />
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
