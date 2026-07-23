"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuCategory, MenuDish, MenuSection, MenuTab } from "../lib/restaurant-data";

type MenuExplorerProps = {
  tabs: MenuTab[];
  sections: Record<MenuCategory, MenuSection[]>;
};

function cleanList(values?: string[]) {
  return values?.map((value) => value.trim()).filter(Boolean) ?? [];
}

function shouldShowPrice(price: string) {
  const compactPrice = price.replace(/[$,\s]/g, "");
  return compactPrice.length > 0 && Number(compactPrice) !== 0;
}

function formatAddOnPrice(price: string) {
  const trimmedPrice = price.trim();
  if (!shouldShowPrice(trimmedPrice)) return "";
  return trimmedPrice.startsWith("+") ? trimmedPrice : `+${trimmedPrice}`;
}

function isObviousAllergen(dishName: string, allergen: string) {
  const name = dishName.toLowerCase();
  const value = allergen.toLowerCase();
  const directMatches: Record<string, string[]> = {
    beef: ["beef"],
    chicken: ["chicken"],
    dairy: ["cheese", "parmesan", "butter"],
    egg: ["egg", "omelette"],
    fish: ["fish", "tuna"],
    gluten: ["baguette", "banh mi", "bread"],
    peanut: ["peanut"],
    pork: ["pork", "ham", "bacon", "sausage"],
    seafood: ["shrimp", "fish", "calamari", "calamary", "tuna"],
    soy: ["tofu", "soya"],
  };

  return directMatches[value]?.some((match) => name.includes(match)) ?? name.includes(value);
}

function visibleAllergens(dish: MenuDish) {
  return cleanList(dish.allergens).filter((allergen) => !isObviousAllergen(dish.name, allergen));
}

function dishHasDetails(dish: MenuDish) {
  return Boolean(
    dish.options?.some((option) => cleanList(option.options).length > 0) ||
      dish.addOns?.some((addOn) => addOn.name.trim().length > 0),
  );
}

function hasVisibleDetails(dish: MenuDish) {
  return Boolean(
    dish.options?.some((option) => option.label.trim() && cleanList(option.options).length > 0) ||
      dish.addOns?.some((addOn) => addOn.name.trim()),
  );
}

function DetailButtons({ dish }: { dish: MenuDish }) {
  const visibleOptions =
    dish.options
      ?.map((option) => ({
        label: option.label.trim(),
        options: cleanList(option.options),
      }))
      .filter((option) => option.label && option.options.length) ?? [];
  const visibleAddOns =
    dish.addOns
      ?.map((addOn) => ({ name: addOn.name.trim(), price: addOn.price.trim() }))
      .filter((addOn) => addOn.name) ?? [];

  return (
    <div className="menu-detail-actions">
      {visibleOptions.map((option) => (
        <div className="dish-choice-menu" key={option.label}>
          <button aria-label={`Show ${option.label} for ${dish.name}`} type="button">
            <span>+</span> {option.label}
          </button>
          <div className="dish-choice-panel">
            <div className="choice-panel-group">
              <strong>{option.label}</strong>
              <div>
                {option.options.map((choice) => (
                  <span key={choice}>{choice}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      {visibleAddOns.length ? (
        <div className="dish-addon-menu">
          <button aria-label={`Show add-ons for ${dish.name}`} type="button">
            <span>+</span> Add-ons
          </button>
          <div className="dish-addon-panel">
            {visibleAddOns.map((addOn) => (
              <span key={addOn.name}>
                {addOn.name} {shouldShowPrice(addOn.price) ? <b>{formatAddOnPrice(addOn.price)}</b> : null}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MenuExplorer({ tabs, sections }: MenuExplorerProps) {
  const [activeTab, setActiveTab] = useState<MenuCategory>("lunch");
  const [filter, setFilter] = useState<"all" | "signature" | "vegan" | "choice">("all");

  useEffect(() => {
    function openSectionFromHash() {
      const targetId = window.location.hash.replace("#", "");
      if (!targetId) return;

      const targetCategory = tabs.find((tab) => targetId.startsWith(`${tab.id}-`))?.id;
      if (!targetCategory) return;

      setActiveTab(targetCategory);
      window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }

    openSectionFromHash();
    window.addEventListener("hashchange", openSectionFromHash);

    return () => window.removeEventListener("hashchange", openSectionFromHash);
  }, [tabs]);

  const activeTabDetails = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const activeSections = useMemo(() => {
    return sections[activeTab]
      .map((section) => ({
        ...section,
        dishes: section.dishes.filter((dish) => {
          if (filter === "all") return true;
          if (filter === "signature") return cleanList(dish.tags).includes("Signature");
          if (filter === "vegan") return dish.veganOptionAvailable || cleanList(dish.tags).includes("Vegan");
          return dishHasDetails(dish) || cleanList(dish.tags).includes("Chef's choice");
        }),
      }))
      .filter((section) => section.dishes.length > 0);
  }, [activeTab, filter, sections]);

  const dishCount = activeSections.reduce((total, section) => total + section.dishes.length, 0);

  return (
    <div className="menu-explorer">
      <div className="service-tabs" role="tablist" aria-label="Menu categories">
        {tabs.map((tab) => (
          <button
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "active" : ""}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="menu-note">
        <span>{activeTabDetails.label}</span>
        <p>{activeTabDetails.note}</p>
      </div>

      <div className="menu-tools" aria-label="Menu filters">
        <div className="menu-filter-group" aria-label="Menu filters">
          {[
            { id: "all", label: "All" },
            { id: "signature", label: "Signature" },
            { id: "vegan", label: "Vegan" },
            { id: "choice", label: "Chef's choice" },
          ].map((option) => (
            <button
              className={filter === option.id ? "active" : ""}
              key={option.id}
              onClick={() => setFilter(option.id as typeof filter)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="menu-count">{dishCount} items</p>
      </div>

      {activeSections.length ? (
        <div className="menu-board">
          {activeSections.map((section) => (
            <section className="menu-board-section" id={`${activeTab}-${section.id}`} key={section.id}>
              <div className="menu-section-title">
                <h3>{section.title}</h3>
                {section.note ? <p>{section.note}</p> : null}
              </div>
              <div className="menu-lines">
                {section.dishes.map((dish) => {
                  const tags = cleanList(dish.tags).filter((tag) => tag === "Vegan");
                  const allergens = visibleAllergens(dish);
                  const showVeganTag = tags.length || dish.veganOptionAvailable;
                  const visibleDetails = hasVisibleDetails(dish);
                  return (
                    <article className="menu-line-item" key={dish.id}>
                      <div className="menu-line-main">
                        <div className="menu-line-heading">
                          <h4>{dish.name}</h4>
                          <span>{dish.price}</span>
                        </div>
                        <p>{dish.description}</p>
                        {visibleDetails ? (
                          <div className="menu-detail-slot">
                            <DetailButtons dish={dish} />
                          </div>
                        ) : null}
                        {allergens.length ? (
                          <p className="allergen-note">Contains or may contain {allergens.join(", ")}.</p>
                        ) : null}
                        {showVeganTag ? (
                          <div className={`dish-tags ${allergens.length ? "" : "no-allergy"}`} aria-label={`${dish.name} tags`}>
                            {tags.map((tag) => (
                              <span className="tag-vegan" key={tag}>
                                {tag}
                              </span>
                            ))}
                            {dish.veganOptionAvailable && !tags.includes("Vegan") ? (
                              <span className="tag-vegan">Vegan option available</span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-menu-state">
          <h3>No items found</h3>
          <p>Try another category or filter.</p>
        </div>
      )}
    </div>
  );
}
