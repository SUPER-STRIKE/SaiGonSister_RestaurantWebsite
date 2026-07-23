"use client";

import { useEffect, useState } from "react";
import type { HouseFocus } from "../lib/restaurant-data";

type HouseFocusShowcaseProps = {
  focus: HouseFocus;
};

export function HouseFocusShowcase({ focus }: HouseFocusShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLink = focus.links[activeIndex] ?? focus.links[0];
  const activeImage = activeLink?.image || focus.image;

  useEffect(() => {
    if (focus.links.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % focus.links.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [focus.links.length]);

  return (
    <section className="menu-focus" aria-label="SaiGonSister menu focus">
      <div className="menu-focus-photo" aria-hidden="true">
        <div
          className="menu-focus-photo-layer"
          key={activeImage}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(8, 38, 31, 0.04), rgba(8, 38, 31, 0.34)), url(${activeImage})` }}
        />
      </div>
      <div className="menu-focus-copy">
        <h2>{focus.title}</h2>
        <p>{focus.description}</p>
        <div className="roll-focus-grid" aria-label="Featured menu headers">
          {focus.links.map((link, index) => (
            <a
              className={index === activeIndex ? "active" : ""}
              href={`#${link.category}-${link.sectionId}`}
              key={`${link.category}-${link.sectionId}`}
              onMouseEnter={() => setActiveIndex(index)}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
