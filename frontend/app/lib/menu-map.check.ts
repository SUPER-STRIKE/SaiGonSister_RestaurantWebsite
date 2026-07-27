import assert from "node:assert/strict";
import { formatPrice, toApiCategory, toMenuDish, toUiCategory } from "./menu-map";
import type { ApiMenuItem } from "./api";

const sample: ApiMenuItem = {
  id: 7,
  menuNumber: "1",
  name: "Test Dish",
  description: "Hello",
  price: 8.95,
  category: "drink",
  tags: ["must-try", "vegan"],
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
assert.deepEqual(dish.tags, ["Signature", "Vegan"]);
assert.equal(dish.veganOptionAvailable, true);
assert.equal(dish.options?.[0]?.label, "Egg style");
assert.equal(dish.addOns?.[0]?.price, "$2");

console.log("menu-map.check: ok");
