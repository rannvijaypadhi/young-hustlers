// Simple "Pay with Card (Coming Soon)" popup

document.addEventListener("DOMContentLoaded", () => {
    const cardButtons = document.querySelectorAll(".card-btn");

    if (cardButtons.length > 0) {
        // Create popup element once
        const popup = document.createElement("div");
        popup.className = "card-popup";
        popup.innerHTML = `
            <div class="card-popup-inner">
                <h3>Card Payments Coming Soon</h3>
                <p>
                    Card payments are not active yet.  
                    For now, please use PayPal, Venmo, Zelle, or Cash.
                </p>
                <button class="btn popup-close">Got it</button>
            </div>
        `;
        document.body.appendChild(popup);

        const closeBtn = popup.querySelector(".popup-close");

        cardButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                popup.style.display = "flex";
            });
        });

        closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
        });

        popup.addEventListener("click", (e) => {
            if (e.target === popup) {
                popup.style.display = "none";
            }
        });
    }
});
