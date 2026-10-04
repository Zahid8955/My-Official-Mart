(() => {
  "use strict";

  const PRODUCTS = {
    tee: {
      id: "tee",
      name: "Oversized Drop Tee Vol.3",
      category: "T-Shirts",
      price: 799,
      oldPrice: 1199,
      discount: "33% OFF",
      image: "product 1.jpg",
      stock: true,
      sizes: ["S", "M", "L", "XL", "XXL"],
      description:
        "Heavyweight 240 GSM cotton with a boxy oversized cut. A clean everyday streetwear essential.",
      material: "100% Cotton - 240 GSM heavyweight",
      fit: "Oversized / Boxy cut",
    },
    hoodie: {
      id: "hoodie",
      name: "Street Hoodie - Olive",
      category: "Hoodies",
      price: 1499,
      oldPrice: 1999,
      discount: "25% OFF",
      image: "product 2.jpg",
      stock: true,
      sizes: ["S", "M", "L", "XL"],
      description:
        "A relaxed street hoodie built for layering, comfort and everyday city wear.",
      material: "80% Cotton, 20% Polyester",
      fit: "Relaxed fit",
    },
    cargo: {
      id: "cargo",
      name: "Utility Cargo - Beige",
      category: "Cargo Pants",
      price: 1799,
      oldPrice: 2499,
      discount: "28% OFF",
      image: "product 3.jpg",
      stock: true,
      sizes: ["28", "30", "32", "34", "36"],
      description:
        "Utility-inspired cargo pants with roomy pockets and a relaxed street silhouette.",
      material: "100% Cotton Twill",
      fit: "Relaxed fit",
    },
    cap: {
      id: "cap",
      name: "TC 6-Panel Cap - Black",
      category: "Caps",
      price: 499,
      oldPrice: 699,
      discount: "28% OFF",
      image: "product 4.jpg",
      stock: true,
      sizes: ["Free Size"],
      description:
        "Minimal 6-panel cap with an adjustable back closure for an easy everyday fit.",
      material: "Cotton twill",
      fit: "Adjustable",
    },
    tote: {
      id: "tote",
      name: "Monogram Tote Bag - Cream",
      category: "Accessories",
      price: 349,
      oldPrice: 499,
      discount: "30% OFF",
      image: "product 1.jpg",
      stock: true,
      sizes: ["One Size"],
      description:
        "Lightweight everyday tote designed to carry your daily essentials.",
      material: "Cotton canvas",
      fit: "One Size",
    },
    acidtee: {
      id: "acidtee",
      name: "Acid Wash Tee - White",
      category: "T-Shirts",
      price: 899,
      oldPrice: 1299,
      discount: "30% OFF",
      image: "product 2.jpg",
      stock: false,
      sizes: ["S", "M", "L", "XL"],
      description: "A washed oversized tee with a relaxed streetwear profile.",
      material: "100% Cotton",
      fit: "Oversized",
    },
    ziphoodie: {
      id: "ziphoodie",
      name: "Zip-Up Hoodie - Charcoal",
      category: "Hoodies",
      price: 1699,
      oldPrice: 2199,
      discount: "22% OFF",
      image: "product 3.jpg",
      stock: true,
      sizes: ["S", "M", "L", "XL"],
      description:
        "A clean charcoal zip hoodie made for easy layering and daily wear.",
      material: "Cotton blend",
      fit: "Relaxed fit",
    },
    streetcargo: {
      id: "streetcargo",
      name: "Street Cargo - Olive",
      category: "Cargo Pants",
      price: 1999,
      oldPrice: 2699,
      discount: "25% OFF",
      image: "product 4.jpg",
      stock: true,
      sizes: ["28", "30", "32", "34", "36"],
      description:
        "Street-ready cargo pants with a relaxed silhouette and utility details.",
      material: "Cotton twill",
      fit: "Relaxed fit",
    },
  };

  const STORAGE_KEY = "myOfficialMartCart";
  const THEME_KEY = "myOfficialMartTheme";

  const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function cartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function showToast(message) {
    let toast = document.querySelector(".site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "site-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(
      () => toast.classList.remove("show"),
      2300,
    );
  }

  function updateCartCount() {
    const count = cartCount();
    document.querySelectorAll("[data-cart-link]").forEach((link) => {
      link.innerHTML = `Cart <span class="cart-badge">${count}</span>`;
      link.setAttribute(
        "aria-label",
        `Cart with ${count} item${count === 1 ? "" : "s"}`,
      );
    });
  }

  function addToCart(productId, qty = 1, size = "") {
    const product = PRODUCTS[productId];
    if (!product || !product.stock) {
      showToast("Sorry, this product is currently out of stock.");
      return false;
    }
    qty = Math.max(1, Math.min(10, Number(qty) || 1));
    const cart = getCart();
    const existing = cart.find(
      (item) => item.id === productId && item.size === size,
    );
    if (existing) existing.qty = Math.min(10, existing.qty + qty);
    else
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size,
        qty,
      });
    saveCart(cart);
    showToast(`${product.name} added to cart.`);
    return true;
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }

  function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, Math.min(10, cart[index].qty + delta));
    saveCart(cart);
    renderCart();
  }

  function setupTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light") document.body.classList.add("light-mode");
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      const update = () => {
        const light = document.body.classList.contains("light-mode");
        button.textContent = light ? "☀ Light" : "🌙 Dark";
        button.title = light ? "Switch to dark mode" : "Switch to light mode";
        button.setAttribute("aria-label", button.title);
      };
      update();
      button.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        localStorage.setItem(
          THEME_KEY,
          document.body.classList.contains("light-mode") ? "light" : "dark",
        );
        update();
      });
    });
  }

  function productIdFromArticle(article) {
    const title =
      article.querySelector("h3")?.textContent.trim().toLowerCase() || "";
    const map = [
      ["oversized drop tee", "tee"],
      ["street hoodie", "hoodie"],
      ["utility cargo", "cargo"],
      ["6-panel cap", "cap"],
      ["monogram tote", "tote"],
      ["acid wash tee", "acidtee"],
      ["zip-up hoodie", "ziphoodie"],
      ["street cargo", "streetcargo"],
    ];
    return map.find(([key]) => title.includes(key))?.[1] || "tee";
  }

  function setupProductCards() {
    document
      .querySelectorAll(
        ".cards article, #products .grid article, .also-like-items article",
      )
      .forEach((article) => {
        const id = productIdFromArticle(article);
        article.dataset.productId = id;
        const product = PRODUCTS[id];

        const details = article.querySelector('a[href*="product.html"]');
        if (details) details.href = `product.html?id=${encodeURIComponent(id)}`;

        const button = article.querySelector("button");
        if (button && !button.disabled) {
          button.addEventListener("click", () =>
            addToCart(id, 1, product.sizes[0] || ""),
          );
        }
      });
  }

  function setupProductDetail() {
    const detail = document.querySelector("#product-detail");
    if (!detail) return;

    const params = new URLSearchParams(location.search);
    const id = params.get("id") || "tee";
    const product = PRODUCTS[id] || PRODUCTS.tee;

    const image = detail.querySelector("figure img");
    const title = detail.querySelector(".product-detail-left h2");
    const description = detail.querySelector(".product-detail-left p");
    const priceLine = detail.querySelector(
      ".product-detail-left p:nth-of-type(2)",
    );
    const size = detail.querySelector("#size-select");
    const quantity = detail.querySelector("#quantity");
    const buttons = detail.querySelectorAll(".product-detail-btns button");

    if (image) {
      image.src = product.image;
      image.alt = `${product.name} - product image`;
    }
    if (title) title.textContent = product.name;
    if (description)
      description.innerHTML = `${product.description} <strong>${product.category}</strong>.`;

    if (priceLine) {
      priceLine.innerHTML = `<strong>${money(product.price)}</strong> <s>${money(product.oldPrice)}</s> <mark>${product.discount}</mark>`;
    }

    if (size) {
      size.innerHTML =
        `<option value="">-- Choose Size --</option>` +
        product.sizes.map((s) => `<option value="${s}">${s}</option>`).join("");
    }

    const stockText = detail.querySelector(
      ".product-detail-left > ul li:last-child",
    );
    if (!product.stock) {
      buttons.forEach((b) => (b.disabled = true));
      buttons[0].textContent = "Sold Out";
      if (stockText) stockText.textContent = "✕ Currently out of stock";
    } else {
      buttons.forEach((b) => (b.disabled = false));
    }

    if (buttons[0]) {
      buttons[0].addEventListener("click", () => {
        const selectedSize = size?.value || "";
        if (product.sizes.length > 1 && !selectedSize) {
          showToast("Please select a size first.");
          size?.focus();
          return;
        }
        addToCart(
          product.id,
          quantity?.value || 1,
          selectedSize || product.sizes[0] || "",
        );
      });
    }

    if (buttons[1]) {
      buttons[1].addEventListener("click", () => {
        const selectedSize = size?.value || "";
        if (product.sizes.length > 1 && !selectedSize) {
          showToast("Please select a size first.");
          size?.focus();
          return;
        }
        if (
          addToCart(
            product.id,
            quantity?.value || 1,
            selectedSize || product.sizes[0] || "",
          )
        ) {
          location.href = "cart.html";
        }
      });
    }

    const sizeGuide = detail.querySelector('a[href="#size-chart"]');
    if (sizeGuide)
      sizeGuide.addEventListener("click", () => {
        setTimeout(
          () =>
            document
              .querySelector("#size-chart")
              ?.scrollIntoView({ behavior: "smooth" }),
          0,
        );
      });
  }

  function setupFilters() {
    const grid = document.querySelector("#products .grid");
    if (!grid) return;

    const articles = [...grid.querySelectorAll("article")];
    const apply = document.querySelector("#sidebar button:first-of-type");
    const clear = document.querySelector("#sidebar button:nth-of-type(2)");
    const sort = document.querySelector("#sort");
    const min = document.querySelector("#price-min");
    const max = document.querySelector("#price-max");
    const checks = [
      ...document.querySelectorAll('#sidebar input[type="checkbox"]'),
    ];

    const applyFilters = () => {
      const selected = checks.filter((c) => c.checked).map((c) => c.value);
      const minVal = Number(min?.value || 0);
      const maxVal = Number(max?.value || Infinity);

      articles.forEach((article) => {
        const id = article.dataset.productId || productIdFromArticle(article);
        const product = PRODUCTS[id];
        const categoryKey =
          product.category === "T-Shirts"
            ? "tshirts"
            : product.category === "Hoodies"
              ? "hoodies"
              : product.category === "Cargo Pants"
                ? "cargo"
                : product.category === "Caps"
                  ? "caps"
                  : "accessories";
        const categoryOk = !selected.length || selected.includes(categoryKey);
        const priceOk = product.price >= minVal && product.price <= maxVal;
        article.hidden = !(categoryOk && priceOk);
      });
      applySort();
      showToast("Filters applied.");
    };

    const applySort = () => {
      const mode = sort?.value || "popular";
      const visible = [...articles].filter((a) => !a.hidden);
      visible.sort((a, b) => {
        const pa = PRODUCTS[a.dataset.productId || productIdFromArticle(a)];
        const pb = PRODUCTS[b.dataset.productId || productIdFromArticle(b)];
        if (mode === "price-low") return pa.price - pb.price;
        if (mode === "price-high") return pb.price - pa.price;
        if (mode === "newest")
          return (
            Object.keys(PRODUCTS).indexOf(pb.id) -
            Object.keys(PRODUCTS).indexOf(pa.id)
          );
        return (
          Object.keys(PRODUCTS).indexOf(pa.id) -
          Object.keys(PRODUCTS).indexOf(pb.id)
        );
      });
      visible.forEach((a) => grid.appendChild(a));
    };

    apply?.addEventListener("click", applyFilters);
    clear?.addEventListener("click", () => {
      checks.forEach((c) => (c.checked = false));
      if (min) min.value = "";
      if (max) max.value = "";
      if (sort) sort.value = "popular";
      articles.forEach((a) => (a.hidden = false));
      applySort();
      showToast("Filters cleared.");
    });
    sort?.addEventListener("change", applySort);
  }

  function renderCart() {
    const container = document.querySelector("#cart-items");
    if (!container) return;

    const cart = getCart();
    const empty = document.querySelector("#empty-cart");
    const content = document.querySelector("#cart-content");

    if (!cart.length) {
      if (empty) empty.hidden = false;
      if (content) content.hidden = true;
      return;
    }

    if (empty) empty.hidden = true;
    if (content) content.hidden = false;

    container.innerHTML = cart
      .map(
        (item, index) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.category}</p>
          ${item.size ? `<p>Size: <strong>${item.size}</strong></p>` : ""}
          <p><strong>${money(item.price)}</strong> × ${item.qty}</p>
        </div>
        <div class="cart-actions">
          <div class="qty-control">
            <button type="button" data-action="minus" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button type="button" data-action="plus" data-index="${index}">+</button>
          </div>
          <button type="button" class="remove-item" data-action="remove" data-index="${index}">Remove</button>
        </div>
      </article>
    `,
      )
      .join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 499 ? 0 : 60;
    const total = subtotal + shipping;

    const subtotalEl = document.querySelector("#cart-subtotal");
    const shippingEl = document.querySelector("#cart-shipping");
    const totalEl = document.querySelector("#cart-total");
    if (subtotalEl) subtotalEl.textContent = money(subtotal);
    if (shippingEl)
      shippingEl.textContent = shipping ? money(shipping) : "FREE";
    if (totalEl) totalEl.textContent = money(total);

    container.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const action = button.dataset.action;
        if (action === "plus") changeQty(index, 1);
        if (action === "minus") changeQty(index, -1);
        if (action === "remove") {
          removeFromCart(index);
          showToast("Item removed from cart.");
        }
      });
    });
  }

  function setupCartPage() {
    if (!document.querySelector("#cart-items")) return;
    renderCart();

    document.querySelector("#clear-cart")?.addEventListener("click", () => {
      if (!getCart().length) return;
      localStorage.removeItem(STORAGE_KEY);
      updateCartCount();
      renderCart();
      showToast("Cart cleared.");
    });

    document.querySelector("#checkout-btn")?.addEventListener("click", () => {
      if (!getCart().length) {
        showToast("Your cart is empty.");
        return;
      }
      const orderId = "MOM" + Date.now().toString().slice(-8);
      localStorage.removeItem(STORAGE_KEY);
      updateCartCount();
      renderCart();
      showToast(`Order ${orderId} placed successfully!`);
    });
  }

  function setupForms() {
    document.querySelectorAll("form").forEach((form) => {
      if (form.dataset.bound) return;
      form.dataset.bound = "true";

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (form.closest("#get-early")) {
          const email = form.querySelector("input[type=email]")?.value || "";
          showToast(`Thanks! Drop alerts will be sent to ${email}.`);
          form.reset();
          return;
        }

        if (form.closest(".send-us-message")) {
          const name = form.querySelector("#fullname")?.value || "there";
          showToast(`Thanks ${name}! Your message has been received.`);
          form.reset();
          return;
        }
      });
    });
  }

  function setupStaticLinks() {
    document.querySelectorAll('a[href="#"]').forEach((link) => {
      const text = link.textContent.trim().toLowerCase();
      if (text.includes("privacy")) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showToast(
            "Privacy Policy: your demo form data stays in this browser.",
          );
        });
      } else if (text.includes("terms")) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showToast(
            "Terms: this is a front-end demo store; checkout is simulated.",
          );
        });
      } else if (text.includes("tracking")) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showToast(
            "Order tracking will be available after a real order system is connected.",
          );
        });
      }
    });
  }

  function init() {
    setupTheme();
    updateCartCount();
    setupProductCards();
    setupProductDetail();
    setupFilters();
    setupCartPage();
    setupForms();
    setupStaticLinks();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
