import { MenuExplorer } from "../components/MenuExplorer";
import { SiteNav } from "../components/SiteNav";
import { restaurantContent } from "../lib/restaurant-data";

export default function MenuPage() {
  const { dailySpecials, menuTabs, menuItems } = restaurantContent;

  return (
    <main>
      <section className="page-hero menu-hero">
        <SiteNav />
        <div className="page-hero-content">
          <p className="eyebrow">Breakfast, lunch, dinner, drinks</p>
          <h1>Menu built around rolls.</h1>
          <p>
            Fresh salad rolls, crispy cha gio, house rice rolls, banh mi, full vegan options,
            traditional Vietnamese plates, and drinks.
          </p>
          <div className="hero-highlights" aria-label="Menu highlights">
            <span>Goi cuon</span>
            <span>Cha gio</span>
            <span>Rice rolls</span>
            <span>Banh mi</span>
          </div>
        </div>
      </section>

      <section className="menu-focus" aria-label="All@One roll focus">
        <div className="menu-focus-photo" aria-hidden="true" />
        <div className="menu-focus-copy">
          <p className="eyebrow">House focus</p>
          <h2>Rolls stay at the center.</h2>
          <p>
            Fresh rice paper, crisp herbs, crispy cha gio, chef sauces, vegan choices, and the
            house rice roll all shape the menu before anything else.
          </p>
          <div className="roll-focus-grid" aria-label="Roll specialties">
            <span>Salad rolls</span>
            <span>Cha gio</span>
            <span>Rice rolls</span>
            <span>Vegan rolls</span>
          </div>
        </div>
      </section>

      <section className="menu-section page-section" aria-labelledby="menu-title">
        <div className="section-heading">
          <p className="eyebrow">Choose a category</p>
          <h2 id="menu-title">Explore the menu</h2>
          <p>
            Browse by service, diet, signature dishes, or plates with choices and add-ons.
            The menu can stay long without hiding the details guests need before ordering.
          </p>
        </div>
        <MenuExplorer tabs={menuTabs} items={menuItems} dailySpecials={dailySpecials} />
      </section>

    </main>
  );
}
