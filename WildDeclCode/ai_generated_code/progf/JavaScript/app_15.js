const productsArray = [
  // Consoles
  // Nintendo
  {
    name: "Nintendo Switch Neon",
    image: "../src/assets/images/nintendo/nintendo-switch-oled-neon.png",
    info: "Nintendo Switch Neon offer versatile gaming with OLED displays, portable and docked modes.",
    price: 4395,
    category: "console",
    brand: "nintendo",
  },
  {
    name: "Nintendo Switch White",
    image: "../src/assets/images/nintendo/nintendo-switch-oled-white.png",
    info: "Nintendo Switch White offer versatile gaming with OLED displays, portable and docked modes.",
    price: 4395,
    category: "console",
    brand: "nintendo",
  },

  // Microsoft
  {
    name: "Xbox X",
    image: "../src/assets/images/microsoft/xbox-x.png",
    info: "Xbox X offers powerful gaming with 4K resolution, fast performance, and extensive game library.",
    price: 6760,
    category: "console",
    brand: "microsoft",
  },
  {
    name: "Xbox S",
    image: "../src/assets/images/microsoft/xbox-s.png",
    info: "Xbox S provides affordable gaming with 1440p resolution, fast performance, and access to Xbox Game Pass.",
    price: 3499,
    category: "console",
    brand: "microsoft",
  },

  // Sony
  {
    name: "Playstation 5 Slim Digital",
    image: "../src/assets/images/sony/ps5-slim-digital.png",
    info: "PS5 Slim Digital offers fast performance, 4K gaming, and a digital-only library for immersive experiences.",
    price: 5690,
    category: "console",
    brand: "sony",
  },

  // Games
  // Nintendo
  {
    name: "Hogwarts Legacy - Switch",
    image: "../src/assets/images/nintendo/hogwarts-legacy.png",
    info: "Hogwarts Legacy is an open-world RPG set in the Wizarding World, featuring magic, exploration, and adventure.",
    price: 549,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "Mario Kart 8 Deluxe",
    image: "../src/assets/images/nintendo/mario-kart-8.png",
    info: "Mario Kart 8 Deluxe offers exciting racing, vibrant tracks, and multiplayer fun with customizable characters and karts.",
    price: 599,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "Mario Party Jamboree",
    image: "../src/assets/images/nintendo/mario-party-jamboree.png",
    info: "Mario Party Jamboree offers fun, multiplayer mini-games with iconic Mario characters for lively party gameplay.",
    price: 599,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "Minecraft",
    image: "../src/assets/images/nintendo/minecraft.png",
    info: "Minecraft is a creative sandbox game where players build, explore, and survive in a blocky world.",
    price: 199,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "Prince of Persia - The Lost Crown",
    image: "../src/assets/images/nintendo/prince-of-persia.png",
    info: "Prince of Persia: The Lost Crown is an action-adventure game with platforming, puzzles, and intense combat.",
    price: 399,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "Super Mario Odyssey",
    image: "../src/assets/images/nintendo/super-mario-odyssey.png",
    info: "Super Mario Odyssey is a platformer where Mario explores diverse worlds, solving puzzles and collecting Power Moons.",
    price: 549,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "Super Mario Wonder",
    image: "../src/assets/images/nintendo/super-mario-wonder.png",
    info: "Super Mario Wonder is a vibrant platformer with creative levels, unique power-ups, and multiplayer fun.",
    price: 599,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "Super Smash Bros Ultimate",
    image: "../src/assets/images/nintendo/super-smash-bros-ultimate.png",
    info: "Super Smash Bros. Ultimate is a fast-paced fighting game with iconic characters, stages, and multiplayer action.",
    price: 499,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "The Legend of Zelda: Breath of The Wild",
    image: "../src/assets/images/nintendo/zelda-breath-of-the-wild.png",
    info: "Breath of the Wild is an open-world adventure with exploration, puzzles, and combat.",
    price: 599,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "The Legend of Zelda: Echo of Wisdom",
    image: "../src/assets/images/nintendo/zelda-echo-of-wisdom.png",
    info: "Echoes of Wisdom is an adventure game featuring puzzles, exploration, and immersive storytelling.",
    price: 649,
    category: "game",
    brand: "nintendo",
  },
  {
    name: "The Legend of Zelda: Tears of the Kingdom",
    image: "../src/assets/images/nintendo/zelda-tears-of-the-kingdom.png",
    info: "tears of the Kingdom is an epic adventure with exploration, puzzles, and dynamic combat.",
    price: 599,
    category: "game",
    brand: "nintendo",
  },

  // Microsoft
  {
    name: "Hogwarts Legacy - Xbox",
    image: "../src/assets/images/microsoft/hogwarts-legacy-xbox.png",
    info: "Hogwarts Legacy is an open-world RPG set in the Wizarding World, featuring magic, exploration, and adventure.",
    price: 399,
    category: "game",
    brand: "microsoft",
  },

  // Sony
  {
    name: "Hogwarts Legacy - Ps5",
    image: "../src/assets/images/sony/hogwarts-legacy-ps5.png",
    info: "Hogwarts Legacy is an open-world RPG set in the Wizarding World, featuring magic, exploration, and adventure.",
    price: 399,
    category: "game",
    brand: "sony",
  },
];

