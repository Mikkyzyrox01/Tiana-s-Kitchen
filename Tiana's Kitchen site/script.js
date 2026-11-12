
const WHATSAPP_NUMBER = "2348060535811";


const meals = [
  {
    id: 1,
    name: "Jollof Rice",
    description: "Smoky Nigerian jollof rice cooked with rich spices.",
    price: 2500,
    category: "Rice & Meals",
    image: "jollof-rice.png",
    tag: "Customer favourite"
  },
  {
    id: 2,
    name: "Fried Rice",
    description: "Colourful fried rice with vegetables and savoury seasoning.",
    price: 2800,
    category: "Rice & Meals",
    image: "fried-rice.png",
    tag: "Popular"
  },
  {
    id: 3,
    name: "Grilled Chicken",
    description: "Juicy, well-seasoned chicken grilled to perfection.",
    price: 3500,
    category: "Proteins",
    image: "grilled-chicken.png",
    tag: "Chef's pick"
  },
  {
    id: 4,
    name: "Peppered Turkey",
    description: "Tender turkey tossed in a bold pepper sauce.",
    price: 4000,
    category: "Proteins",
    image: "peppered turkey.png",
    tag: "Chef's pick"
  },
  {
    id: 5,
    name: "Party Jollof Combo",
    description: "Smoky jollof rice served with chicken and plantain.",
    price: 7000,
    category: "Rice & Meals",
    image: "party-jollof-combo.png",
    tag: "Full meal"
  },
  {
    id: 6,
    name: "Fried Plantain",
    description: "Sweet, golden plantain with a delicious caramelised edge.",
    price: 1200,
    category: "Sides",
    image: "plantain.png",
    tag: ""
  },

  {
    id: 7,
    name: "Indomie and Egg",
    description: "Nice and tasty indomie, to brighten your mood, well sesoned .",
    price: 2000,
    category: "Rice & Meals",
    image: "indomie and egg2.jpg",
    tag: "Popular"
  },
  {
    id: 8,
    name: "Coca-cola",
    description: "A refreshing drink to complement your favourite meal.",
    price: 600,
    category: "Drinks",
    image: "coke.jpg",
    tag: ""
  },
    {
    id: 9,
    name: "Spaghetti-Bolognese",
    description: "Sweet spaghetti that suites your taste.",
    price: 1700,
    category: "Rice & Meals",
    image: "moi-moi.png",
    tag: "Full meal"
  },
     {
    id: 10,
    name: "Smoothie",
    description: "The smoothie that refreshes.",
    price: 1800,
    category: "Drinks",
    image: "smoothie.jpg",
    tag: "Favorite"
  },
  {
   id: 11,
    name: "Indomie and chicken",
    description: "Otherworldly taste of flavour.",
    price: 1800,
    category: "Rice & Meals",
    image: "indomie and egg2.jpg",
    tag: "Favorite"
  },
   {
   id: 12,
    name: "Moi-moi",
    description: "Your home-made moi-moi.",
    price: 400,
    category: "Proteins",
    image: "moi-moi.png",
    tag: "Favorite"
  },


{
    id: 13,
    name: "Small Chops",
    description: ".",
    price: 400,
    category: "Sides",
    image: "small chops.jpg",
    tag: "Favorite"
  },
  
  
  
];

// Elements
const mealGrid = document.getElementById("mealGrid");
const categoryList = document.getElementById("categoryList");
const menuSearch = document.getElementById("menuSearch");
const menuCounter = document.getElementById("menuCounter");
const emptyState = document.getElementById("emptyState");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItemsElement = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartSubtotal = document.getElementById("cartSubtotal");

const headerCartCount = document.getElementById("headerCartCount");
const mobileCartBar = document.getElementById("mobileCartBar");
const mobileCartCount = document.getElementById("mobileCartCount");
const mobileCartTotal = document.getElementById("mobileCartTotal");
const toast = document.getElementById("toast");

// State
let activeCategory = "All";
let searchTerm = "";
let cart = loadCart();
let toastTimeout;

// Format prices in Nigerian naira
function formatPrice(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

// Escape text before inserting dynamic values into HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

// Restore the cart from browser storage.
function loadCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem("tianasKitchenCart") || "{}"
    );

    if (!savedCart || typeof savedCart !== "object" || Array.isArray(savedCart)) {
      return {};
    }

    const cleanCart = {};

    meals.forEach(meal => {
      const quantity = savedCart[meal.id];

      if (
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= 99
      ) {
        cleanCart[meal.id] = quantity;
      }
    });

    return cleanCart;
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem("tianasKitchenCart", JSON.stringify(cart));
  } catch {
    // The cart still works for the current page session.
  }
}

// Display menu cards.
function renderMeals() {
  const filteredMeals = meals.filter(meal => {
    const matchesCategory =
      activeCategory === "All" ||
      meal.category === activeCategory;

    const searchContent =
      `${meal.name} ${meal.description} ${meal.category}`.toLowerCase();

    const matchesSearch = searchContent.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  menuCounter.textContent =
    `${String(filteredMeals.length).padStart(2, "0")} ITEMS`;

  emptyState.hidden = filteredMeals.length !== 0;
  mealGrid.hidden = filteredMeals.length === 0;

  mealGrid.innerHTML = filteredMeals.map(meal => `
    <article class="meal-card">
      <div class="meal-image-wrap">
        <img
          class="meal-image"
          src="${meal.image}"
          alt="${escapeHTML(meal.name)}"
          loading="lazy"
        >
        ${meal.tag
          ? `<span class="meal-tag">${escapeHTML(meal.tag)}</span>`
          : ""}
      </div>

      <div class="meal-content">
        <span class="meal-category">${escapeHTML(meal.category)}</span>
        <h3>${escapeHTML(meal.name)}</h3>
        <p class="meal-description">${escapeHTML(meal.description)}</p>

        <div class="meal-card-bottom">
          <span class="meal-price">${formatPrice(meal.price)}</span>
          <button
            class="add-button"
            data-add="${meal.id}"
            aria-label="Add ${escapeHTML(meal.name)} to your order"
            title="Add to order"
          >+</button>
        </div>
      </div>
    </article>
  `).join("");
}

// Menu category buttons.
categoryList.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  categoryList.querySelectorAll(".category-btn").forEach(categoryButton => {
    const isActive = categoryButton === button;

    categoryButton.classList.toggle("active", isActive);
    categoryButton.setAttribute("aria-pressed", String(isActive));
  });

  renderMeals();
});

