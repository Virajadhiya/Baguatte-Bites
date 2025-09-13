document.addEventListener("DOMContentLoaded", function () {
    let cartIcon = document.querySelector('#cart');
    let cartSidebar = document.querySelector('.shopping-cart');
    let login = document.querySelector('.login-form');
    let navbar = document.querySelector('.navbar');

    // Toggle Cart
    cartIcon.onclick = () => {
        cartSidebar.classList.toggle('active');
        login.classList.remove('active');
    };

    // Toggle Login Form
    document.querySelector('#login').onclick = () => {
        login.classList.toggle('active');
        cartSidebar.classList.remove('active');
    };

    // Toggle Navbar
    document.querySelector('#menu').onclick = () => {
        navbar.classList.toggle('active');
        cartSidebar.classList.remove('active');
        login.classList.remove('active');
    };

    // Close all overlays on scroll
    window.onscroll = () => {
        cartSidebar.classList.remove('active');
        login.classList.remove('active');
        navbar.classList.remove('active');
    };

    // ✅ Swiper Slider for homepage
    new Swiper(".home-slider", {
        autoplay: {
            delay: 7500,
            disableOnInteraction: false,
        },
        grabCursor: true,
        loop: true,
        centeredSlides: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    // ✅ Category Switching
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categories = document.querySelectorAll('.box-container.category');

    function showCategory(target) {
        categories.forEach(section => {
            section.classList.remove("active");
            if (section.classList.contains(target)) {
                section.classList.add("active");
            }
        });

        categoryButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.category === target);
        });
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.category;
            showCategory(target);
        });
    });

    showCategory("pizza");

    // ✅ LocalStorage Helpers
    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // ✅ Update Cart Sidebar UI
    function updateCartUI() {
        const cartData = getCart();
        const cartContainer = document.querySelector(".shopping-cart .cart-items");
        const totalElement = document.querySelector(".shopping-cart .total");

        cartContainer.innerHTML = "";
        let total = 0;

        cartData.forEach((item, index) => {
            if (item.quantity > 0) {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("box");
                itemDiv.innerHTML = `
                    <i class="fas fa-times remove-item" data-index="${index}"></i>
                    <div class="content">
                        <h3>${item.name}</h3>
                        <span class="quantity">${item.quantity}</span>
                        <span class="multiply">x</span>
                        <span class="price">₹${item.price}</span>
                    </div>
                `;
                cartContainer.appendChild(itemDiv);
                total += item.price * item.quantity;
            }
        });

        totalElement.innerHTML = `Total: ₹${total}`;
    }

    // ✅ Bind quantity +/- buttons
    document.querySelectorAll('.menu .box').forEach(box => {
        const itemName = box.querySelector('h3').innerText.trim();
        const itemPrice = parseFloat(box.querySelector('.price').innerText.replace("₹", "").trim());
        const minusBtn = box.querySelector('.minus');
        const plusBtn = box.querySelector('.plus');
        const display = box.querySelector('.qty-display');

        if (!minusBtn || !plusBtn || !display) return;

        // Set initial display value
        const cart = getCart();
        const existing = cart.find(i => i.name === itemName);
        display.innerText = existing ? existing.quantity : 0;

        minusBtn.addEventListener('click', e => {
            e.stopPropagation();
            let qty = parseInt(display.innerText);
            if (qty > 0) qty--;

            display.innerText = qty;

            let cart = getCart();
            let item = cart.find(i => i.name === itemName);

            if (item) {
                item.quantity = qty;
                if (qty === 0) cart = cart.filter(i => i.name !== itemName);
            }

            saveCart(cart);
            updateCartUI();
        });

        plusBtn.addEventListener('click', e => {
            e.stopPropagation();
            let qty = parseInt(display.innerText);
            qty++;

            display.innerText = qty;

            let cart = getCart();
            let item = cart.find(i => i.name === itemName);

            if (item) {
                item.quantity = qty;
            } else {
                let image = "";
                const imgEl = box.querySelector("img");
                if (imgEl) {
                    image = imgEl.getAttribute("src"); // ✅ works if <img> is present
                } else {
                    console.warn(`No image found in .box for item: ${itemName}`); // Debug helper
                }
            
        cart.push({ name: itemName, price: itemPrice, quantity: 1, image: image });
    }

            saveCart(cart);
            updateCartUI();
        });
    });

    // ✅ Remove from cart
    document.querySelector(".shopping-cart").addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const index = e.target.dataset.index;
            let cart = getCart();
            cart.splice(index, 1);
            saveCart(cart);
            updateCartUI();
        }
    });

    updateCartUI(); // Initial load
});
