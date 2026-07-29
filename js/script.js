async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Cannot load ${filePath}`);
        }
        const data = await response.text();
        document.getElementById(elementId).innerHTML = data;
    }
    catch (error) {
        console.error(error);
    }
}

let revealObserver;
function initScrollReveal() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".reveal, .reveal-scale").forEach(el => el.classList.add("in-view"));
        return;
    }
    if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    }
    document.querySelectorAll(".reveal:not(.in-view), .reveal-scale:not(.in-view)").forEach(el => {
        revealObserver.observe(el);
    });
}

let blockObserver;
function initBlockTransitions() {
    const blocks = document.querySelectorAll(".scroll-blocks .snap-section");
    if (!blocks.length) return;
    if (!("IntersectionObserver" in window)) {
        blocks.forEach(el => el.classList.add("block-active"));
        return;
    }
    if (!blockObserver) {
        blockObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle("block-active", entry.isIntersecting);
            });
        }, { threshold: 0.45 });
    }
    blocks.forEach(el => blockObserver.observe(el));
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

async function loadLayout() {
    loadTheme();
    await loadComponent("header", "components/header.html");
    await loadComponent("footer", "components/footer.html");
    initializeWebsite();
    updateCartCount();
    updateWishlistCount();
    updateStocks();
    displayWishlist()
    displayProducts();
    displayCart();
    setupFilters();
    displayProductDetails();
    initScrollReveal();
    initBlockTransitions();
}
loadLayout();

function initializeWebsite() {
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) {
        const icon = themeBtn.querySelector("i");
        if (document.body.classList.contains("dark-mode")) {
            icon.classList.remove("bi-moon-stars");
            icon.classList.add("bi-sun");
        }
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const dark = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", dark ? "dark" : "light");
            if (dark) {
                icon.classList.remove("bi-moon-stars");
                icon.classList.add("bi-sun");
            }
            else {
                icon.classList.remove("bi-sun");
                icon.classList.add("bi-moon-stars");
            }
        });
    }

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("search");
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let query = searchInput.value.trim();
            if (query !== "") {
                window.location.href = "search.html?query=" + encodeURIComponent(query);
            }
        });
    }

    startCountdown("2026-07-31 19:00:00");

    const cartBtn = document.getElementById("cartBtn");
    if (cartBtn) {
        cartBtn.addEventListener("click", () => {
            window.location.href = "cart.html";
        });
    }

const navbarCollapse = document.getElementById("navbar");
// Keep Products open
document.querySelector(".dropdown-toggle").addEventListener("click", function (e) {
    if (window.innerWidth <= 992) {
        e.stopPropagation();
    }
});
// Close when Home or Contact is clicked
document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
            const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            collapse.hide();
        }
    });
});
// Close when a dropdown item is clicked
document.querySelectorAll(".dropdown-menu a").forEach(item => {
    item.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
            const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            collapse.hide();
        }
    });
});
// Close when Theme button is clicked
const themBtn = document.getElementById("themeBtn");
if (themBtn) {
    themBtn.addEventListener("click", () => {
        if (window.innerWidth <= 992) {
            const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            collapse.hide();
        }
    });
}
}

function startCountdown(targetDate) {
    const countdown = document.getElementById("countdown");
    if (!countdown) return;

    if (!targetDate) {
        console.error("Countdown date is missing");
        return;
    }

    const endDate = new Date(targetDate.replace("T", " ")).getTime();

    if (isNaN(endDate)) {
        countdown.textContent = "Invalid date";
        console.error("Invalid countdown date:", targetDate);
        return;
    }

    const timer = setInterval(() => {
        const diff = endDate - Date.now();
        if (diff <= 0) {
            countdown.textContent = "DROP LIVE";
            clearInterval(timer);
            return;
        }
        const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
        countdown.textContent = `: ${h}H ${m}M ${s}S`;
    }, 1000);
}
startCountdown("2026-07-31 19:00:00");

let searchQuery = "";
let activeCategory = "all";
let activeSort = "default";
let activePrice = "all";
let detailProduct = null;
let detailQuantity = 1;
let selectedColor = null;
let selectedSize = null;

function updateStocks() {
    const cart = getCart();
    products.forEach(product => {
        product.stock = product.originalStock;
    });

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
}

let currentProducts = [];

function getPageProducts() {
    if (typeof pageType === "undefined") {
        return products;
    }
    if (pageType === "men") {
        return products.filter(product => product.gender === "men");
    }
    if (pageType === "women") {
        return products.filter(product => product.gender === "women"
        );
    }
    if (pageType === "sale") {
        return products.filter(product => product.status === "sale"
        );
    }
    if (pageType === "search") {
        const params = new URLSearchParams(window.location.search);
        const query = (params.get("query") || "").toLowerCase();

        return products.filter(product =>
            product.name.toLowerCase().includes(query) || product.brand.toLowerCase().includes(query) || product.gender.toLowerCase().includes(query)
        );
    }
    return products;
}

function displayProducts(items = getPageProducts()) {
    const container = document.getElementById("productContainer");
    if (!container) return;
    currentProducts = items;
    container.innerHTML = "";
    if (items.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
            <h2>Product Not Found</h2>
            <p> Try searching another sneaker </p>
            </div>
            `;
        return;
    }
    items.forEach(product => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 reveal">
            <div class="product-card"
            data-id="${product.id}">
            <div class="product-image">
            <img src="${product.image}"
            alt="${product.name}">
            <span class="product-badge ${product.status}">
            ${product.status === "new" ? "NEW ARRIVAL" : "SALE"}
            </span>
            <button class="wishlist" data-id="${product.id}" aria-label="Add ${product.name} to wishlist">
            <i class="bi ${getWishlist().some(item => item.id === product.id) ? "bi-heart-fill text-danger" : "bi-heart"}"></i>
            </button>
            </div>
            <div class="product-info">
            <p class="product-category">
            ${product.brand}
            </p>
            <h5>
            ${product.name}
            </h5>
            <p class="product-gender">
            ${product.gender.toUpperCase()}
            </p>
            <p class="product-stock
            ${product.stock <= 3 ? 'text-danger' : ''}">
            ${product.stock === 0 ? "Sold Out" : "Only " + product.stock + " left"
            }</p>
            <div class="rating">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star"></i>
            </div>
            <div class="product-price">
            <span>
            $${product.price}
            </span>
            ${product.status === "sale" ? `<del>$${product.oldPrice}</del>` : ""}
            </div>
            <button class="add-cart" data-id="${product.id}"
            ${product.stock === 0 ? "disabled" : ""}
            >
            <i class="bi ${
            product.stock === 0 ? "bi-x-circle" : "bi-bag-plus"
            }"></i>
            ${product.stock === 0 ? "Sold Out" : "Add To Cart"}
            </button>
            </div>
            </div>
            </div>
            `;
    });
    initScrollReveal();
}

const productContainer = document.getElementById("productContainer");
if (productContainer) {
    productContainer.addEventListener("click", function (e) {
        const wishlistBtn = e.target.closest(".wishlist");
        if (wishlistBtn) {
            e.stopPropagation();
            const id = Number(wishlistBtn.dataset.id);
            toggleWishlist(id, wishlistBtn);
            return;
        }

const cartBtn = e.target.closest(".add-cart");

if (cartBtn) {
    if (cartBtn.disabled) return;

    e.stopPropagation();

    const id = Number(cartBtn.dataset.id);

    addToCart(id);

    const originalHTML = cartBtn.innerHTML;

    cartBtn.classList.add("added");
    cartBtn.innerHTML = '<i class="bi bi-check2"></i> Added';

    setTimeout(() => {
        cartBtn.classList.remove("added");
        cartBtn.innerHTML = originalHTML;
    }, 1200);

    return;
}
        const card = e.target.closest(".product-card");
        if (card) {
            const id = Number(card.dataset.id);
            openProduct(id);
        }
    });
}

function openProduct(id) {
    window.location.href = "product.html?id=" + id;
}

function displayProductDetails() {
    const container = document.getElementById("productDetails");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    detailProduct = products.find(p => p.id === id);

    if (!detailProduct) {
        container.innerHTML = "<h2 class='text-center'>Product Not Found</h2>";
        return;
    }
    if (!selectedColor && detailProduct.colors.length) {
        selectedColor = detailProduct.colors[0].name;
    }
    if (!selectedSize && detailProduct.sizes.length) {
        selectedSize = detailProduct.sizes[0];
    }
    const activeColor = detailProduct.colors.find(c => c.name === selectedColor);

    const galleryImages = activeColor
        ? activeColor.images
        : [detailProduct.image];

    container.innerHTML = `
        <nav class="pd-breadcrumb reveal">
        <a href="index.html">Home</a>
        <i class="bi bi-chevron-right"></i>
        <a href="${detailProduct.gender}.html">${detailProduct.gender === "men" ? "Men" : "Women"}</a>
        <i class="bi bi-chevron-right"></i>
        <span>${detailProduct.name}</span>
        </nav>
        <div class="row align-items-start gy-5">
        <div class="col-md-6 reveal">
        <div class="product-gallery">
        <div class="main-image-wrap">
        <span class="product-badge pd-badge ${detailProduct.status}">${detailProduct.status === "new" ? "NEW ARRIVAL" : "SALE"}</span>
        <img id="mainProductImage" src="${galleryImages[0]}" class="img-fluid rounded main-image" onclick="openImageViewer(this.src)">
        <span class="zoom-hint">
        <i class="bi bi-zoom-in"></i>
        Click to zoom
        </span>
        </div>
        <div class="thumbnail-container">
        ${galleryImages.map((img, index) => `
            <img src="${img}" class="thumbnail ${index == 0 ? "active" : ""}" onclick="changeProductImage('${img}',this)">
        `).join("")}
        </div>
        </div>
        </div>
        <div class="col-md-6 reveal">
        <p class="pd-brand">${detailProduct.brand}</p>
        <h1 class="pd-title">${detailProduct.name}</h1>
        <div class="pd-rating">
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star"></i>
        <span>(128 reviews)</span>
        </div>
        <div class="pd-price">
        <span class="pd-price-current">$${detailProduct.price}</span>
        ${detailProduct.status === "sale" ? `<span class="pd-price-old">$${detailProduct.oldPrice}</span>` : ""}
        </div>
        <p class="pd-desc">${detailProduct.description}</p>
        <p class="pd-stock ${detailProduct.stock <= 3 ? "low" : ""}">
            <i class="bi ${detailProduct.stock === 0 ? "bi-x-circle" : "bi-check-circle-fill"}"></i>
            <span id="detailStock"> ${detailProduct.stock === 0 ? "Sold Out" : detailProduct.stock + " in stock"
        }
            </span>
        </p>
        <div class="pd-variant-group">
        <span class="pd-qty-label">
        Color
        <span id="selectedColorLabel">—${selectedColor}</span>
        </span>
        <div class="color-swatch-row">
        ${detailProduct.colors.map(c => `
        <div
        class="color-image ${selectedColor === c.name ? "active" : ""}"
        onclick="selectColor('${c.name}')">
        <img src="${c.thumbnail}">
        </div>
        `).join("")}
        </div>
        </div>
        ${detailProduct.sizes && detailProduct.sizes.length ? `
        <div class="pd-variant-group">
        <span class="pd-qty-label">
        Size
        <span class="pd-variant-selected" id="selectedSizeLabel">— US ${selectedSize}</span>
        </span>
        <div class="size-btn-row">${detailProduct.sizes.map((s, i) => `
        <button type="button" class="size-btn ${selectedSize === s ? "active" : ""}" onclick="selectSize(${s}, this)"> ${s}
        </button>
        `).join("")}
        </div>
        </div>
        ` : ""}
        <div class="pd-qty">
        <span class="pd-qty-label">Quantity</span>
        <div class="qty-stepper">
        <button class="qty-btn" onclick="decreaseDetailQuantity()">
        <i class="bi bi-dash"></i>
        </button>
        <span id="detailQuantity">${detailQuantity}</span>
        <button class="qty-btn" onclick="increaseDetailQuantity()">
        <i class="bi bi-plus"></i>
        </button>
        </div>
        </div>
        <div class="pd-actions">
        <button class="btn btn-warning pd-add-btn" onclick="addDetailToCart()"
        ${detailProduct.stock === 0 ? "disabled" : ""}
        >
        <i class="bi ${
        detailProduct.stock === 0 ? "bi-x-circle" : "bi-bag-plus"
        }"></i>
        ${detailProduct.stock === 0 ? "Sold Out" : "Add To Cart"}
        </button>
        <button class="pd-wishlist" data-id="${detailProduct.id}" onclick="toggleWishlist(${detailProduct.id}, this)" aria-label="Toggle wishlist for ${detailProduct.name}">
        <i class="bi ${getWishlist().some(item => item.id === detailProduct.id) ? "bi-heart-fill text-danger" : "bi-heart"
        }"></i>
        </button>
        </div>
        </div>
        </div>
        `;
    initScrollReveal();
}

function changeProductImage(image, element) {
    document.getElementById("mainProductImage").src = image;
    document.querySelectorAll(".thumbnail")
        .forEach(img => {
            img.classList.remove("active");
        });
    element.classList.add("active");
}

function increaseDetailQuantity() {
    updateStocks();
    if (detailQuantity < detailProduct.stock) {
        detailQuantity++;
        document.getElementById("detailQuantity").innerText = detailQuantity;
    }
}

function decreaseDetailQuantity() {
    if (detailQuantity > 1) {
        detailQuantity--;
        document.getElementById("detailQuantity").innerText = detailQuantity;
    }
}

function selectColor(colorName) {
    selectedColor = colorName;
    displayProductDetails();
}

function selectSize(size, element) {
    selectedSize = size;
    document.querySelectorAll(".size-btn").forEach(el => el.classList.remove("active"));
    element.classList.add("active");
    const label = document.getElementById("selectedSizeLabel");
    if (label) label.innerText = `— US ${size}`;
}

function addDetailToCart() {
    if (!detailProduct) {
        return;
    }
    if (detailProduct.colors && detailProduct.colors.length && !selectedColor) {
        showToast("Please select a color");
        return;
    }
    if (detailProduct.sizes && detailProduct.sizes.length && !selectedSize) {
        showToast("Please select a size");
        return;
    }
    let cart = getCart();
    if (detailQuantity > detailProduct.stock) {
        showToast("Not enough stock");
        return;
    }
    const cartKey = `${detailProduct.id}::${selectedColor || ""}::${selectedSize || ""}`;
    let existing = cart.find(item => item.cartKey === cartKey);
    if (existing) {
        existing.quantity += detailQuantity;
    }
    else {
        cart.push({ ...detailProduct, color: selectedColor || "", size: selectedSize || "", cartKey, quantity: detailQuantity });
    }
    saveCart(cart);
    updateStocks();
    updateCartCount();
    displayProducts(getPageProducts());
    detailQuantity = 1;
    displayProductDetails();
    showToast(detailProduct.name + " added to cart");
}

function applySearchAndFilters(data) {
    let filtered = data.filter(product => {
        let searchMatch = product.name.toLowerCase().includes(searchQuery) || product.brand.toLowerCase().includes(searchQuery) || product.gender.toLowerCase().includes(searchQuery) || product.status.toLowerCase().includes(searchQuery);

        let categoryMatch = true;
        if (activeCategory === "new") {
            categoryMatch = product.status === "new";
        }
        if (activeCategory === "sale") {
            categoryMatch = product.status === "sale";
        }
        if (activeCategory === "men") {
            categoryMatch = product.gender === "men";
        }
        if (activeCategory === "women") {
            categoryMatch = product.gender === "women";
        }
        return searchMatch && categoryMatch;
    });

    if (activeSort === "100") {
        filtered = filtered.filter(product => product.price <= 100);
    }
    else if (activeSort === "150") {
        filtered = filtered.filter(product => product.price <= 150);
    }
    else if (activeSort === "200") {
        filtered = filtered.filter(product => product.price <= 200);
    }

    else if (activeSort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }
    else if (activeSort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }
    displayProducts(filtered);
}

function setupFilters() {
    const category = document.getElementById("categoryFilter");
    const sort = document.getElementById("sortFilter");
    if (category) {
        category.addEventListener("change", () => {
            activeCategory = category.value;
            applySearchAndFilters(getPageProducts());
        });
    }
    const price = document.getElementById("sortFilter");
    if (price) {
        price.addEventListener("change", () => {
            let value = price.value;
            activeSort = value;
            applySearchAndFilters(getPageProducts());
        });
    }
}

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        return Array.isArray(cart) ? cart : [];
    }
    catch (error) {
        console.error("Invalid cart data:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, color, size) {
    let cart = getCart();
    let product = products.find(item => item.id === id);
    if (!product) return;
    if (product.stock <= 0) {
        showToast("Product is sold out");
        return;
    }
    const chosenColor = color || (product.colors && product.colors[0] ? product.colors[0].name : "");
    const chosenSize = size || (product.sizes && product.sizes[0] ? product.sizes[0] : "");
    const cartKey = `${id}::${chosenColor}::${chosenSize}`;
    let existing = cart.find(item => item.cartKey === cartKey);
    if (existing) {
        existing.quantity++;
    }
    else {
        cart.push({ ...product, color: chosenColor, size: chosenSize, cartKey, quantity: 1 });
    }
    saveCart(cart);
    updateStocks();
    displayWishlist();
    updateCartCount();
    displayProducts(getPageProducts());
    displayProducts(getPageProducts());
    showToast(product.name + " added to cart");
}

function removeFromCart(cartKey) {
    let cart = getCart();
    cart = cart.filter(item => item.cartKey !== cartKey);
    saveCart(cart);
    updateStocks();
    displayProducts();
    displayWishlist();
    displayProducts(getPageProducts());
    displayCart();
    updateCartCount();
    showToast("Product removed from cart");
}

function increaseQuantity(cartKey) {
    let cart = getCart();
    let item = cart.find(product => product.cartKey === cartKey);
    let original = item ? products.find(product => product.id === item.id) : null;
    if (item && original) {
        updateStocks();
        if (original.stock > 0) {
            item.quantity++;
        }
        else {
            showToast("No more stock available");
        }
    }
    saveCart(cart);
    updateStocks();
    displayWishlist()
    displayProducts(getPageProducts());
    displayCart();
    updateCartCount();
}

function decreaseQuantity(cartKey) {
    let cart = getCart();
    let product = cart.find(item => item.cartKey === cartKey);
    if (product) {
        product.quantity--;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.cartKey !== cartKey);
        }
    }
    saveCart(cart);
    updateStocks();
    displayProducts();
    displayWishlist()
    displayCart();
    updateCartCount();
    displayProducts(getPageProducts());
}

function clearCart() {
    localStorage.removeItem("cart");
    updateStocks();
    displayProducts();
    displayWishlist()
    displayCart();
    updateCartCount();
    showToast("Cart cleared successfully");
}

function updateCartCount() {
    const cart = getCart();
    let totalQuantity = 0;
    cart.forEach(product => {
        totalQuantity += product.quantity;
    });
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.innerText = totalQuantity;
    }
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = document.getElementById("wishlistCount");
    if (count) {
        count.innerText = wishlist.length;
    }
}

function displayWishlist() {
    const container = document.getElementById("wishlistContainer");
    if (!container) return;

    let wishlist = getWishlist();
    container.innerHTML = "";
    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
            <h2>Wishlist is empty</h2>
            <a href="index.html" class="btn btn-warning">
            Continue Shopping
            </a>
            </div>
            `;
        return;
    }
    wishlist.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 reveal">
            <div class="product-card" data-id="${product.id}">
            <div class="product-image">
            <a href="product.html?id=${product.id}">
            <img src="${product.image}" alt="${product.name}">
            </a>
            <button class="wishlist" onclick="removeWishlist(${product.id})" aria-label="Remove ${product.name} from wishlist">
            <i class="bi bi-heart-fill text-danger"></i>
            </button>
            </div>
            <div class="product-info">
            <p class="product-category">
            ${product.brand}
            </p>
            <h5>
            ${product.name}
            </h5>
            <p class="product-gender">
            ${product.gender.toUpperCase()}
            </p>
            <p class="product-stock
            ${product.stock <= 3 ? 'text-danger' : ''}">
            ${product.stock === 0 ? "Sold Out" : "Only " + product.stock + " left"
            }
            </p>
            <div class="rating">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star"></i>
            </div>
            <div class="product-price">
            <span>$${product.price}</span>
            ${product.status === "sale" ? `<del>$${product.oldPrice}</del>` : ""
            }
            </div>
            <button class="add-cart" onclick="addToCart(${product.id})"
            ${product.stock === 0 ? "disabled" : ""}
            >
            <i class="bi ${
            product.stock === 0 ? "bi-x-circle" : "bi-bag-plus"
            }"></i>
            ${product.stock === 0 ? "Sold Out" : "Add To Cart"}
            </button>
            </div>
            </div>
            </div>
            `;
    });
    initScrollReveal();
}

function removeWishlist(id) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist(wishlist);
    displayWishlist();
    updateWishlistCount();
}

function displayCart() {
    const container = document.getElementById("cartContainer");
    if (!container) return;
    let cart = getCart();
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
            <h2>
            Your Cart Is Empty
            </h2>
            <a href="index.html"
            class="btn btn-warning mt-3">
            Continue Shopping
            </a>
            </div>
            `;
        return;
    }

    let total = 0;
    cart.forEach(product => {
        container.innerHTML += `
            <div class="cart-item reveal">
            <img src="${product.image}"
            width="100">
            <div>
            <h5>${product.name}</h5>
            <p>${product.brand}</p>
            <div class="cart-item-variant">
            ${product.color ? `<span class="variant-pill"><span class="variant-swatch" style="background:${(product.colors && product.colors.find(c => c.name === product.color)) ? product.colors.find(c => c.name === product.color).hex : "#ccc"}"></span>${product.color}</span>` : ""}
            ${product.size ? `<span class="variant-pill">Size ${product.size}</span>` : ""}
            </div>
            <p>Price:$${product.price}</p>
            <div class="quantity-box">
            <button class="btn btn-sm btn-outline-dark" onclick="decreaseQuantity('${product.cartKey}')">
            -
            </button>
            <span class="mx-3">
            ${product.quantity}
            </span>
            <button class="btn btn-sm btn-outline-dark" onclick="increaseQuantity('${product.cartKey}')">
            +
            </button>
            </div>
            <button class="btn btn-danger" onclick="removeFromCart('${product.cartKey}')">
            Remove
            </button>
            </div>
            </div>
            `;
        total += product.price * product.quantity;
    });
    container.innerHTML += `
        <hr>
        <div class="text-end">
        <h3>Total: $${total}</h3>
        <a href="checkout.html" class="btn btn-warning">
        Proceed to Checkout
        </a>
        <button class="btn btn-danger" onclick="clearCart()">
        Clear Cart
        </button>
        </div>
        `;
    initScrollReveal();
}

function getWishlist() {
    try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist"));
        return Array.isArray(wishlist) ? wishlist : [];
    }
    catch (error) {
        console.error("Invalid wishlist data:", error);
        return [];
    }
}

function saveWishlist(list) {
    localStorage.setItem("wishlist", JSON.stringify(list));
}

function toggleWishlist(id, button) {
    let wishlist = getWishlist();
    const icon = button.querySelector("i");
    const exists = wishlist.find(item => item.id === id);
    if (exists) {
        wishlist = wishlist.filter(item => item.id !== id);
        icon.classList.remove("bi-heart-fill", "text-danger");
        icon.classList.add("bi-heart");
        showToast("Removed from wishlist");
    }
    else {
        wishlist.push({ id: id });
        icon.classList.remove("bi-heart");
        icon.classList.add("bi-heart-fill", "text-danger");
        showToast("Added to wishlist");
    }
    saveWishlist(wishlist);
    updateWishlistCount();
}

if (typeof pageType !== "undefined" && pageType === "search") {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query");
    const searchTitle = document.getElementById("searchTitle");
    if (searchTitle) {
        searchTitle.innerHTML = `
            Showing results for:
            <b>${query}</b>
            `;
    }
}

function showToast(message) {
    const toastElement = document.getElementById("cartToast");
    const toastMessage = document.getElementById("toastMessage");
    if (!toastElement || !toastMessage) return;
    toastMessage.innerText = message;
    const toast = new bootstrap.Toast(toastElement, { delay: 2500 });
    toast.show();
}

function displayCheckout() {
    const container = document.getElementById("checkoutContainer");
    if (!container) return;
    let cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
            <i class="bi bi-cart-x"
            style="font-size:70px;"></i>
            <h2 class="mt-3">
            Your cart is empty
            </h2>
            <a href="index.html"
            class="btn btn-warning mt-3">
            Continue Shopping
            </a>
            </div>
            `;
        return;
    }
    let subtotal = 0;
    let productsHTML = "";
    cart.forEach(product => {
        subtotal += product.price * product.quantity;
        productsHTML += `
            <div class="d-flex align-items-center mb-3">
            <img src="${product.image}"  width="80" class="rounded me-3">
            <div>
            <h6>${product.name}</h6>
            <div class="cart-item-variant">
            ${product.color ? `<span class="variant-pill"><span class="variant-swatch" style="background:${(product.colors && product.colors.find(c => c.name === product.color)) ? product.colors.find(c => c.name === product.color).hex : "#ccc"}"></span>${product.color}</span>` : ""}
            ${product.size ? `<span class="variant-pill">Size ${product.size}</span>` : ""}
            </div>
            <p>${product.quantity} × $${product.price}</p>
            </div>
            </div>
            `;
    });

    let shipping = 10;
    let total = subtotal + shipping;
    container.innerHTML = `
        <div class="row">
        <!-- ORDER SUMMARY -->
        <div class="col-md-6">
        ${productsHTML}
        <hr>
        <p>Subtotal: $${subtotal}
        </p>
        <p>Shipping Fee: $${shipping}</p>
        <h4>Total: $${total}</h4>
        </div>
        </div>
        `;
}

displayCheckout();
function placeOrder() {
    localStorage.removeItem("cart");
    updateCartCount();
    const container = document.getElementById("checkoutContainer");
    container.innerHTML = `
        <div class="text-center py-5">
        <i class="bi bi-check-circle-fill text-success" style="font-size:70px;"></i>
        <h2 class="mt-3">Order Placed Successfully!</h2>
        <p>Your order has been confirmed.</p>
        <a href="index.html" class="btn btn-warning">
        Continue Shopping
        </a>
        </div>
        `;
}

const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const inputs = checkoutForm.querySelectorAll("input");
            let firstInvalid = null;
            inputs.forEach(input => {
                input.classList.remove("is-invalid");
                if (input.previousElementSibling) {
                    input.previousElementSibling.style.display = "none";
                }
            });
            for (let input of inputs) {
                if (!input.checkValidity()) {
                    firstInvalid = input;
                    input.classList.add("is-invalid");
                    input.previousElementSibling.style.display = "block";
                    break;
                }
            }
            if (firstInvalid) {
                return;
            }
            localStorage.removeItem("cart");
            updateCartCount();
            checkoutForm.innerHTML = `
                <div class="text-center py-5">
                <i class="bi bi-check-circle-fill text-success" style="font-size:70px;"> </i>
                <h2 class="mt-3">Order Placed Successfully!</h2>
                <p>Thank you for shopping with Monarch Sole.</p>
                <a href="index.html" class="btn btn-warning">Continue Shopping</a>
                </div>
                `;
        });
    }
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const inputs = contactForm.querySelectorAll("input");
            let firstInvalid = null;
            inputs.forEach(input => {
                input.classList.remove("is-invalid");
                if (input.previousElementSibling) {
                    input.previousElementSibling.style.display = "none";
                }
            });
            for (let input of inputs) {
                if (!input.checkValidity()) {
                    firstInvalid = input;
                    input.classList.add("is-invalid");
                    input.previousElementSibling.style.display = "block";
                    break;
                }
            }
            if (firstInvalid) {
                return;
            }
            localStorage.removeItem("cart");
            updateCartCount();
            contactForm.innerHTML = `
                <div class="text-center py-5">
                <i class="bi bi-check-circle-fill text-success" style="font-size:70px;"></i>
                <h2 class="mt-3">Thank You!</h2>
                <p>Your message has been sent successfully.Our support team will respond within 24–48 hours.</p>
                <a href="index.html" class="btn btn-warning">Back to Home</a>
                </div>
                `;
        });
    }
}

const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const emailInput = document.getElementById("newsletterEmail");
        const message = document.getElementById("newsletterMessage");
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            message.innerHTML = `
                <p class="text-danger mt-2">
                 Please enter your email address.
                </p>
                `;
            return;
        }
        if (!emailPattern.test(email)) {
            message.innerHTML = `
                <p class="text-danger mt-2"> Please enter a valid email address. </p>
                `;
            return;
        }
        message.innerHTML = `
            <p class="text-success mt-2 fw-semibold"> 🎉 Thank you for subscribing to Monarch Sole! </p>
            `;
        newsletterForm.reset();
    });
}
displayWishlist();

let zoomLevel = 1;
let isDragging = false;
let startX = 0;
let startY = 0;
let moveX = 0;
let moveY = 0;

function openImageViewer(src) {
    const viewer = document.getElementById("imageViewer");
    const image = document.getElementById("viewerImage");
    if (!viewer || !image) return;
    image.src = src;
    zoomLevel = 1;
    moveX = 0;
    moveY = 0;
    image.style.transform = "translate(0,0) scale(1)";
    image.classList.remove("zoomed");
    image.classList.remove("dragging");
    viewer.style.display = "flex";
}

function closeImageViewer() {
    const viewer = document.getElementById("imageViewer");
    if (viewer) {
        viewer.style.display = "none";
    }

}

const viewerImage = document.getElementById("viewerImage");
if (viewerImage) {
    viewerImage.addEventListener("click", function () {
        if (isDragging) return;
        if (zoomLevel === 1) {
            zoomLevel = 1.25;
            this.classList.add("zoomed");
        } else {
            zoomLevel = 1;
            moveX = 0;
            moveY = 0;
            this.classList.remove("zoomed");
        }
        updateImageTransform();
    });

    viewerImage.addEventListener("mousedown", function (e) {
        if (zoomLevel <= 1) return;
        isDragging = true;
        this.classList.add("dragging");
        startX = e.clientX - moveX;
        startY = e.clientY - moveY;
        e.preventDefault();
    });
}

window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    updateImageTransform();
});

window.addEventListener("mouseup", function () {
    isDragging = false;
    const viewerImage = document.getElementById("viewerImage");
    if (viewerImage) {
        viewerImage.classList.remove("dragging");
    }
});

function updateImageTransform() {
    const viewerImage = document.getElementById("viewerImage");
    if (!viewerImage) return;
    viewerImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(${zoomLevel})`;
}

window.addEventListener("storage", (e) => {
    if (e.key === "cart") {
        updateStocks();
        displayProducts(getPageProducts());
        displayWishlist();
        displayCart();
        displayProductDetails();
        updateCartCount();
    }
});