// Menu search.
menuSearch.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderMeals();
});

// Reset filters.
document.getElementById("resetFilters").addEventListener("click", () => {
  activeCategory = "All";
  searchTerm = "";
  menuSearch.value = "";

  categoryList.querySelectorAll(".category-btn").forEach(button => {
    const isActive = button.dataset.category === "All";

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderMeals();
});

// Add items from the menu.
mealGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  addToCart(Number(button.dataset.add));
});

function addToCart(mealId) {
  const meal = meals.find(item => item.id === mealId);

  if (!meal) return;

  const currentQuantity = cart[mealId] || 0;

  if (currentQuantity >= 99) {
    showToast("You can add up to 99 of each item.");
    return;
  }

  cart[mealId] = currentQuantity + 1;

  saveCart();
  renderCart();
  showToast(`${meal.name} added to your order.`);
}

// Calculate cart details.
function getCartItems() {
  return meals
    .filter(meal => (cart[meal.id] || 0) > 0)
    .map(meal => ({
      ...meal,
      quantity: cart[meal.id]
    }));
}

function getCartCount() {
  return getCartItems().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

function getSubtotal() {
  return getCartItems().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

// Render cart items and totals.
function renderCart() {
  const items = getCartItems();
  const count = getCartCount();
  const subtotal = getSubtotal();

  headerCartCount.textContent = count;
  mobileCartCount.textContent = count;
  mobileCartTotal.textContent = formatPrice(subtotal);

  mobileCartBar.hidden = count === 0;

  cartEmpty.hidden = items.length > 0;
  cartItemsElement.hidden = items.length === 0;
  cartFooter.hidden = items.length === 0;

  cartSubtotal.textContent = formatPrice(subtotal);

  cartItemsElement.innerHTML = items.map(item => `
    <article class="cart-item">
      <img
        src="${item.image}"
        alt="${escapeHTML(item.name)}"
        loading="lazy"
      >

      <div>
        <h3>${escapeHTML(item.name)}</h3>
        <p class="cart-item-price">
          ${formatPrice(item.price)} each
        </p>

        <div class="cart-item-controls">
          <div class="quantity-control">
            <button
              data-decrease="${item.id}"
              aria-label="Decrease ${escapeHTML(item.name)} quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              data-increase="${item.id}"
              aria-label="Increase ${escapeHTML(item.name)} quantity"
            >+</button>
          </div>

          <button class="remove-item" data-remove="${item.id}">
            Remove
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// Handle cart quantity buttons and removal.
cartItemsElement.addEventListener("click", event => {
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const removeButton = event.target.closest("[data-remove]");

  if (increaseButton) {
    const id = Number(increaseButton.dataset.increase);

    if ((cart[id] || 0) < 99) {
      cart[id] = (cart[id] || 0) + 1;
    } else {
      showToast("You can add up to 99 of each item.");
    }
  }

  if (decreaseButton) {
    const id = Number(decreaseButton.dataset.decrease);

    if (cart[id] > 1) {
      cart[id] -= 1;
    } else {
      delete cart[id];
    }
  }

  if (removeButton) {
    delete cart[Number(removeButton.dataset.remove)];
  }

  saveCart();
  renderCart();
});

// Cart drawer controls.
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");

  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

document.getElementById("headerCart").addEventListener("click", openCart);
document.getElementById("viewCartButton").addEventListener("click", openCart);
mobileCartBar.addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("continueShopping").addEventListener("click", () => {
  closeCart();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeMobileMenu();
  }
});

// Clear the order.
document.getElementById("clearCart").addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
  showToast("Your order has been cleared.");
});

// WhatsApp checkout.
function createWhatsAppMessage() {
  const items = getCartItems();

  const lines = items.map(item =>
    `• ${item.name} x ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
  );

  return [
    "Hello Tiana's Kitchen! I'd like to place an order.",
    "",
    ...lines,
    "",
    `Subtotal: ${formatPrice(getSubtotal())}`,
    "",
    "Please confirm availability, delivery or pickup options, and any additional charges.",
    "Thank you!"
  ].join("\n");
}

function openWhatsApp(message) {
  // Replace the sample number before launching the live website.
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
  
    return;
  }

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (getCartItems().length === 0) {
    showToast("Add a meal to your order first.");
    return;
  }

  openWhatsApp(createWhatsAppMessage());
});

// WhatsApp contact link in the footer.
document.getElementById("footerWhatsApp").addEventListener("click", event => {
  event.preventDefault();

  openWhatsApp("Hello Tiana's Kitchen! I'd like to make an enquiry.");
});

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

function closeMobileMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

// Toast notification.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// Current year in the footer.
document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// Initialise the website.
renderMeals();
renderCart();
