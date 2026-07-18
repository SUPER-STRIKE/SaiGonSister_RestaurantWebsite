"use client";

import { useMemo, useState } from "react";
import type { DailySpecial, MenuCategory, MenuItem, MenuTab } from "../lib/restaurant-data";

type MenuExplorerProps = {
  tabs: MenuTab[];
  items: MenuItem[];
  dailySpecials: DailySpecial[];
};

export function MenuExplorer({ tabs, items, dailySpecials }: MenuExplorerProps) {
  const [activeTab, setActiveTab] = useState<MenuCategory>("daily-specialty");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "signature" | "vegan" | "classic">("all");

  const activeTabDetails = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const visibleItems = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const isInCategory = item.category === activeTab;
      const matchesQuery =
        cleanQuery.length === 0 ||
        item.name.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery);
      const matchesFilter =
        filter === "all" ||
        (filter === "signature" && item.isSignature) ||
        (filter === "vegan" && item.diet === "vegan") ||
        (filter === "classic" && item.diet === "classic");

      return isInCategory && matchesQuery && matchesFilter;
    });
  }, [activeTab, filter, items, query]);

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
        <div className="menu-tools" aria-label="Menu sorting tools">
          <label className="menu-search">
            Search dishes
            <input
              aria-label="Search menu items"
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              value={query}
            />
          </label>
          <div className="menu-filter-group" aria-label="Menu filters">
            {[
              { id: "all", label: "All" },
              { id: "signature", label: "Signature" },
              { id: "vegan", label: "Vegan" },
              { id: "classic", label: "Classic" },
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
          <p className="menu-count">{visibleItems.length} dishes showing</p>
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
                {special.isVeganAvailable ? <em>Vegan option available</em> : null}
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
                  <div>
                    <div className="dish-title-line">
                      <h3>{item.name}</h3>
                      {item.isSignature ? <span>Signature</span> : null}
                      {item.diet === "vegan" ? <span>Vegan</span> : null}
                    </div>
                    <p>{item.description}</p>
                  </div>
                  <strong>{item.price}</strong>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-menu-state">
              <h3>No dishes found</h3>
              <p>Try another category or clear the search box.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
