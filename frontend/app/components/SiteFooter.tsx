"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchRestaurantInfo } from "../lib/api";
import { restaurantContent } from "../lib/restaurant-data";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

function groupHours(hoursByDay: Record<string, string>) {
  const groups: { label: string; hours: string }[] = [];
  let start = 0;

  while (start < weekDays.length) {
    const hours = hoursByDay[weekDays[start]] ?? "";
    let end = start;
    while (end + 1 < weekDays.length && hoursByDay[weekDays[end + 1]] === hours) {
      end += 1;
    }
    const label =
      start === end
        ? weekDays[start]
        : `${weekDays[start]} - ${weekDays[end]}`;
    groups.push({ label, hours });
    start = end + 1;
  }

  return groups;
}

function IconPin() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        fill="currentColor"
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3 12.4 12.4 0 0 0 3.9.6 1.2 1.2 0 0 1 1.2 1.2V20a1.2 1.2 0 0 1-1.2 1.2A17.2 17.2 0 0 1 2.8 4.2 1.2 1.2 0 0 1 4 3h3.3a1.2 1.2 0 0 1 1.2 1.2 12.4 12.4 0 0 0 .6 3.9 1.2 1.2 0 0 1-.3 1.2z"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5z"
      />
    </svg>
  );
}

function IconClock() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 11h-4V7h2v4h2z"
      />
    </svg>
  );
}

export function SiteFooter() {
  const { contact, restaurantName } = restaurantContent;
  const [footerContact, setFooterContact] = useState(contact);
  const year = new Date().getFullYear();

  useEffect(() => {
    let alive = true;
    fetchRestaurantInfo()
      .then((info) => {
        if (!alive) return;
        setFooterContact({
          location: info.location,
          city: info.city,
          email: info.email,
          phone: info.phone,
          hoursByDay: info.hoursByDay,
          hoursNote: info.hoursNote,
        });
      })
      .catch(() => {
        // Keep static fallback when the API is offline.
      });
    return () => {
      alive = false;
    };
  }, []);

  const hourGroups = useMemo(
    () => groupHours(footerContact.hoursByDay ?? contact.hoursByDay),
    [contact.hoursByDay, footerContact.hoursByDay],
  );

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <strong>{restaurantName}</strong>
          <span className="footer-est">Est. 2026 - Toronto</span>
          <p className="footer-brand-copy">
            Authentic Vietnamese cuisine, hand-crafted with organic ingredients. A full vegan menu
            awaits, alongside the signatures of a fifteen-year downtown tradition.
          </p>
        </div>

        <div className="footer-visit">
          <span>Visit us</span>
          <div className="footer-line">
            <IconPin />
            <p>
              {footerContact.location}
              <br />
              {footerContact.city || "Toronto, ON"}
            </p>
          </div>
          {footerContact.phone ? (
            <div className="footer-line">
              <IconPhone />
              <p>{footerContact.phone}</p>
            </div>
          ) : null}
          <div className="footer-line">
            <IconMail />
            <p>
              <a href={`mailto:${footerContact.email}`}>{footerContact.email}</a>
            </p>
          </div>
        </div>

        <div className="footer-hours-panel">
          <span className="footer-hours-title">
            <IconClock /> Operating hours
          </span>
          <div className="footer-hours">
            {hourGroups.map((group) => (
              <p key={group.label}>
                <strong>{group.label}</strong>
                <span>{group.hours}</span>
              </p>
            ))}
          </div>
          {footerContact.hoursNote ? <p className="footer-hours-note">{footerContact.hoursNote}</p> : null}
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} {restaurantName} · All rights reserved
        </p>
        <p className="footer-credit">
          Built by{" "}
          <a href="https://github.com/SUPER-STRIKE" rel="noreferrer" target="_blank">
            SUPER-STRIKE
          </a>{" "}
          and{" "}
          <a href="https://github.com/hertzy-da-poet" rel="noreferrer" target="_blank">
            hertzy-da-poet
          </a>
        </p>
        <a href="/login">Curator&apos;s desk</a>
      </div>
    </footer>
  );
}
