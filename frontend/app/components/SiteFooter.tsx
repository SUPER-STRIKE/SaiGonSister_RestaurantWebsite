import { restaurantContent } from "../lib/restaurant-data";

export function SiteFooter() {
  const { contact, restaurantName } = restaurantContent;

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>{restaurantName}</strong>
        <span>Organic Vietnamese dining</span>
      </div>
      <div>
        <span>Visit</span>
        <p>{contact.location}</p>
        <p>{contact.hours}</p>
      </div>
      <div>
        <span>Contact</span>
        <p>{contact.email}</p>
        <p>{contact.phone}</p>
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
