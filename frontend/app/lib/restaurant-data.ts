export type MenuCategory = "breakfast" | "lunch" | "dinner" | "drinks";

export type DishTag = "Signature" | "Chef's choice" | "Vegan";

export type DishOption = {
  label: string;
  options: string[];
};

export type DishAddOn = {
  name: string;
  price: string;
};

export type MenuDish = {
  id: string;
  name: string;
  description: string;
  price: string;
  tags?: DishTag[];
  allergens?: string[];
  veganOptionAvailable?: boolean;
  options?: DishOption[];
  addOns?: DishAddOn[];
};

export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  dishes: MenuDish[];
};

export type MenuTab = {
  id: MenuCategory;
  label: string;
  note: string;
};

export type DailySpecial = MenuDish & {
  image: string;
  dayLabel: string;
};

export type HouseFocusLink = {
  label: string;
  category: MenuCategory;
  sectionId: string;
  image: string;
};

export type HouseFocus = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  links: HouseFocusLink[];
};

export type RestaurantContent = {
  restaurantName: string;
  tagline: string;
  heroCopy: string;
  menuTabs: MenuTab[];
  dailySpecials: DailySpecial[];
  houseFocus: HouseFocus;
  menuSections: Record<MenuCategory, MenuSection[]>;
  contact: {
    location: string;
    hours: string;
    email: string;
    phone: string;
  };
};

