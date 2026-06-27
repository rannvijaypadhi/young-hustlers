// -----------------------------
// CONFIG
// -----------------------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxBVNNItog3k1FDjApoq4Ow4ih1bsYu4ESvjDzcuBZWmkptJo9nNq3mYQ-fe8MDBoq_3w/exec";

// -----------------------------
// ANIMATIONS (fade-in on load)
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-in").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";

    setTimeout(() => {
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 100);
  });
});

// -----------------------------
// TIME VALIDATION (12 PM – 7 PM)
// -----------------------------
function validateTime(time) {
  if (!time) return false;
  const [hour] = time.split(":").map(Number);
  return hour >= 12 && hour < 19;
}

// -----------------------------
// PRICING LOGIC
// -----------------------------
function calculatePrice(service, tier) {
  let price = 0;

  if (service === "Car Wash") {
    if (tier === "Basic") price = 10;
    if (tier === "Plus") price = 15;
    if (tier === "Premium") price = 20;
  }

  if (service === "Lawn Mowing") {
    if (tier === "Basic") price = 12;
    if (tier === "Plus") price = 18;
    if (tier === "Premium") price = 25;
  }

  if (service === "Lemonade") price = 5;
  if (service === "Bundle") price = 30;

  return price;
}

// -----------------------------
// LIVE PRICE UPDATE
// -----------------------------
function attachLivePrice(form) {
  const tierSelect = form.querySelector("[name='tier']");
  const priceDisplay = form.querySelector(".live-price");

  if (!tierSelect || !priceDisplay) return;

  function update() {
    const service = form.service.value;
    const tier = tierSelect.value;
    const price = calculatePrice(service, tier);
    priceDisplay.textContent = "$" + price;
  }

  tierSelect.addEventListener("change", update);
  update();
}

// -----------------------------
// ORDER SUBMISSION
// -----------------------------
async function submitOrder(event) {
  event.preventDefault();
  const form = event.target;

  const service = form.service?.value || "";
  const tier = form.tier?.value || "";
  const time = form.time?.value || "";

  if ((service === "Car Wash" || service === "Lawn Mowing") && !validateTime(time)) {
    alert("We operate only between 12 PM and 7 PM for Car Wash and Lawn Mowing.");
    return;
  }

  const price = calculatePrice(service, tier);

  const data = {
    service,
    tier,
    name: form.name?.value || "",
    address: form.address?.value || "",
    date: form.date?.value || "",
    time,
    details: form.details?.value || "",
    price,
    phone: form.phone?.value || "",
    email: form.email?.value || "",
    notes: form.notes?.value || ""
  };

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.status === "success") {
      window.location.href = "payments/card.html?amount=" + price;
    } else {
      alert("Something went wrong.");
    }
  } catch (err) {
    alert("Network error.");
  }
}

// -----------------------------
// ATTACH FORM HANDLERS
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[data-order-form]").forEach(form => {
    form.addEventListener("submit", submitOrder);
    attachLivePrice(form);
  });
});
