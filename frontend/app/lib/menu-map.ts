import { mediaUrl, type ApiMenuItem } from "./api";
import type {
  DailySpecial,
  DishTag,
  MenuCategory,
  MenuDish,
  MenuSection,
  MenuTab,
} from "./restaurant-data";
import { restaurantContent } from "./restaurant-data";

const TAG_MAP: Record<string, DishTag> = {
  "must-try": "Signature",
  creation: "Chef's choice",
  vegan: "Vegan",
};

const REVERSE_TAG_MAP: Record<string, string> = {
  Signature: "must-try",
  "Chef's choice": "creation",
  Vegan: "vegan",
};

export const menuTabs: MenuTab[] = restaurantContent.menuTabs;

export function toUiCategory(category: ApiMenuItem["category"]): MenuCategory {
  return category === "drink" ? "drinks" : category;
}

export function toApiCategory(category: MenuCategory): ApiMenuItem["category"] {
  return category === "drinks" ? "drink" : category;
}

export function formatPrice(price: number) {
  const fixed = Number(price).toFixed(2);
  return `$${fixed.replace(/\.00$/, "")}`;
}

export function parsePriceInput(value: string) {
  const n = Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function toMenuDish(item: ApiMenuItem): MenuDish {
  const tags = item.tags.map((tag) => TAG_MAP[tag]).filter(Boolean) as DishTag[];
  return {
    id: String(item.id),
    name: item.name,
    description: item.description ?? "",
    price: formatPrice(item.price),
    tags,
    veganOptionAvailable: item.tags.includes("vegan"),
    options: item.choices.map((choice) => ({
      label: choice.name,
      options: choice.options ?? [],
    })),
    addOns: item.addOns.map((addOn) => ({
      name: addOn.name,
      price: formatPrice(addOn.price),
    })),
  };
}

export function toDailySpecial(item: ApiMenuItem): DailySpecial {
  return {
    ...toMenuDish(item),
    image: mediaUrl(item.imageUrl),
    dayLabel: "Today",
  };
}

export function groupMenuSections(items: ApiMenuItem[]): Record<MenuCategory, MenuSection[]> {
  const categories: MenuCategory[] = ["breakfast", "lunch", "dinner", "drinks"];
  const sections = {} as Record<MenuCategory, MenuSection[]>;

  for (const category of categories) {
    const dishes = items.filter((item) => toUiCategory(item.category) === category).map(toMenuDish);
    const tab = menuTabs.find((entry) => entry.id === category);
    sections[category] = dishes.length
      ? [
          {
            id: "all",
            title: tab?.label ?? category,
            note: tab?.note,
            dishes,
          },
        ]
      : [];
  }

  return sections;
}

export function tagsToApi(tags: string[], veganChecked: boolean) {
  const mapped = tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => REVERSE_TAG_MAP[tag] ?? tag.toLowerCase());
  if (veganChecked && !mapped.includes("vegan")) mapped.push("vegan");
  return [...new Set(mapped)];
}

export function parseCommaList(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
