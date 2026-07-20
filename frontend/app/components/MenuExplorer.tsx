"use client";

import { useMemo, useState } from "react";
import type { DailySpecial, MenuCategory, MenuItem, MenuTab } from "../lib/restaurant-data";

type MenuExplorerProps = {
  tabs: MenuTab[];
  items: MenuItem[];
  dailySpecials: DailySpecial[];
};

function cleanList(values?: string[]) {
  return values?.map((value) => value.trim()).filter(Boolean) ?? [];
}

function shouldShowPrice(price: string) {
  const compactPrice = price.replace(/[$,\s]/g, "");
  return compactPrice.length > 0 && Number(compactPrice) !== 0;
}

export function MenuExplorer({ tabs, items, dailySpecials }: MenuExplorerProps) {
  const [activeTab, setActiveTab] = useState<MenuCategory>("daily-specialty");
  const [filter, setFilter] = useState<"all" | "signature" | "vegan" | "classic" | "choices">(
    "all",
  );

  const activeTabDetails = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const isInCategory = item.category === activeTab;
      const matchesFilter =
        filter === "all" ||
        (filter === "signature" && item.isSignature) ||
        (filter === "vegan" && item.diet === "vegan") ||
        (filter === "classic" && item.diet === "classic") ||
        (filter === "choices" &&
          Boolean(
            item.choices?.some((choice) => cleanList(choice.options).length > 0) ||
              item.addOns?.some((addOn) => addOn.name.trim().length > 0),
          ));

      return isInCategory && matchesFilter;
    });
  }, [activeTab, filter, items]);

  const showMenuTools = activeTab !== "daily-specialty";

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

      {showMenuTools ? (
        <div className="menu-tools" aria-label="Menu filters">
          <div className="menu-filter-group" aria-label="Menu filters">
            {[
              { id: "all", label: "All" },
              { id: "signature", label: "Signature" },
              { id: "vegan", label: "Vegan" },
              { id: "classic", label: "Classic" },
              { id: "choices", label: "Chef's choices" },
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
          <p className="menu-count">{visibleItems.length} dishes</p>
        </div>
      ) : null}

      {activeTab === "daily-specialty" ? (
        <div className="daily-menu-list">
          {dailySpecials.map((special) => (
            <article className="dish-row featured" key={special.id}>
              <div>
                <span className="dish-kicker">{special.dayLabel}</span>
                <h3>{special.name}</h3>
                <p>{special.description}</p>
                {special.isVeganAvailable ? <em className="tag-vegan">Vegan option available</em> : null}
              </div>
              <strong>{special.price}</strong>
            </article>
          ))}
        </div>
      ) : (
        <>
          {visibleItems.length > 0 ? (
            <div className="dish-list">
              {visibleItems.map((item) => {
                const visibleChoices =
                  item.choices
                    ?.map((choice) => ({
                      label: choice.label.trim(),
                      options: cleanList(choice.options),
                    }))
                    .filter((choice) => choice.label.length > 0 && choice.options.length > 0) ?? [];
                const visibleAddOns =
                  item.addOns
                    ?.map((addOn) => ({
                      name: addOn.name.trim(),
                      price: addOn.price.trim(),
                    }))
                    .filter((addOn) => addOn.name.length > 0) ?? [];
                const visibleAllergens = cleanList(item.allergens);
                const hasChoices = visibleChoices.length > 0 || visibleAddOns.length > 0;

                return (
                  <article className="dish-row" key={item.id}>
                    <div className="dish-main">
                      <div className="dish-title-line">
                        <h3>{item.name}</h3>
                      </div>
                      <p>{item.description}</p>
                      <div className="dish-tags" aria-label={`${item.name} tags`}>
                        {item.isSignature ? <span className="tag-signature">Signature</span> : null}
                        {item.diet === "vegan" ? <span className="tag-vegan">Vegan</span> : null}
                        {hasChoices ? <span className="tag-choice">Chef&apos;s choices</span> : null}
                      </div>
                      {visibleChoices.map((choice) => (
                        <div className="dish-choice-menu" key={choice.label}>
                          <button aria-label={`Show ${choice.label} for ${item.name}`} type="button">
                            <span>+</span> {choice.label}
                          </button>
                          <div className="dish-choice-panel">
                            <div className="choice-panel-group">
                              <strong>{choice.label}</strong>
                              <div>
                                {choice.options.map((option) => (
                                  <span key={option}>{option}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {visibleAddOns.length ? (
                        <div className="dish-addon-menu">
                          <button aria-label={`Show add-ons for ${item.name}`} type="button">
                            <span>+</span> Add-ons
                          </button>
                          <div className="dish-addon-panel">
                            {visibleAddOns.map((addOn) => (
                              <span key={addOn.name}>
                                {addOn.name} {shouldShowPrice(addOn.price) ? <b>{addOn.price}</b> : null}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {visibleAllergens.length ? (
                        <p className="allergen-note">Contains or may contain {visibleAllergens.join(", ")}.</p>
                      ) : null}
                    </div>
                    <strong>{item.price}</strong>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-menu-state">
              <h3>No dishes found</h3>
              <p>Try another category or filter.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
