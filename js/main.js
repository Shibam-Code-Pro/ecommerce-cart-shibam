// Main JavaScript file for E-Commerce Cart functionality

// Global variables
let cart = [];
const TAX_RATE = 0.08; // 8% tax rate

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartCount();
    
    // Load products on index page
    if (document.getElementById('products-container')) {
        loadProducts();
    }
    
    // Load cart items on cart page
    if (document.getElementById('cart-items-container')) {
        renderCart();
        updateCartTotals();
    }
});

/**
 * Load and display all products on the products page
 */
function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // Show loading spinner
    container.innerHTML = '<div class="col-12 loading"><div class="spinner-border text-primary" role="status"></div></div>';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        container.innerHTML = '';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    }, 500);
}

/**
 * Create a product card element
 * @param {Object} product - Product object with id, title, price, image, description
 * @returns {HTMLElement} - Product card element
 */
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-sm-6';
    
    col.innerHTML = `
        <div class="card product-card h-100">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="product-title">${product.title}</h5>
                <p class="product-description flex-grow-1">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary btn-add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

/**
 * Add a product to the shopping cart
 * @param {number} productId - ID of the product to add
 */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showAddToCartMessage(product.title);
}

/**
 * Remove a product from the shopping cart
 * @param {number} productId - ID of the product to remove
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    renderCart();
    updateCartTotals();
}

/**
 * Update the quantity of a product in the cart
 * @param {number} productId - ID of the product
 * @param {number} newQuantity - New quantity value
 */
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartCount();
        updateCartTotals();
    }
}

/**
 * Render all cart items on the cart page
 */
function renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h4>Your cart is empty</h4>
                <p>Add some products to get started!</p>
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItemElement(item);
        container.appendChild(cartItem);
    });
}

/**
 * Create a cart item element
 * @param {Object} item - Cart item object
 * @returns {HTMLElement} - Cart item element
 */
function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    div.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-2">
                <div class="cart-item-image">
                    ${item.image}
                </div>
            </div>
            <div class="col-md-4">
                <h6 class="cart-item-title">${item.title}</h6>
                <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="col-md-3">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, parseInt(this.value))" min="1">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-2">
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
            <div class="col-md-1">
                <button class="btn-remove" onclick="removeFromCart(${item.id})" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return div;
}

/**
 * Update cart totals (subtotal, tax, total)
 */
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

/**
 * Update the cart count badge in the navigation
 */
function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    }
}

/**
 * Save cart data to localStorage
 */
function saveCartToStorage() {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
}

/**
 * Load cart data from localStorage
 */
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('ecommerce-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

/**
 * Show a success message when item is added to cart
 * @param {string} productTitle - Title of the added product
 */
function showAddToCartMessage(productTitle) {
    // Create and show a temporary success message
    const message = document.createElement('div');
    message.className = 'alert alert-success position-fixed';
    message.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        <strong>${productTitle}</strong> added to cart!
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

/**
 * Process checkout form validation and submission
 */
function processCheckout() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    // Clear previous validation states
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
        const feedback = input.parentNode.querySelector('.invalid-feedback');
        if (feedback) feedback.remove();
    });
    
    // Validate each field
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.id === 'cardNumber' && input.value && !isValidCardNumber(input.value)) {
            showFieldError(input, 'Please enter a valid card number');
            isValid = false;
        } else if (input.id === 'expiryDate' && input.value && !isValidExpiryDate(input.value)) {
            showFieldError(input, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        } else if (input.id === 'cvv' && input.value && !isValidCVV(input.value)) {
            showFieldError(input, 'Please enter a valid CVV');
            isValid = false;
        }
    });
    
    if (isValid && cart.length > 0) {
        // Simulate successful checkout
        alert('Order placed successfully! Thank you for your purchase.');
        
        // Clear cart and redirect to products page
        cart = [];
        saveCartToStorage();
        updateCartCount();
        
        // Close modal and redirect
        const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        modal.hide();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
    }
}

/**
 * Show validation error for a form field
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showFieldError(input, message) {
    input.classList.add('is-invalid');
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    input.parentNode.appendChild(feedback);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate card number format (basic validation)
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} - True if valid format
 */
function isValidCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
}

/**
 * Validate expiry date format (MM/YY)
 * @param {string} expiryDate - Expiry date to validate
 * @returns {boolean} - True if valid format
 */
function isValidExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expiryDate);
}

/**
 * Validate CVV format
 * @param {string} cvv - CVV to validate
 * @returns {boolean} - True if valid format
 */
function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}
