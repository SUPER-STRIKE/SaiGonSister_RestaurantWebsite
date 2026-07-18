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
  tags?: string[];
  choices?: {
    label: string;
    options: string[];
  }[];
  addOns?: {
    name: string;
    price: string;
  }[];
  allergens?: string[];
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
      id: "simple-breakfast",
      category: "breakfast",
      name: "Simple Breakfast",
      description: "Three eggs, home fries, and butter garlic toasted baguette.",
      price: "$8.95",
      diet: "classic",
      choices: [
        {
          label: "Egg style",
          options: ["Over easy", "Sunny side up", "Poached"],
        },
      ],
      addOns: [
        { name: "Bacon", price: "$2" },
        { name: "Ham", price: "$2" },
        { name: "Peameal bacon", price: "$4" },
        { name: "Bratwurst sausage", price: "$4" },
        { name: "Philly cheese steak", price: "$5" },
        { name: "Chicken parmesan", price: "$5" },
      ],
      allergens: ["Egg", "Gluten", "Dairy"],
    },
    {
      id: "banh-mi-chao-sg",
      category: "breakfast",
      name: "Banh Mi Chao SG",
      description:
        "Philly cheese steak, pork meatball, pork sausage, ham, sunny eggs, fries, and toasted baguette served in a hot cast iron skillet.",
      price: "$19.95",
      diet: "classic",
      isSignature: true,
      tags: ["Hot skillet", "Big breakfast"],
      allergens: ["Egg", "Gluten", "Pork", "Dairy"],
    },
    {
      id: "bo-kho-breakfast",
      category: "breakfast",
      name: "Bo Kho Breakfast",
      description:
        "Beef in red wine butter sauce with home fries, sunny eggs, and toasted baguette served in a cast iron skillet.",
      price: "$14.95",
      diet: "classic",
      tags: ["Cast iron"],
      allergens: ["Egg", "Gluten", "Dairy"],
    },
    {
      id: "pho-soup-breakfast",
      category: "breakfast",
      name: "Pho Soup Breakfast",
      description:
        "Rare beef tenderloin cooked in hot broth with basil, onion, coriander, hoisin, hot sauce, fresh lime, and toasted baguette.",
      price: "$13.95",
      diet: "classic",
      allergens: ["Gluten"],
    },
    {
      id: "avocado-toast",
      category: "breakfast",
      name: "Avocado Toast",
      description:
        "Avocado, grilled portobello mushroom, tomato, onion, jalapeno, red onion, coriander, lime juice, and vegan creamy sauce.",
      price: "$11.95",
      diet: "vegan",
      addOns: [
        { name: "Poached egg", price: "$2" },
        { name: "Peameal bacon", price: "$4" },
        { name: "Smoked salmon", price: "$6" },
      ],
      allergens: ["Gluten", "Egg", "Dairy", "Fish"],
    },
    {
      id: "vegan-western-omelette",
      category: "breakfast",
      name: "Vegan Western Omelette",
      description:
        "Vegan egg, vegan ham, chickpea puree, onion, bell pepper, tomato, home fries, green salad, and toasted vegan butter baguette.",
      price: "$13.95",
      diet: "vegan",
      isSignature: true,
      allergens: ["Gluten"],
    },
    {
      id: "hot-plate-poutine",
      category: "breakfast",
      name: "Hot Plate Poutine",
      description:
        "Vegan sausage, turmeric tofu crumble, jalapeno, tomato, bell pepper, onion, home fries, and vegan creamy sauce.",
      price: "$12.95",
      diet: "vegan",
      addOns: [
        { name: "Bacon", price: "$2" },
        { name: "Sausage", price: "$3" },
        { name: "Ham", price: "$2" },
        { name: "Egg", price: "$1" },
      ],
      allergens: ["Soy", "Egg", "Pork"],
    },
    {
      id: "salad-roll-rice-paper",
      category: "lunch",
      name: "Salad Roll",
      description: "Rice paper rolls with lettuce, mint, basil, sprout, carrot, and mango.",
      price: "From $3.50",
      diet: "both",
      isSignature: true,
      tags: ["Roll focus"],
      choices: [
        {
          label: "Filling",
          options: [
            "Seared tuna and avocado",
            "Grilled beef",
            "Shrimp and pork belly",
            "Shrimp tempura and avocado",
            "Lemongrass tofu and avocado",
            "Vegan fried chicken and avocado",
            "Yam and avocado",
            "Jicama and peanut",
          ],
        },
      ],
      allergens: ["Peanut", "Seafood"],
    },
    {
      id: "momo",
      category: "lunch",
      name: "Momo",
      description: "Six dumplings served pan-fried or steamed.",
      price: "From $6.95",
      diet: "both",
      choices: [
        { label: "Cooking style", options: ["Pan-fried", "Steamed"] },
        { label: "Filling", options: ["Pork", "Beef, tomato, cheese", "Vegan chickpea and lentil"] },
      ],
      allergens: ["Gluten", "Dairy"],
    },
    {
      id: "salad-wraps",
      category: "lunch",
      name: "Salad Wraps",
      description:
        "Two rice paper wraps with lettuce, mint, basil, onion, mango, carrot, and vermicelli.",
      price: "From $10.95",
      diet: "both",
      isSignature: true,
      choices: [
        {
          label: "Filling",
          options: [
            "Five spice pork belly",
            "Beef on garlic bread",
            "Shrimp sausage",
            "Shrimp coco yam tempura",
            "Seared tuna avocado",
          ],
        },
      ],
      allergens: ["Seafood", "Gluten"],
    },
    {
      id: "crispy-fry",
      category: "lunch",
      name: "Crispy Fry",
      description: "Crispy sides and share plates from the fryer.",
      price: "From $3.50",
      diet: "both",
      isSignature: true,
      tags: ["Cha gio", "Crispy"],
      choices: [
        {
          label: "Pick",
          options: [
            "Wings with onion rings",
            "Pork spring roll",
            "Vegetable spring roll",
            "Shrimp, fish, calamari tempura",
            "Vegetable tempura",
            "Yam fries",
            "French fries",
          ],
        },
      ],
      allergens: ["Egg", "Seafood", "Gluten"],
    },
    {
      id: "classic-banh-mi",
      category: "lunch",
      name: "Banh Mi Baguette",
      description:
        "Tomato, cucumber, pickled daikon and carrot, onion, coriander, and garlic aioli on baguette.",
      price: "From $9.50",
      diet: "both",
      choices: [
        {
          label: "Filling",
          options: [
            "Caramel chicken",
            "Spicy lemongrass beef burger",
            "Five spice pork belly",
            "Grilled lemongrass pork",
            "Saigon banh mi",
            "Chicken parmesan",
            "Cheese steak",
            "Fillet O fish tomato sauce",
          ],
        },
      ],
      addOns: [{ name: "Extra meat", price: "$4" }],
      allergens: ["Gluten", "Egg", "Dairy"],
    },
    {
      id: "goi-xoai",
      category: "lunch",
      name: "Goi Xoai Mango Salad",
      description:
        "Green mango, lotus root, onion, carrot, pepper, basil, mint, coriander, peanut, and cracker.",
      price: "$15.95",
      diet: "both",
      addOns: [{ name: "Grilled chicken and shrimp", price: "$6" }],
      allergens: ["Peanut", "Seafood"],
    },
    {
      id: "pho",
      category: "lunch",
      name: "Pho",
      description: "Vietnamese noodle soup with herbs, lime, hoisin, and hot sauce.",
      price: "From $18.95",
      diet: "classic",
      choices: [
        {
          label: "Bowl",
          options: [
            "Special rib, rare beef, brisket, beef balls, tendon",
            "Rare beef tenderloin",
            "Brisket and beef",
            "Free range chicken",
            "Grilled chicken",
          ],
        },
      ],
      allergens: ["Gluten"],
    },
    {
      id: "bun-vermicelli",
      category: "lunch",
      name: "Bun Vermicelli Bowl",
      description:
        "Grilled chicken, beef, pork, shrimp, spring roll, lettuce, herbs, cucumber, pickled carrot, onion, and peanut.",
      price: "$19.95",
      diet: "classic",
      choices: [{ label: "Noodle style", options: ["Steamed vermicelli", "Stir-fry vermicelli"] }],
      allergens: ["Peanut", "Seafood"],
    },
    {
      id: "rice-roll-signature-menu",
      category: "dinner",
      name: "Signature Rice Roll",
      description: "House rice roll with Vietnamese herbs, soft rice, crisp vegetables, and chef sauce.",
      price: "$18",
      diet: "both",
      isSignature: true,
      tags: ["House creation"],
      allergens: ["Soy"],
    },
    {
      id: "house-noodle-bowl",
      category: "dinner",
      name: "House Special Noodle Bowl",
      description:
        "Shrimp, calamari, fish cake, BBQ pork, shrimp cracker, and broth on the side.",
      price: "$20.95",
      diet: "classic",
      choices: [{ label: "Noodle", options: ["Fresh egg noodle", "Clear noodle"] }],
      allergens: ["Egg", "Seafood", "Gluten"],
    },
    {
      id: "com-rice-platter",
      category: "dinner",
      name: "Com Rice Platter",
      description: "Rice platters with grilled proteins, salad, tomato fried rice, or ginger rice.",
      price: "From $19.95",
      diet: "classic",
      choices: [
        {
          label: "Plate",
          options: [
            "Char-grill spicy lemongrass pork chop, grilled chicken, beef, sunny egg, jasmine rice",
            "Crispy skin chicken thigh, grilled chicken, salad, tomato fried rice",
            "Hot stone bowl free range chicken with mushroom, bamboo, ginger rice, and slaw",
          ],
        },
      ],
      allergens: ["Egg"],
    },
    {
      id: "dinner-specials",
      category: "dinner",
      name: "Dinner Specials",
      description: "Chef dinner plates with bright herbs, crackers, and richer sauces.",
      price: "From $21.95",
      diet: "classic",
      choices: [
        {
          label: "Special",
          options: ["Goi bo tai chanh beef carpaccio", "Goi tuna salad", "Bo luc lac beef steak"],
        },
      ],
      allergens: ["Peanut", "Seafood"],
    },
    {
      id: "vegan-garden-roll",
      category: "vegan",
      name: "Vegan Garden Roll",
      description: "Rice paper, tofu, herbs, greens, pickles, vermicelli, and vegan peanut sauce.",
      price: "$13",
      diet: "vegan",
      isSignature: true,
      tags: ["Roll focus"],
      allergens: ["Peanut", "Soy"],
    },
    {
      id: "vegan-tofu-banh-mi",
      category: "vegan",
      name: "Vegan Tofu Banh Mi",
      description: "French baguette with tofu, cucumber, herbs, pickled vegetables, and vegan spread.",
      price: "$14",
      diet: "vegan",
      allergens: ["Gluten", "Soy"],
    },
    {
      id: "vegan-noodle-salad",
      category: "vegan",
      name: "Vegan Noodle Salad",
      description: "Vermicelli, herbs, greens, pickles, tofu, roasted peanuts, and bright dressing.",
      price: "$16",
      diet: "vegan",
      allergens: ["Peanut", "Soy"],
    },
    {
      id: "vietnamese-iced-coffee",
      category: "drinks",
      name: "Vietnamese Iced Coffee",
      description: "Bold slow-drip coffee served over ice.",
      price: "$6",
      diet: "classic",
      allergens: ["Dairy"],
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
    {
      id: "cocktails",
      category: "drinks",
      name: "Cocktails",
      description:
        "Aperitif, Aperol spritz, lychee concubine, mango bellini, mezcalita, mojito, margarita, and more.",
      price: "From $11",
      diet: "classic",
      choices: [
        {
          label: "Popular picks",
          options: ["Lychee Concubine", "Mango Bellini", "Spicy Mango Mezcalita", "Mojito"],
        },
      ],
    },
    {
      id: "wine-beer",
      category: "drinks",
      name: "Wine and Beer",
      description:
        "Red wine, white wine, and Asian beer selections including Saigon 33, Sapporo, Tiger, Singha, and Cass.",
      price: "Ask staff",
      diet: "vegan",
      choices: [
        { label: "Wine", options: ["Cabernet Sauvignon", "Merlot", "Pinot Noir", "Riesling"] },
        { label: "Beer", options: ["Saigon 33", "Sapporo", "Tiger", "Singha", "Cass"] },
      ],
    },
    {
      id: "smoothies-cold-drinks",
      category: "drinks",
      name: "Smoothies and Cold Drinks",
      description:
        "Seasonal fruit smoothies, Thai tea, matcha latte, lychee juice, salted lime soda, calamansi soda, and tropical colada.",
      price: "Ask staff",
      diet: "both",
      choices: [
        {
          label: "Smoothie",
          options: ["Mango", "Strawberry", "Avocado", "Pineapple", "Jackfruit"],
        },
      ],
      allergens: ["Dairy"],
    },
    {
      id: "tea-juice-pop",
      category: "drinks",
      name: "Tea, Juice, Pop",
      description:
        "Hot tea, apple juice, orange juice, grapefruit juice, iced tea, homemade soya, and bottled pop.",
      price: "From $2",
      diet: "vegan",
      choices: [
        { label: "Hot tea", options: ["Ginger honey jasmine green tea", "Black oolong tea"] },
        { label: "Pop", options: ["Coke", "Coke Zero", "Diet Coke", "Ginger Ale", "Root Beer"] },
      ],
      allergens: ["Soy"],
    },
  ],
  contact: {
    location: "Toronto, Ontario",
    hours: "Mon-Sun, 10:30 AM - 9:30 PM",
    email: "hello@allone.ca",
    phone: "Email for opening details",
  },
};
