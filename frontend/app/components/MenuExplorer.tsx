"use client";

import { useMemo, useState } from "react";
import type { DailySpecial, MenuCategory, MenuItem, MenuTab } from "../lib/restaurant-data";

type MenuExplorerProps = {
  tabs: MenuTab[];
  items: MenuItem[];
  dailySpecials: DailySpecial[];
};

function getTagClassName(tag: string) {
  const normalized = tag.toLowerCase();

  if (normalized.includes("signature")) return "tag-signature";
  if (normalized.includes("vegan")) return "tag-vegan";
  if (normalized.includes("choice") || normalized.includes("add")) return "tag-choice";
  if (normalized.includes("allergen")) return "tag-allergen";
  if (normalized.includes("roll") || normalized.includes("cha gio") || normalized.includes("crispy")) {
    return "tag-roll";
  }

  return "tag-default";
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
        (filter === "choices" && Boolean(item.choices?.length || item.addOns?.length));

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
              { id: "choices", label: "Choices + add-ons" },
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
              {visibleItems.map((item) => (
                <article className="dish-row" key={item.id}>
                  <div className="dish-main">
                    <div className="dish-title-line">
                      <h3>{item.name}</h3>
                    </div>
                    <p>{item.description}</p>
                    <div className="dish-tags" aria-label={`${item.name} tags`}>
                      {item.isSignature ? <span className="tag-signature">Signature</span> : null}
                      {item.diet === "vegan" ? <span className="tag-vegan">Vegan</span> : null}
                      {item.choices?.length || item.addOns?.length ? (
                        <span className="tag-choice">Choices</span>
                      ) : null}
                      {item.tags?.map((tag) => (
                        <span className={getTagClassName(tag)} key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.choices?.length ? (
                      <div className="dish-options">
                        {item.choices.map((choice) => (
                          <div className="option-group" key={choice.label}>
                            <strong>{choice.label}</strong>
                            <div>
                              {choice.options.map((option) => (
                                <span key={option}>{option}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {item.addOns?.length ? (
                      <div className="dish-addons">
                        <strong>Add-ons</strong>
                        <div>
                          {item.addOns.map((addOn) => (
                            <span key={addOn.name}>
                              {addOn.name} <b>{addOn.price}</b>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {item.allergens?.length ? (
                      <p className="allergen-note">Contains or may contain {item.allergens.join(", ")}.</p>
                    ) : null}
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))}
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
