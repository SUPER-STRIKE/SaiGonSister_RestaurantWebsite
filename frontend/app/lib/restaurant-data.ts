export type MenuCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "drinks"
  | "vegan"
  | "daily-specialty";

export type DailySpecial = {
  id: string;
  dayLabel: string;
  name: string;
  description: string;
  price: string;
  isVeganAvailable: boolean;
};

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: string;
  description: string;
  price: string;
  diet: "vegan" | "classic" | "both";
  isSignature?: boolean;
};

export type MenuTab = {
  id: MenuCategory;
  label: string;
  note: string;
};

export type RestaurantContent = {
  restaurantName: string;
  tagline: string;
  heroCopy: string;
  menuTabs: MenuTab[];
  dailySpecials: DailySpecial[];
  menuItems: MenuItem[];
  contact: {
    location: string;
    hours: string;
    email: string;
    phone: string;
  };
};

export const restaurantContent: RestaurantContent = {
  restaurantName: "All@One",
  tagline: "Organic Vietnamese dining",
  heroCopy:
    "A full-service Vietnamese restaurant built around fresh rolls, crispy cha gio, chef-created rice rolls, banh mi, and generous vegan choices.",
  menuTabs: [
    { id: "daily-specialty", label: "Daily Specialty", note: "One dish highlighted fresh each day." },
    { id: "breakfast", label: "Breakfast", note: "Light Vietnamese morning plates and coffee." },
    { id: "lunch", label: "Lunch", note: "Rolls, banh mi, rice plates, and noodle bowls." },
    { id: "dinner", label: "Dinner", note: "Full-service Vietnamese dishes for the evening." },
    { id: "vegan", label: "Vegan", note: "A complete plant-based menu, not an afterthought." },
    { id: "drinks", label: "Drinks", note: "Vietnamese coffee, teas, sodas, and fresh juice." },
  ],
  dailySpecials: [
    {
      id: "rice-roll-signature",
      dayLabel: "Today",
      name: "Rice Roll Signature",
      description:
        "A house creation inspired by sushi, rolled with Vietnamese herbs, pickled vegetables, soft rice, and chef sauce.",
      price: "$16",
      isVeganAvailable: true,
    },
    {
      id: "organic-vegan-goi-cuon",
      dayLabel: "Tomorrow",
      name: "Organic Vegan Goi Cuon",
      description:
        "Rice paper salad rolls with tofu, vermicelli, crisp greens, herbs, and roasted peanut dipping sauce.",
      price: "$14",
      isVeganAvailable: true,
    },
  ],
  menuItems: [
    {
      id: "morning-banh-mi",
      category: "breakfast",
      name: "Morning Banh Mi",
      description: "Warm baguette, egg, pickles, cucumber, herbs, and house chili mayo.",
      price: "$12",
      diet: "classic",
    },
    {
      id: "vegan-breakfast-roll",
      category: "breakfast",
      name: "Vegan Breakfast Roll",
      description: "Rice paper roll with tofu, herbs, greens, vermicelli, and ginger soy dip.",
      price: "$11",
      diet: "vegan",
      isSignature: true,
    },
    {
      id: "vietnamese-coffee-set",
      category: "breakfast",
      name: "Vietnamese Coffee Set",
      description: "Slow-drip coffee served hot or iced with a small pastry-style baguette bite.",
      price: "$9",
      diet: "classic",
    },
    {
      id: "salad-roll-rice-paper",
      category: "lunch",
      name: "Salad Roll",
      description: "Banh trang rice paper, herbs, vermicelli, lettuce, pickles, and peanut sauce.",
      price: "$13",
      diet: "both",
      isSignature: true,
    },
    {
      id: "crispy-cha-gio",
      category: "lunch",
      name: "Crispy Cha Gio",
      description: "Golden Vietnamese spring rolls with lettuce, herbs, pickles, and dipping sauce.",
      price: "$12",
      diet: "classic",
      isSignature: true,
    },
    {
      id: "classic-banh-mi",
      category: "lunch",
      name: "Classic Banh Mi",
      description: "Vietnamese baguette with herbs, pickled vegetables, cucumber, and chef protein.",
      price: "$14",
      diet: "classic",
    },
    {
      id: "rice-roll-signature-menu",
      category: "dinner",
      name: "Signature Rice Roll",
      description: "House rice roll with Vietnamese herbs, soft rice, crisp vegetables, and chef sauce.",
      price: "$18",
      diet: "both",
      isSignature: true,
    },
    {
      id: "lemongrass-rice-plate",
      category: "dinner",
      name: "Lemongrass Rice Plate",
      description: "Organic rice, herbs, pickles, cucumber, scallion oil, and lemongrass protein.",
      price: "$19",
      diet: "classic",
    },
    {
      id: "hue-inspired-noodle-bowl",
      category: "dinner",
      name: "Hue Inspired Noodle Bowl",
      description: "Aromatic broth, noodles, herbs, vegetables, and a clean slow-cooked finish.",
      price: "$18",
      diet: "both",
    },
    {
      id: "vegan-garden-roll",
      category: "vegan",
      name: "Vegan Garden Roll",
      description: "Rice paper, tofu, herbs, greens, pickles, vermicelli, and vegan peanut sauce.",
      price: "$13",
      diet: "vegan",
      isSignature: true,
    },
    {
      id: "vegan-tofu-banh-mi",
      category: "vegan",
      name: "Vegan Tofu Banh Mi",
      description: "French baguette with tofu, cucumber, herbs, pickled vegetables, and vegan spread.",
      price: "$14",
      diet: "vegan",
    },
    {
      id: "vegan-noodle-salad",
      category: "vegan",
      name: "Vegan Noodle Salad",
      description: "Vermicelli, herbs, greens, pickles, tofu, roasted peanuts, and bright dressing.",
      price: "$16",
      diet: "vegan",
    },
    {
      id: "vietnamese-iced-coffee",
      category: "drinks",
      name: "Vietnamese Iced Coffee",
      description: "Bold slow-drip coffee served over ice.",
      price: "$6",
      diet: "classic",
    },
    {
      id: "fresh-lime-soda",
      category: "drinks",
      name: "Fresh Lime Soda",
      description: "Lime, soda, cane sugar, and a clean bright finish.",
      price: "$6",
      diet: "vegan",
    },
    {
      id: "lotus-tea",
      category: "drinks",
      name: "Lotus Tea",
      description: "Fragrant tea served hot or iced.",
      price: "$5",
      diet: "vegan",
    },
  ],
  contact: {
    location: "Toronto, Ontario",
    hours: "Mon-Sun, 10:30 AM - 9:30 PM",
    email: "hello@allone.ca",
    phone: "Email for opening details",
  },
};