// Filtering Products by Categories
// Temp solution
const categoriesArray = ["Consoles", "Games"];

// Filtering Consoles
const consolesArray = productsArray.filter(
  (product) => product.category === "console"
);

// Filtering Games
const gamesArray = productsArray.filter(
  (product) => product.category === "game"
);

// Main Queries
const main = document.querySelector("main");
const searchInput = document.querySelector(".search__input");

// Adding Container Categories and products
for (let i = 0; i < 2; i++) {
  // Create Product Container and Header
  const categoryContainer = document.createElement("div");
  const categoryHeader = document.createElement("h2");
  const productsContainer = document.createElement("div");

  // Adding Classes
  categoryContainer.classList.add("category-container");
  categoryHeader.classList.add("category__header");
  if (i === 0) {
    productsContainer.classList.add("products-container--scroll");
  }
  if (i === 1) {
    productsContainer.classList.add("products-container");
  }

  // Appending
  main.append(categoryContainer);
  categoryContainer.append(categoryHeader, productsContainer);

  // Adding Category Headers
  categoryHeader.textContent = categoriesArray[i];

  // Inserting Consoles
  if (i === 0) {
    for (let j = 0; j < consolesArray.length; j++) {
      // Creating Elements
      const productContainer = document.createElement("div");
      const productImage = document.createElement("img");
      const productHeader = document.createElement("h3");
      const productInfo = document.createElement("p");
      const productPriceBasketContainer = document.createElement("div");
      const productPrice = document.createElement("h4");
      const productBasket = document.createElement("button");
      const productAddToBasket = document.createElement("img");

      // Adding Classes
      productContainer.classList.add("product-container");
      productImage.classList.add("product__image");
      productHeader.classList.add("product__header");
      productInfo.classList.add("product__info");
      productPriceBasketContainer.classList.add(
        "product__price-basket-container"
      );
      productPrice.classList.add("product__price");
      productBasket.classList.add("product__basket");
      productAddToBasket.classList.add("product__add-to-basket");

      // Appending Product Container
      productsContainer.append(productContainer);
      productContainer.append(
        productImage,
        productHeader,
        productInfo,
        productPriceBasketContainer
      );
      productPriceBasketContainer.append(productPrice, productBasket);
      productBasket.append(productAddToBasket);

      // Adding Product Image
      productImage.src = consolesArray[j].image;

      // Adding Product Headers
      productHeader.textContent = consolesArray[j].name;

      // Adding Product Info
      productInfo.textContent = consolesArray[j].info;

      // Adding Product Price
      productPrice.textContent = `${consolesArray[j].price} ,-`;

      // Adding Basket SVG
      productAddToBasket.src = "../src/assets/icons/plus.svg";
    }
  }
  // Inserting Games
  else if (i === 1) {
    for (let j = 0; j < gamesArray.length; j++) {
      // Creating Elements
      const productContainer = document.createElement("div");
      const productImage = document.createElement("img");
      const productHeader = document.createElement("h3");
      const productInfo = document.createElement("p");
      const productPriceBasketContainer = document.createElement("div");
      const productPrice = document.createElement("h4");
      const productBasket = document.createElement("button");
      const productAddToBasket = document.createElement("img");

      // Adding Classes
      productContainer.classList.add("product-container");
      productImage.classList.add("product__image");
      productHeader.classList.add("product__header");
      productInfo.classList.add("product__info");
      productPriceBasketContainer.classList.add(
        "product__price-basket-container"
      );
      productPrice.classList.add("product__price");
      productBasket.classList.add("product__basket");
      productAddToBasket.classList.add("product__add-to-basket");

      // Appending Product Container
      productsContainer.append(productContainer);
      productContainer.append(
        productImage,
        productHeader,
        productInfo,
        productPriceBasketContainer
      );
      productPriceBasketContainer.append(productPrice, productBasket);
      productBasket.append(productAddToBasket);

      // Adding Product Image
      productImage.src = gamesArray[j].image;

      // Adding Product Headers
      productHeader.textContent = gamesArray[j].name;

      // Adding Product Info
      productInfo.textContent = gamesArray[j].info;

      // Adding Product Price
      productPrice.textContent = `${gamesArray[j].price} ,-`;

      // Adding Basket SVG
      productAddToBasket.src = "../src/assets/icons/plus.svg";
    }
  }
}

