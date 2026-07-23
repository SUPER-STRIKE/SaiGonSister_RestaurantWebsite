import { HouseFocusShowcase } from "../components/HouseFocusShowcase";
import { MenuExplorer } from "../components/MenuExplorer";
import { SiteNav } from "../components/SiteNav";
import { restaurantContent } from "../lib/restaurant-data";

export default function MenuPage() {
  const { houseFocus, menuTabs, menuSections } = restaurantContent;

  return (
    <main>
      <section className="page-hero menu-hero">
        <SiteNav />
        <div className="page-hero-content">
          <p className="eyebrow">Breakfast, lunch, dinner, drinks</p>
          <h1>Vietnamese menu, organized for the table.</h1>
          <p>
            From morning pho and warm baguette plates to rice-paper rolls, banh mi, dinner
            specials, cocktails, tea, and wine.
          </p>
        </div>
      </section>

      <HouseFocusShowcase focus={houseFocus} />

      <section className="menu-section page-section" aria-labelledby="menu-title">
        <div className="section-heading">
          <p className="eyebrow">Choose a category</p>
          <h2 id="menu-title">Explore the menu</h2>
          <p>
            Browse by service, then scan each menu header the way guests read a printed menu.
          </p>
        </div>
        <MenuExplorer tabs={menuTabs} sections={menuSections} />
      </section>

    </main>
  );
}
