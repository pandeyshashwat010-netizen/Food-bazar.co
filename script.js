const menuItems = [
  {
    id: "samosa-chaat",
    name: "Samosa Chaat",
    category: "starters",
    price: 129,
    description: "Crisp samosa, spiced chole, yogurt, chutneys, onion.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=78"
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    category: "starters",
    price: 249,
    description: "Charred cottage cheese, peppers, mint chutney.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=78"
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    category: "mains",
    price: 329,
    description: "Creamy tomato gravy, tender chicken, finished with butter.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=78"
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    category: "mains",
    price: 289,
    description: "Silky makhani gravy with soft paneer cubes.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=500&q=78"
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    category: "mains",
    price: 239,
    description: "Slow-cooked black lentils, cream, smoked spices.",
    image: "https://images.unsplash.com/photo-1628294896516-344152572ee8?auto=format&fit=crop&w=500&q=78"
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    category: "biryani",
    price: 349,
    description: "Aromatic basmati rice, chicken, saffron, raita.",
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=78"
  },
  {
    id: "veg-biryani",
    name: "Vegetable Biryani",
    category: "biryani",
    price: 279,
    description: "Seasonal vegetables, basmati rice, fried onion, raita.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=500&q=78"
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    category: "drinks",
    price: 119,
    description: "Thick yogurt drink with Alphonso mango.",
    image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=500&q=78"
  }
];

const state = {
  filter: "all",
  query: "",
  cart: JSON.parse(localStorage.getItem("foodBazarCart") || "{}")
};

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const menuGrid = document.querySelector("[data-menu-grid]");
const searchInput = document.querySelector("[data-search]");
const filters = document.querySelector("[data-filters]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const clearCart = document.querySelector("[data-clear-cart]");

const money = (value) => `Rs ${value.toLocaleString("en-IN")}`;

function saveCart() {
  localStorage.setItem("foodBazarCart", JSON.stringify(state.cart));
}

function renderMenu() {
  const query = state.query.trim().toLowerCase();
  const visible = menuItems.filter((item) => {
    const matchesFilter = state.filter === "all" || item.category === state.filter;
    const matchesQuery = !query || `${item.name} ${item.description}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });

  menuGrid.innerHTML = visible.length
    ? visible.map((item) => `
      <article class="menu-card">
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-card-body">
          <div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
          <div class="menu-card-footer">
            <span class="price">${money(item.price)}</span>
            <button class="add-btn" type="button" data-add="${item.id}">Add</button>
          </div>
        </div>
      </article>
    `).join("")
    : `<p class="empty-cart">No dishes found. Try another search or category.</p>`;
}

function renderCart() {
  const entries = Object.entries(state.cart).filter(([, qty]) => qty > 0);

  if (!entries.length) {
    cartItems.innerHTML = `<p class="empty-cart">Choose dishes from the menu to start an order.</p>`;
    cartTotal.textContent = money(0);
    return;
  }

  let total = 0;
  cartItems.innerHTML = entries.map(([id, qty]) => {
    const item = menuItems.find((dish) => dish.id === id);
    const lineTotal = item.price * qty;
    total += lineTotal;
    return `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <span>${qty} x ${money(item.price)} = ${money(lineTotal)}</span>
        </div>
        <div class="cart-row-actions">
          <button class="qty-btn" type="button" aria-label="Remove one ${item.name}" data-minus="${id}">-</button>
          <strong>${qty}</strong>
          <button class="qty-btn" type="button" aria-label="Add one ${item.name}" data-plus="${id}">+</button>
        </div>
      </div>
    `;
  }).join("");
  cartTotal.textContent = money(total);
}

function addItem(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  renderCart();
}

function removeItem(id) {
  state.cart[id] = Math.max((state.cart[id] || 0) - 1, 0);
  if (!state.cart[id]) {
    delete state.cart[id];
  }
  saveCart();
  renderCart();
}

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("active", item === button));
  renderMenu();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderMenu();
});

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addItem(button.dataset.add);
  }
});

cartItems.addEventListener("click", (event) => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  if (plus) addItem(plus.dataset.plus);
  if (minus) removeItem(minus.dataset.minus);
});

clearCart.addEventListener("click", () => {
  state.cart = {};
  saveCart();
  renderCart();
});

document.querySelector("[data-order-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("[data-order-message]");
  if (!Object.keys(state.cart).length) {
    message.textContent = "Please add at least one dish before placing an order.";
    return;
  }
  const data = new FormData(event.currentTarget);
  message.textContent = `Thank you, ${data.get("customer")}. Your ${data.get("type").toLowerCase()} order has been received.`;
  event.currentTarget.reset();
  state.cart = {};
  saveCart();
  renderCart();
});

document.querySelector("[data-reservation-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = document.querySelector("[data-reservation-message]");
  message.textContent = `Reservation confirmed for ${data.get("guests")} guests on ${data.get("date")} at ${data.get("time")}.`;
  event.currentTarget.reset();
});

document.querySelector("[data-contact-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("[data-contact-message]").textContent = "Thanks. Food Bazar will get back to you shortly.";
  event.currentTarget.reset();
});

renderMenu();
renderCart();