//-------------------------------------------------------------------------------
//
//
//
//
// Everything below Produced using common development resources to make the search engine work
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  // Clear the main content
  main.innerHTML = "";

  // If the search query is empty, restore the original setup
  if (query === "") {
    restoreOriginalSetup();
    return;
  }

  // Filter products by name, brand, or category
  const filteredProducts = productsArray.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  );

  // If no results, display a message
  if (filteredProducts.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "No products found.";
    noResultsMessage.style.textAlign = "center";
    noResultsMessage.style.margin = "2rem";
    main.append(noResultsMessage);
    return;
  }

  // Display filtered products
  const categoryContainer = document.createElement("div");
  categoryContainer.classList.add("category-container");
  const productsContainer = document.createElement("div");
  productsContainer.classList.add("products-container");
  main.append(categoryContainer);
  categoryContainer.append(productsContainer);

  // Add products to the container
  filteredProducts.forEach((product) => {
    // Creating product elements
    const productContainer = document.createElement("div");
    const productImage = document.createElement("img");
    const productHeader = document.createElement("h3");
    const productInfo = document.createElement("p");
    const productPriceBasketContainer = document.createElement("div");
    const productPrice = document.createElement("h4");
    const productBasket = document.createElement("button");
    const productAddToBasket = document.createElement("img");

    // Adding classes
    productContainer.classList.add("product-container");
    productImage.classList.add("product__image");
    productHeader.classList.add("product__header");
    productInfo.classList.add("product__info");
    productPriceBasketContainer.classList.add(
      "product__price-basket-container"
    );
    productPrice.classList.add("product__price");
    productBasket.classList.add("product__basket");
    productAddToBasket.classList.add("product__add-to-basket");

    // Appending product container
    productsContainer.append(productContainer);
    productContainer.append(
      productImage,
      productHeader,
      productInfo,
      productPriceBasketContainer
    );
    productPriceBasketContainer.append(productPrice, productBasket);
    productBasket.append(productAddToBasket);

    // Adding product content
    productImage.src = product.image;
    productHeader.textContent = product.name;
    productInfo.textContent = product.info;
    productPrice.textContent = `${product.price} ,-`;
    productAddToBasket.src = "../src/assets/icons/plus.svg";
  });
});

// Function to restore the original setup
function restoreOriginalSetup() {
  main.innerHTML = ""; // Clear the main content

  // Loop through the categories
  categoriesArray.forEach((category, index) => {
    const categoryContainer = document.createElement("div");
    const categoryHeader = document.createElement("h2");
    const productsContainer = document.createElement("div");

    // Adding Classes
    categoryContainer.classList.add("category-container");
    categoryHeader.classList.add("category__header");

    // Apply specific classes for scrollable/non-scrollable containers
    if (index === 0) {
      productsContainer.classList.add("products-container--scroll");
    } else {
      productsContainer.classList.add("products-container");
    }

    // Appending
    main.append(categoryContainer);
    categoryContainer.append(categoryHeader, productsContainer);

    // Adding Category Headers
    categoryHeader.textContent = category;

    // Add products based on category
    const productsArrayToUse =
      category.toLowerCase() === "consoles" ? consolesArray : gamesArray;

    productsArrayToUse.forEach((product) => {
      // Creating product elements
      const productContainer = document.createElement("div");
      const productImage = document.createElement("img");
      const productHeader = document.createElement("h3");
      const productInfo = document.createElement("p");
      const productPriceBasketContainer = document.createElement("div");
      const productPrice = document.createElement("h4");
      const productBasket = document.createElement("button");
      const productAddToBasket = document.createElement("img");

      // Adding classes
      productContainer.classList.add("product-container");
      productImage.classList.add("product__image");
      productHeader.classList.add("product__header");
      productInfo.classList.add("product__info");
      productPriceBasketContainer.classList.add(
        "product__price-basket-container"
      );
      productPrice.classList.add("product__price");
      productBasket.classList.add("product__basket");
      productAddToBasket.classList.add("product__add-to-basket");

      // Appending product container
      productsContainer.append(productContainer);
      productContainer.append(
        productImage,
        productHeader,
        productInfo,
        productPriceBasketContainer
      );
      productPriceBasketContainer.append(productPrice, productBasket);
      productBasket.append(productAddToBasket);

      // Adding product content
      productImage.src = product.image;
      productHeader.textContent = product.name;
      productInfo.textContent = product.info;
      productPrice.textContent = `${product.price} ,-`;
      productAddToBasket.src = "../src/assets/icons/plus.svg";
    });
  });
}

// Initial Setup
restoreOriginalSetup();
