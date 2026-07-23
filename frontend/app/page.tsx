import { SiteNav } from "./components/SiteNav";
import { restaurantContent } from "./lib/restaurant-data";

export default function Home() {
  const { tagline, heroCopy, dailySpecials } = restaurantContent;

  return (
    <main>
      <section className="hero" id="home">
        <SiteNav />

        <div className="hero-content">
          <p className="eyebrow">{tagline}</p>
          <h1>Vietnamese rolls, daily specialties, and a full vegan menu.</h1>
          <p className="hero-copy">{heroCopy}</p>
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
          <p className="eyebrow">Fresh from the kitchen</p>
          <h2 id="daily-title">Today&apos;s kitchen highlight</h2>
          <p>Limited dishes prepared fresh for the day.</p>
        </div>
        <div className="daily-showcase">
          {dailySpecials.map((dish, index) => (
            <article className="daily-dish" key={dish.id} style={{ animationDelay: `${index * 120}ms` }}>
              <div className="daily-dish-image" style={{ backgroundImage: `url(${dish.image})` }} aria-hidden="true" />
              <div className="daily-dish-copy">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <div className="dish-tags" aria-label={`${dish.name} tags`}>
                  {dish.tags?.map((tag) => (
                    <span className={tag === "Signature" ? "tag-signature" : tag === "Vegan" ? "tag-vegan" : "tag-choice"} key={tag}>
                      {tag}
                    </span>
                  ))}
                  {dish.veganOptionAvailable ? <span className="tag-vegan">Vegan option available</span> : null}
                </div>
                {dish.allergens?.length ? (
                  <p className="allergen-note">Contains or may contain {dish.allergens.join(", ")}.</p>
                ) : null}
                <div className="price-line">
                  <strong>{dish.price}</strong>
                </div>
              </div>
            </article>
          ))}
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
        <div className="chef-copy">
          <p className="eyebrow">Chef owner</p>
          <h2 id="chef-title">Built on proven Vietnamese restaurant experience.</h2>
          <p>
            SaiGonSister is led by a chef-owner with a strong record of creating successful
            Vietnamese restaurants in downtown Toronto. That background brings discipline to the
            kitchen, confidence to the menu, and a clear understanding of the flavours guests
            return for.
          </p>
          <div className="proof-list">
            <span>Saigon Sister</span>
            <span>Hue Kitchen</span>
            <span>Ginger Fast Food</span>
          </div>
        </div>
        <div className="chef-proof-panel" aria-label="Toronto restaurant experience">
          <div className="chef-proof-image" aria-hidden="true" />
          <div>
            <strong>From Toronto kitchens</strong>
            <p>Built from years of Vietnamese cooking, steady service, and neighbourhood regulars.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
