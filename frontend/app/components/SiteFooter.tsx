"use client";

import { useEffect, useState } from "react";
import { restaurantContent } from "../lib/restaurant-data";

const contactStorageKey = "saigonSisterContactDetails";
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SiteFooter() {
  const { contact, restaurantName } = restaurantContent;
  const [footerContact, setFooterContact] = useState(contact);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedContact = window.localStorage.getItem(contactStorageKey);
        if (savedContact) {
          setFooterContact({ ...contact, ...JSON.parse(savedContact) });
        }
      } catch {
        setFooterContact(contact);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [contact]);

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>{restaurantName}</strong>
        <span>Organic Vietnamese dining</span>
      </div>
      <div>
        <span>Visit</span>
        <p>{footerContact.location}</p>
        <div className="footer-hours">
          {weekDays.map((day) => (
            <p key={day}>
              <strong>{day.slice(0, 3)}</strong> {footerContact.hoursByDay[day]}
            </p>
          ))}
        </div>
      </div>
      <div>
        <span>Contact</span>
        <p>{footerContact.email}</p>
        <p>{footerContact.phone}</p>
      </div>
      <div>
        <span>Site</span>
        <p>
          Built by{" "}
          <a href="https://github.com/SUPER-STRIKE" rel="noreferrer" target="_blank">
            SUPER-STRIKE
          </a>{" "}
          and{" "}
          <a href="https://github.com/hertzy-da-poet" rel="noreferrer" target="_blank">
            hertzy-da-poet
          </a>
        </p>
      </div>
    </footer>
  );
}
