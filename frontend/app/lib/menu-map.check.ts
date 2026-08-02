import assert from "node:assert/strict";
import { formatPrice, groupMenuSections, toApiCategory, toMenuDish, toUiCategory } from "./menu-map";
import type { ApiMenuItem } from "./api";

const sample: ApiMenuItem = {
  id: 7,
  menuNumber: "1",
  name: "Test Dish",
  description: "Hello",
  price: 8.95,
  category: "drink",
  tags: ["vegan"],
  choices: [{ name: "Egg style", options: ["Poached"] }],
  addOns: [{ name: "Bacon", price: 2 }],
  imageUrl: "/uploads/x.jpg",
};

assert.equal(toUiCategory("drink"), "drinks");
assert.equal(toApiCategory("drinks"), "drink");
assert.equal(formatPrice(8.95), "$8.95");
assert.equal(formatPrice(10), "$10");

const dish = toMenuDish(sample);
assert.equal(dish.id, "7");
assert.deepEqual(dish.tags, ["Vegan"]);
assert.equal(dish.veganOptionAvailable, true);
assert.equal(dish.options?.[0]?.label, "Egg style");
assert.equal(dish.addOns?.[0]?.price, "$2");

const grouped = groupMenuSections([
  {
    id: 1,
    menuNumber: "11",
    name: "Seared Tuna-Avo",
    description: "Roll",
    price: 5.95,
    category: "lunch",
    sectionId: "salad-rolls",
    sectionTitle: "Salad Rolls",
    sectionNote: "Lettuce, mint, basil, sprout, carrot, and mango.",
    tags: [],
    choices: [],
    addOns: [],
    imageUrl: null,
  },
  {
    id: 2,
    menuNumber: "21",
    name: "Pork Momo",
    description: "Momo",
    price: 6.95,
    category: "lunch",
    sectionId: "momo",
    sectionTitle: "Momo",
    sectionNote: "Pan fry or steamed, 6 pieces.",
    tags: [],
    choices: [],
    addOns: [],
    imageUrl: null,
  },
]);

assert.equal(grouped.lunch.length, 2);
assert.equal(grouped.lunch[0].title, "Salad Rolls");
assert.equal(grouped.lunch[0].note, "Lettuce, mint, basil, sprout, carrot, and mango.");
assert.equal(grouped.lunch[1].title, "Momo");
assert.equal(grouped.lunch[0].dishes.length, 1);

console.log("menu-map.check: ok");
