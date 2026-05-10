import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsDJhfaPx1B04LmCwJh_HtZB4lt6mQiKw",

  authDomain: "clotholing.firebaseapp.com",

  projectId: "clotholing",

  storageBucket: "clotholing.firebasestorage.app",

  messagingSenderId: "335218221588",

  appId: "1:335218221588:web:fb033ca2aad0bba8c1fd01",

  measurementId: "G-KGD78PFNNS",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ==================== COUNTDOWN TIMER ====================
const startCountdown = () => {
  // Set countdown to 7 days from now
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = endDate.getTime() - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(
      2,
      "0",
    );
    document.getElementById("minutes").textContent = String(minutes).padStart(
      2,
      "0",
    );
    document.getElementById("seconds").textContent = String(seconds).padStart(
      2,
      "0",
    );

    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById("countdownTimer").innerHTML =
        "<p style='grid-column: 1/-1; text-align: center; color: #d6316b; font-weight: 700;'>Limited offer ended!</p>";
    }
  };

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
};

startCountdown();

// ==================== CAROUSEL/IMAGE SLIDER ====================
const carouselImages = [
  { img: "img/prduct1.png", name: "Damask Kurta", price: 650 },
  { img: "img/prduct3.png", name: "Red Velvet Kurta", price: 650 },
  { img: "img/prduct2.png", name: "Paisley Kurta", price: 650 },
];

let currentCarouselIndex = 0;

const updateCarousel = () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot");

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentCarouselIndex);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentCarouselIndex);
  });
};

const nextCarouselSlide = () => {
  currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
  updateCarousel();
};

// Auto-rotate carousel every 5 seconds
setInterval(nextCarouselSlide, 5000);

// Add dot click listeners
document.querySelectorAll(".dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    currentCarouselIndex = parseInt(dot.getAttribute("data-index"));
    updateCarousel();
  });
});

// Add buy button functionality
document.querySelectorAll(".carousel-buy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productName = btn.getAttribute("data-product");
    const price = parseInt(btn.getAttribute("data-price"));

    // Scroll to order section
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });

    // Pre-fill the order form with selected product
    document.getElementById("productName").value = productName;
    document.getElementById("price").value = price;

    // Update total
    const quantity = parseInt(document.getElementById("quantity").textContent);
    document.getElementById("totalAmount").textContent = (
      quantity * price
    ).toFixed(2);

    // Show success message briefly
    const successMsg = document.getElementById("successMsg");
    successMsg.textContent = `${productName} selected! Complete your order below.`;
    successMsg.style.color = "#0f766e";

    setTimeout(() => {
      successMsg.textContent = "";
    }, 3000);
  });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
}, observerOptions);

// Observe all scroll-animate elements
document.querySelectorAll("[data-scroll-animate]").forEach((element) => {
  scrollObserver.observe(element);
});

// Auto image slider for hero section

const form = document.getElementById("orderForm");
const quantityDisplay = document.getElementById("quantity");
const increaseQty = document.getElementById("increaseQty");
const decreaseQty = document.getElementById("decreaseQty");
const priceInput = document.getElementById("price");
const totalAmountDisplay = document.getElementById("totalAmount");

let quantity = 1;

const updateTotal = () => {
  const price = Number(priceInput.value) || 650; // Default price if not provided
  totalAmountDisplay.innerText = (quantity * price).toFixed(2);
};

const updateQuantity = (newQuantity) => {
  quantity = Math.max(1, newQuantity);
  quantityDisplay.innerText = quantity;
  updateTotal();
};

increaseQty.addEventListener("click", () => updateQuantity(quantity + 1));
decreaseQty.addEventListener("click", () => updateQuantity(quantity - 1));
priceInput.addEventListener("input", updateTotal);

updateTotal();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("productName").value;
  const price = Number(priceInput.value) || 650; // Default price if not provided
  const totalAmount = quantity * price;

  try {
    await addDoc(collection(db, "orders"), {
      name: name,
      phone: phone,
      productName: "Default Product", // Hardcoded since no product selection
      quantity: quantity,
      pricePerItem: price,
      totalAmount: totalAmount,
      address: address,
      createdAt: new Date(),
    });

    document.getElementById("successMsg").innerText =
      "Order Submitted Successfully!";

    form.reset();
    quantity = 1;
    quantityDisplay.innerText = quantity;
    updateTotal();
  } catch (error) {
    console.log(error);
    alert("Error submitting order");
  }
});