export const restaurantContent: RestaurantContent = {
  restaurantName: "SaiGonSister",
  tagline: "Organic Vietnamese dining",
  heroCopy:
    "A full-service Vietnamese kitchen serving breakfast, rolls, banh mi, pho, rice platters, dinner specials, drinks, and vegan-friendly choices.",
  menuTabs: [
    { id: "breakfast", label: "Breakfast", note: "Eggs, baguette plates, pho breakfast, and vegan morning dishes." },
    { id: "lunch", label: "Lunch", note: "Salad rolls, momo, wraps, crispy fry, banh mi, pho, rice, and noodles." },
    { id: "dinner", label: "Dinner", note: "Dinner specials, rice platters, carpaccio, tuna salad, and beef steak." },
    { id: "drinks", label: "Drinks", note: "Cocktails, wine, beer, smoothies, tea, juice, soya, and pop." },
  ],
  dailySpecials: [
    {
      id: "daily-rice-roll",
      dayLabel: "Today",
      image: "/roll-rice-rolls.png",
      name: "Rice Roll Signature",
      description:
        "House rice roll with Vietnamese herbs, pickled vegetables, soft rice, and chef sauce.",
      price: "$16",
      tags: ["Signature", "Chef's choice"],
      allergens: ["Soy"],
      veganOptionAvailable: true,
    },
    {
      id: "daily-goi-xoai",
      dayLabel: "Today",
      image: "/roll-salad-rolls.png",
      name: "Goi Xoai Mango Salad",
      description:
        "Green mango, lotus root, onion, carrot, pepper, basil, mint, coriander, peanut, and cracker.",
      price: "$15.95",
      tags: ["Chef's choice"],
      allergens: ["Peanut", "Seafood"],
      addOns: [{ name: "Grilled chicken and shrimp", price: "$6" }],
      veganOptionAvailable: false,
    },
  ],
  houseFocus: {
    eyebrow: "House focus",
    title: "Rolls stay at the center.",
    description:
      "Fresh rice paper, crisp herbs, crispy cha gio, chef sauces, vegan choices, and the house rice roll all shape the menu before anything else.",
    image: "/roll-cha-gio.png",
    links: [
      { label: "Salad Rolls", category: "lunch", sectionId: "salad-rolls", image: "/roll-salad-rolls.png" },
      { label: "Momo", category: "lunch", sectionId: "momo", image: "/vietnamese-rolls-hero.png" },
      { label: "Crispy Fry", category: "lunch", sectionId: "crispy-fry", image: "/roll-cha-gio.png" },
      { label: "Banh Mi", category: "lunch", sectionId: "banh-mi-baguettes", image: "/roll-rice-rolls.png" },
    ],
  },
  menuSections: {
    breakfast: [
      {
        id: "breakfast-plates",
        title: "Breakfast Plates",
        dishes: [
          {
            id: "simple-breakfast",
            name: "Simple Breakfast",
            description: "Three eggs of your style, home fries, and butter garlic toasted baguette.",
            price: "$8.95",
            options: [{ label: "Egg style", options: ["Over easy", "Sunny side up", "Poached"] }],
            addOns: [
              { name: "Bacon", price: "$2" },
              { name: "Peameal bacon", price: "$4" },
              { name: "Bratwurst sausage", price: "$4" },
              { name: "Ham", price: "$2" },
              { name: "Philly cheese steak", price: "$5" },
              { name: "Chicken parmesan", price: "$5" },
            ],
            allergens: ["Egg", "Gluten", "Dairy"],
          },
          {
            id: "banh-mi-chao-sg",
            name: "Banh Mi Chao SG - Big Breakfast",
            description:
              "Philly cheese steak, pork meatball, pork sausage, ham, sunny eggs, fries, and toasted baguette.",
            price: "$19.95",
            tags: ["Signature"],
            allergens: ["Egg", "Gluten", "Pork", "Dairy"],
          },
          {
            id: "bo-kho-beef-bourguignon",
            name: "Bo Kho - Beef Bourguignon",
            description: "Beef in red wine butter sauce, home fries, sunny eggs, and toasted baguette.",
            price: "$14.95",
            allergens: ["Egg", "Gluten", "Dairy"],
          },
          {
            id: "pho-soup-breakfast",
            name: "Pho Soup Breakfast",
            description:
              "Rare beef tenderloin cooked in hot broth with basil, onion, coriander, hoisin, hot sauce, fresh lime, and toasted baguette.",
            price: "$13.95",
            allergens: ["Gluten"],
          },
          {
            id: "avocado-toast",
            name: "Avocado Toast",
            description:
              "Avocado, grilled portobello mushroom, tomato, onion, jalapeno, red onion, coriander, lime juice, and vegan creamy sauce.",
            price: "$11.95",
            tags: ["Vegan"],
            veganOptionAvailable: true,
            addOns: [
              { name: "Poached egg", price: "$2" },
              { name: "Peameal bacon", price: "$4" },
              { name: "Smoked salmon", price: "$6" },
            ],
            allergens: ["Gluten"],
          },
          {
            id: "vegan-western-omelette",
            name: "Vegan Western Omelette",
            description:
              "Vegan egg, vegan ham, chickpea puree, onion, bell pepper, tomato, home fries, green salad, and toasted vegan butter baguette.",
            price: "$13.95",
            tags: ["Vegan"],
            veganOptionAvailable: true,
            allergens: ["Gluten"],
          },
          {
            id: "hot-plate-poutine",
            name: "Hot Plate Poutine",
            description:
              "Vegan sausage, turmeric tofu crumble, jalapeno, tomato, bell pepper, onion, home fries, and vegan creamy sauce.",
            price: "$12.95",
            tags: ["Vegan"],
            veganOptionAvailable: true,
            addOns: [
              { name: "Bacon", price: "$2" },
              { name: "Sausage", price: "$3" },
              { name: "Ham", price: "$2" },
              { name: "Egg", price: "$1" },
            ],
            allergens: ["Soy"],
          },
        ],
      },
    ],
    lunch: [
      {
        id: "salad-rolls",
        title: "Salad Rolls",
        note: "Lettuce, mint, basil, sprout, carrot, and mango.",
        dishes: [
          { id: "seared-tuna-avo", name: "Seared Tuna-Avo", description: "Rice paper salad roll.", price: "$5.95", allergens: ["Fish"] },
          { id: "grilled-beef-roll", name: "Grilled Beef", description: "Rice paper salad roll.", price: "$3.95" },
          { id: "shrimp-pork-belly-roll", name: "Shrimp & Pork Belly", description: "Rice paper salad roll.", price: "$4.50", allergens: ["Seafood", "Pork"] },
          { id: "shrimp-tempura-avo", name: "Shrimp Tempura-Avo", description: "Rice paper salad roll.", price: "$4.50", allergens: ["Seafood", "Gluten"] },
          { id: "lemongrass-tofu-avo", name: "Lemongrass Tofu-Avo", description: "Rice paper salad roll.", price: "$3.50", tags: ["Vegan"], veganOptionAvailable: true, allergens: ["Soy"] },
          { id: "vegan-fried-chicken-avo", name: "Vegan Fried Chicken-Avo", description: "Rice paper salad roll.", price: "$3.95", tags: ["Vegan"], veganOptionAvailable: true },
          { id: "yam-avocado", name: "Yam - Avocado", description: "Rice paper salad roll.", price: "$3.75", tags: ["Vegan"], veganOptionAvailable: true },
          { id: "jicama-peanut", name: "Jicama-Peanut", description: "Rice paper salad roll.", price: "$3.75", tags: ["Vegan"], veganOptionAvailable: true, allergens: ["Peanut"] },
        ],
      },
      {
        id: "momo",
        title: "Momo",
        note: "Six pieces, pan-fried or steamed.",
        dishes: [
          { id: "momo-pork", name: "Pork", description: "Choice of pan-fried or steamed momo.", price: "$6.95", options: [{ label: "Cooking style", options: ["Pan-fried", "Steamed"] }], allergens: ["Gluten", "Pork"] },
          { id: "momo-beef", name: "Beef, Tomato, Cheese", description: "Choice of pan-fried or steamed momo.", price: "$7.95", options: [{ label: "Cooking style", options: ["Pan-fried", "Steamed"] }], allergens: ["Gluten", "Dairy"] },
          { id: "momo-vegan", name: "Vegan Chickpea Lentil", description: "Choice of pan-fried or steamed momo.", price: "$6.95", tags: ["Vegan"], veganOptionAvailable: true, options: [{ label: "Cooking style", options: ["Pan-fried", "Steamed"] }], allergens: ["Gluten"] },
        ],
      },
      {
        id: "salad-wraps",
        title: "Salad Wraps",
        note: "Two rice paper wraps with lettuce, mint, basil, onion, mango, carrot, and vermicelli.",
        dishes: [
          { id: "five-spice-pork-wrap", name: "Five Spices Pork Belly", description: "Two salad wraps.", price: "$10.95", allergens: ["Pork"] },
          { id: "beef-garlic-bread-wrap", name: "Beef on Garlic Bread", description: "Two salad wraps.", price: "$10.95", allergens: ["Gluten"] },
          { id: "shrimp-sausage-wrap", name: "Shrimp Sausage", description: "Two salad wraps.", price: "$12.50", allergens: ["Seafood"] },
          { id: "shrimp-coco-yam-wrap", name: "Shrimp-Coco Yam Tempura", description: "Two salad wraps.", price: "$10.95", allergens: ["Seafood", "Gluten"] },
          { id: "seared-tuna-avocado-wrap", name: "Seared Tuna-Avocado", description: "Two salad wraps.", price: "$13.95", allergens: ["Fish"] },
        ],
      },
      {
        id: "crispy-fry",
        title: "Crispy Fry",
        dishes: [
          { id: "wings-onion-ring", name: "Wings, Onion Ring", description: "Six wings with spicy egg yolk-calamansi sauce.", price: "$15.95", allergens: ["Egg"] },
          { id: "pork-spring-roll", name: "Pork Spring Roll", description: "Crispy pork spring roll.", price: "$3.50", allergens: ["Pork", "Gluten"] },
          { id: "vegetable-spring-roll", name: "Vegetable Spring Roll", description: "Crispy vegetable spring roll.", price: "$3.50", tags: ["Vegan"], veganOptionAvailable: true, allergens: ["Gluten"] },
          { id: "seafood-tempura", name: "Shrimp, Fish, Calamari Tempura", description: "Crispy seafood tempura.", price: "$14.95", allergens: ["Seafood", "Gluten"] },
          { id: "vegetable-tempura", name: "Vegetable Tempura", description: "Crispy vegetable tempura.", price: "$8.50", tags: ["Vegan"], veganOptionAvailable: true, allergens: ["Gluten"] },
          { id: "yam-fries", name: "Yam Fries", description: "Crispy yam fries.", price: "$4.50", tags: ["Vegan"], veganOptionAvailable: true },
          { id: "french-fries", name: "French Fries", description: "Classic french fries.", price: "$3.50", tags: ["Vegan"], veganOptionAvailable: true },
        ],
      },
      {
        id: "banh-mi-baguettes",
        title: "Banh Mi - Baguettes",
        note: "Tomato, cucumber, pickled daikon-carrot, onion, coriander, and garlic aioli.",
        dishes: [
          { id: "caramel-chicken-banh-mi", name: "Caramel Chicken", description: "Vietnamese baguette.", price: "$9.95", allergens: ["Gluten"] },
          { id: "lemongrass-beef-burger-banh-mi", name: "Spicy Lemongrass Beef Burger", description: "Vietnamese baguette.", price: "$9.95", allergens: ["Gluten"] },
          { id: "five-spice-pork-banh-mi", name: "Five Spices Pork Belly", description: "Vietnamese baguette.", price: "$9.50", allergens: ["Gluten", "Pork"] },
          { id: "grilled-lemongrass-pork-banh-mi", name: "Grilled Lemongrass Pork", description: "Vietnamese baguette.", price: "$9.50", allergens: ["Gluten", "Pork"] },
          { id: "saigon-bm", name: "Saigon BM", description: "Pate, pork belly, ham, sausage, and shredded chicken.", price: "$9.95", tags: ["Signature"], allergens: ["Gluten", "Pork"] },
          { id: "chicken-parmesan-banh-mi", name: "Chicken Parmesan", description: "Vietnamese baguette.", price: "$11.95", allergens: ["Gluten", "Dairy"] },
          { id: "cheese-steak-banh-mi", name: "Cheese Steak", description: "Vietnamese baguette.", price: "$12.95", allergens: ["Gluten", "Dairy"] },
          { id: "fillet-o-fish-banh-mi", name: "Fillet O Fish Tomato Sauce", description: "Vietnamese baguette.", price: "$10.95", allergens: ["Gluten", "Fish"] },
        ],
      },
      {
        id: "pho-noodles-rice",
        title: "Pho, Noodles, Rice",
        dishes: [
          { id: "goi-xoai", name: "Goi Xoai - Mango Salad", description: "Green mango, lotus root, onion, carrot, pepper, basil, mint, coriander, peanut, and cracker.", price: "$15.95", addOns: [{ name: "Grilled chicken and shrimp", price: "$6" }], allergens: ["Peanut", "Seafood"] },
          { id: "pho-special", name: "Pho Special", description: "Rib, rare beef, brisket, beef balls, and tendon.", price: "$23.95" },
          { id: "pho-rare-beef", name: "Rare Beef Tenderloin Pho", description: "Rare beef tenderloin noodle soup.", price: "$22.95" },
          { id: "pho-brisket-beef", name: "Brisket and Beef Pho", description: "Brisket and beef noodle soup.", price: "$19.95" },
          { id: "pho-free-range-chicken", name: "Free Range Chicken Pho", description: "Free range chicken noodle soup.", price: "$19.95" },
          { id: "pho-grilled-chicken", name: "Grilled Chicken Pho", description: "Grilled chicken noodle soup.", price: "$18.95" },
          { id: "bun-vermicelli", name: "Bun - Vermicelli Bowl", description: "Grilled chicken, beef, pork, shrimp, spring roll, lettuce, basil, mint, cucumber, pickled carrot, onion, and peanut.", price: "$19.95", options: [{ label: "Vermicelli", options: ["Steamed", "Stir-fry"] }], allergens: ["Peanut", "Seafood"] },
          { id: "house-special-noodle-bowl", name: "House Special Noodle Bowl", description: "Shrimp, calamari, fish cake, BBQ pork, shrimp cracker, with broth on the side.", price: "$20.95", options: [{ label: "Noodle", options: ["Fresh egg noodle", "Clear noodle"] }], allergens: ["Seafood", "Egg"] },
        ],
      },
    ],
    dinner: [
      {
        id: "rice-platter",
        title: "Com - Rice Platter",
        dishes: [
          { id: "lemongrass-pork-rice", name: "Char-Grill Spicy Lemongrass Pork Chop", description: "With grilled chicken, beef, sunny egg, and steamed jasmine rice.", price: "$19.95", allergens: ["Egg", "Pork"] },
          { id: "crispy-skin-chicken-rice", name: "Crispy Skin Chicken Thigh", description: "With grilled chicken, salad, and tomato fried rice.", price: "$19.95" },
          { id: "hot-stone-chicken", name: "Hot Stone Bowl Free Range Chicken", description: "Served with mushroom, bamboo, ginger rice, and fresh slaw on the side.", price: "$21.95" },
        ],
      },
      {
        id: "dinner-specials",
        title: "Dinner Special",
        dishes: [
          { id: "goi-bo-tai-chanh", name: "Goi Bo Tai Chanh - Beef Carpaccio", description: "AAA rib eye rare steak slices, green papaya, onion, carrot, pepper, basil, peanut, and cracker.", price: "$21.95", tags: ["Chef's choice"], allergens: ["Peanut"] },
          { id: "goi-tuna", name: "Goi Tuna - Tuna Salad", description: "Seared tuna slices with variety of herbs, fried onion, peanut, pepper, and cracker.", price: "$23.95", allergens: ["Fish", "Peanut"] },
          { id: "bo-luc-lac", name: "Bo Luc Lac - Beef Steak", description: "AAA medium rare rib eye steak cubes, onion, bell pepper, mushroom in red wine butter sauce, fries, sunny egg, salad, and toasted baguette.", price: "$26.95", tags: ["Signature"], allergens: ["Egg", "Gluten", "Dairy"] },
        ],
      },
    ],
    drinks: [
      {
        id: "cocktails",
        title: "Cocktails",
        dishes: [
          { id: "aperitif", name: "Aperitif", description: "Bourbon, Aperol, Amaro Nonino, and lemon juice.", price: "$12" },
          { id: "aperol-spritz", name: "Aperol Spritz", description: "Prosecco, Aperol, and soda.", price: "$11" },
          { id: "lychee-concubine", name: "Lychee Concubine", description: "Soho lychee, sake, lychee juice, lychee pearls, and whole lychee fruit.", price: "$12" },
          { id: "mango-bellini", name: "Mango Bellini", description: "Prosecco, mango smoothie, grenadine, and raspberry.", price: "$11" },
          { id: "spicy-mango-mezcalita", name: "Spicy Mango Mezcalita", description: "Mezcal, Cointreau, mango smoothie, fresh lime, and chili salt rim.", price: "$12" },
          { id: "passion-memmo", name: "Passion Memmo", description: "Vodka, sparkling wine, passion juice, and lime.", price: "$12" },
          { id: "sg-cool-day", name: "SG Cool Day", description: "Vodka, blue curacao, prosecco, calamansi juice, and lychee pearls.", price: "$13" },
          { id: "hn-b52", name: "HN B-52", description: "Grand Marnier, Kahlua, Irish cream, coffee infused clove-cardamom, and condensed milk.", price: "$14" },
          { id: "white-night", name: "White Night", description: "Irish whiskey, coffee liquor, black spices infused brewed coffee, and sugar syrup.", price: "$11" },
          { id: "pina-colada", name: "Pina Colada", description: "White rum, cream of coco, pineapple juice, and sugar syrup blended with ice.", price: "$13" },
          { id: "margarita", name: "Margarita", description: "Blanco tequila, Cointreau, lime juice, and spicy salted lime rim.", price: "$14" },
          { id: "mojito", name: "Mojito", description: "White rum, sugar syrup, soda lime, and mint.", price: "$12" },
          { id: "cuba-libre", name: "Cuba Libre", description: "Dark rum, cola, and lime juice.", price: "$11" },
        ],
      },
      {
        id: "wine-beer",
        title: "Wine and Beer",
        dishes: [
          { id: "red-wine", name: "Red Wine", description: "Cabernet Sauvignon, Merlot, Pinot Noir, Shiraz, and Malbec.", price: "Ask staff" },
          { id: "white-wine", name: "White Wine", description: "Sauvignon Blanc, Pinot Grigio, Chardonnay, and Riesling.", price: "Ask staff" },
          { id: "beer", name: "Beers", description: "Saigon 33, Sapporo, Tiger, Singha, and Cass.", price: "Ask staff" },
        ],
      },
      {
        id: "non-alcohol",
        title: "Non Alcohol",
        dishes: [
          { id: "smoothy", name: "Smoothy", description: "Fresh fruit in season: mango, strawberry, avocado, pineapple, or jackfruit.", price: "Ask staff" },
          { id: "iced-cold-drinks", name: "Iced Cold Drinks", description: "Thai tea, matcha green latte, lychee juice, passion, salted lime soda, strawberry soda, calamansi soda, strawberry cream soda, or tropical colada.", price: "Ask staff", allergens: ["Dairy"] },
          { id: "hot-tea", name: "Hot Tea", description: "Ginger honey jasmine green tea or black oolong tea.", price: "$3" },
          { id: "juices", name: "Juices", description: "Apple, orange, grapefruit, or iced tea.", price: "$3" },
          { id: "homemade-soya", name: "Home Made Soya", description: "Hot or iced.", price: "$2", allergens: ["Soy"] },
          { id: "pop", name: "Pop", description: "Coke, Coke Zero, Diet Coke, Ginger Ale, or Root Beer.", price: "$2" },
        ],
      },
    ],
  },
  contact: {
    location: "Toronto, Ontario",
    hours: "Mon-Sun, 10:30 AM - 9:30 PM",
    email: "hello@saigonsister.ca",
    phone: "Email for opening details",
  },
};
