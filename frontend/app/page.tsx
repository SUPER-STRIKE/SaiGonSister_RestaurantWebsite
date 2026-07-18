import { SiteNav } from "./components/SiteNav";
import { restaurantContent } from "./lib/restaurant-data";

export default function Home() {
  const { tagline, heroCopy, dailySpecials } = restaurantContent;
  const today = dailySpecials[0];

  return (
    <main>
      <section className="hero" id="home">
        <SiteNav />

        <div className="hero-content">
          <p className="eyebrow">{tagline}</p>
          <h1>Vietnamese rolls, daily specialties, and a full vegan menu.</h1>
          <p className="hero-copy">{heroCopy}</p>
          <div className="hero-highlights" aria-label="Restaurant highlights">
            <span>Fresh rolls daily</span>
            <span>Full vegan menu</span>
            <span>Toronto chef-owned</span>
          </div>
          <div className="hero-actions">
            <a className="button primary" href="#daily">Today&apos;s specialty</a>
            <a className="button secondary" href="/menu">Explore menu</a>
          </div>
        </div>

        <div className="hero-carousel moving-gallery" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="daily-feature" id="daily" aria-labelledby="daily-title">
        <div className="section-heading compact">
          <p className="eyebrow">One special dish each day</p>
          <h2 id="daily-title">Today&apos;s kitchen highlight</h2>
          <p>
            The daily specialty is meant to feel like the thing regulars ask about first:
            fresh, limited, and tied to what the kitchen wants to show off.
          </p>
        </div>
        <div className="daily-spotlight">
          <article>
            <span className="pill">{today.dayLabel}</span>
            <h3>{today.name}</h3>
            <p>{today.description}</p>
            <div className="price-line">
              <strong>{today.price}</strong>
              <span>{today.isVeganAvailable ? "Vegan option available" : "Chef special"}</span>
            </div>
          </article>
          <div className="decorative-photo" aria-hidden="true" />
        </div>
      </section>

      <section className="story-strip" aria-label="Restaurant highlights">
        <div className="story-card">
          <span>01</span>
          <strong>Roll-first menu</strong>
          <p>Goi cuon, cha gio, and the house rice roll are treated as the restaurant identity.</p>
        </div>
        <div className="story-card">
          <span>02</span>
          <strong>Vegan and classic</strong>
          <p>A full vegan menu sits beside the traditional Vietnamese dishes, not below them.</p>
        </div>
        <div className="story-card">
          <span>03</span>
          <strong>Organic Vietnamese</strong>
          <p>Fresh herbs, rice paper, crisp vegetables, and clean sauces keep the food bright.</p>
        </div>
      </section>

      <section className="chef-section" id="chef" aria-labelledby="chef-title">
        <div className="chef-image" aria-hidden="true">
          <div className="chef-frame">
            <span>15+ years</span>
            <strong>Vietnamese cuisine</strong>
          </div>
        </div>
        <div className="chef-copy">
          <p className="eyebrow">Chef owner</p>
          <h2 id="chef-title">A proven Toronto Vietnamese restaurant creator.</h2>
          <p>
            The chef-owner has built a successful series of Vietnamese restaurants in downtown
            Toronto, including Saigon Sister at 774 Yonge Street, Hue Kitchen, and the fast-food
            Ginger concept. The menu reflects deep experience with authentic Vietnamese cuisine
            and the confidence that comes from restaurants guests returned to for years.
          </p>
          <div className="proof-list">
            <span>Saigon Sister</span>
            <span>Hue Kitchen</span>
            <span>Ginger fast food</span>
          </div>
        </div>
      </section>
    </main>
  );
}
