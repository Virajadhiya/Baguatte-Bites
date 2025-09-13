document.addEventListener("DOMContentLoaded", () => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.querySelector(".cart-items");
    const totalPriceElement = document.querySelector(".total-price");
    const clearCartButton = document.querySelector("#clear-cart");

    function updateCartUI() {
        cartContainer.innerHTML = "";
        let total = 0;

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p class='text-center text-muted'>Cart is Empty</p>";
            totalPriceElement.textContent = "₹0";
            return;
        }

        cartItems.forEach((item, index) => {
            let itemElement = document.createElement("div");
            itemElement.classList.add("cart-item", "d-flex", "align-items-center", "justify-content-between", "mb-3", "p-3", "border");

            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 70px; height: 70px; border-radius: 10px; object-fit: cover;">
                    <div class="ms-3">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="mb-1 text-muted">₹${item.price} x <span class="cart-qty">${item.quantity}</span></p>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-success increase-qty" data-index="${index}">+</button>
                    <button class="btn btn-sm btn-warning decrease-qty" data-index="${index}">-</button>
                    <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Remove</button>
                </div>
            `;

            cartContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        totalPriceElement.textContent = `₹${total}`;
        attachRemoveEvent();
        attachQuantityChangeEvents();
    }

    function attachRemoveEvent() {
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", (event) => {
                let index = event.target.dataset.index;
                cartItems.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartUI();
            });
        });
    }

    function attachQuantityChangeEvents() {
        document.querySelectorAll(".increase-qty").forEach((button) => {
            button.addEventListener("click", (event) => {
                let index = event.target.dataset.index;
                cartItems[index].quantity++;
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartUI();
            });
        });

        document.querySelectorAll(".decrease-qty").forEach((button) => {
            button.addEventListener("click", (event) => {
                let index = event.target.dataset.index;
                if (cartItems[index].quantity > 1) {
                    cartItems[index].quantity--;
                } else {
                    cartItems.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cartItems));
                updateCartUI();
            });
        });
    }

    clearCartButton.addEventListener("click", () => {
        cartItems = [];
        localStorage.removeItem("cart");
        updateCartUI();
    });

    updateCartUI();
});
