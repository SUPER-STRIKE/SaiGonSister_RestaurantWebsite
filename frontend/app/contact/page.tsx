import { SiteNav } from "../components/SiteNav";
import { restaurantContent } from "../lib/restaurant-data";

export default function ContactPage() {
  const { contact } = restaurantContent;

  return (
    <main>
      <section className="page-hero contact-hero">
        <SiteNav />
        <div className="page-hero-content">
          <p className="eyebrow">Visit us</p>
          <h1>Full-service Vietnamese dining.</h1>
          <p>
            Find opening details, contact information, and location notes for the restaurant.
            Reach out for menu questions, catering, and opening details.
          </p>
          <div className="hero-highlights" aria-label="Visit highlights">
            <span>Lunch</span>
            <span>Dinner</span>
            <span>Vegan friendly</span>
          </div>
        </div>
      </section>

      <section className="contact-section page-section" aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Location, hours, and restaurant details</h2>
        </div>
        <div className="contact-grid">
          <article>
            <h3>Location</h3>
            <p>{contact.location}</p>
            <p className="muted">Serving guests in the city with full-service Vietnamese dining.</p>
          </article>
          <article>
            <h3>Hours</h3>
            <p>{contact.hours}</p>
            <p className="muted">Open daily for lunch and dinner.</p>
          </article>
          <article>
            <h3>Contact</h3>
            <p>{contact.email}</p>
            <p>{contact.phone}</p>
            <p className="muted">For menu questions, catering, or opening details.</p>
          </article>
        </div>
      </section>

      <section className="contact-location-panel" aria-label="Toronto location area">
        <div>
          <span>Toronto, Ontario</span>
          <p>Fresh rolls, Vietnamese comfort dishes, vegan options, and daily kitchen specials.</p>
        </div>
      </section>
    </main>
  );
}
