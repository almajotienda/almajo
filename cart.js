// Cart functionality with localStorage
let cart = [];

// Load cart from localStorage on init
function loadCart() {
    const savedCart = localStorage.getItem('almajo-cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('almajo-cart', JSON.stringify(cart));
}

// Product data (simplified)
const products = {
    'product-1': { name: 'Vestido Elegante Noir', salePrice: 89.99, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop' },
    'product-2': { name: 'Camisa Slim', salePrice: 45.00, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop' },
    'product-3': { name: 'Abrigo Wool', salePrice: 120.00, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop' },
    'product-5': { name: 'Vestido Floral', salePrice: 65.00, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop' },
    'product-6': { name: 'Falda Plisada', salePrice: 55.00, image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=200&h=200&fit=crop' },
    'product-7': { name: 'Vestido Premium Rosa', salePrice: 145.00, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=200&fit=crop' },
    'rental-1': { name: 'Vestido de Novia Premium', rentalPrice: 280, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=200&fit=crop' },
    'rental-2': { name: 'Vestido Cocktail Rojo', rentalPrice: 108, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&h=200&fit=crop' },
    'rental-3': { name: 'Smoking Elegante', rentalPrice: 160, image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=200&h=200&fit=crop' },
    'rental-4': { name: 'Vestido de Gala Largo', rentalPrice: 162, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop' },
    'rental-5': { name: 'Vestido Fiesta Brillante', rentalPrice: 120, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop' },
    'rental-6': { name: 'Traje Formal Navy', rentalPrice: 225, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=200&h=200&fit=crop' },
};

// Initialize on load
loadCart();

// Add to cart function
function addToCart(productId, type, size, price = null, days = 1) {
    const existingItem = cart.find(
        item => item.productId === productId && item.type === type
    );

    if (existingItem) {
        cart = cart.map(item =>
            item.productId === productId && item.type === type
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
    } else {
        const productData = products[productId] || { name: 'Producto' };
        const itemPrice = price || (type === 'compra' ? productData.salePrice : productData.rentalPrice);
        
        cart.push({ 
            productId, 
            type, 
            size, 
            quantity: 1, 
            price: itemPrice,
            days: days,
            name: productData.name,
            image: productData.image
        });
    }
    
    updateCartUI();
    showToast(type === 'compra' 
        ? 'Producto añadido al carrito de compra 💕' 
        : 'Producto añadido al carrito de alquiler ✨');
}

// Add to cart from heart button element
function addToCartFromElement(element, type) {
    element.classList.toggle('liked');
    const icon = element.querySelector('i');
    if (element.classList.contains('liked')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
    }
}

// Remove from cart
function removeFromCart(productId, type) {
    cart = cart.filter(item => 
        !(item.productId === productId && item.type === type)
    );
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, type, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId, type);
        return;
    }
    
    cart = cart.map(item =>
        item.productId === productId && item.type === type
            ? { ...item, quantity }
            : item
    );
    updateCartUI();
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
    showToast('Carrito vaciado');
}

// Get totals
function getTotals() {
    let purchaseTotal = 0;
    let rentalTotal = 0;
    
    cart.forEach(item => {
        if (item.type === 'compra') {
            purchaseTotal += (item.price || 0) * item.quantity;
        } else {
            rentalTotal += (item.price || 0) * (item.days || 1) * item.quantity;
        }
    });
    
    return { purchaseTotal, rentalTotal, total: purchaseTotal + rentalTotal };
}

// Update cart UI
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cartCount;
    });
    
    // Save to localStorage
    saveCart();
    
    // If we're on the cart page, render cart items
    if (document.getElementById('cart-empty')) {
        renderCart();
    }
}

// Render cart items with improved design
function renderCart() {
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const purchaseItems = document.getElementById('purchase-items');
    const rentalItems = document.getElementById('rental-items');
    const subtotalPurchase = document.getElementById('subtotal-purchase');
    const subtotalRental = document.getElementById('subtotal-rental');
    const cartTotal = document.getElementById('cart-total');

    if (!cartEmpty || !cartContent) return;

    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';

    // Filter items by type
    const purchaseItemsList = cart.filter(item => item.type === 'compra');
    const rentalItemsList = cart.filter(item => item.type === 'alquiler');

    // Render purchase items
    let purchaseHTML = '';
    let purchaseTotal = 0;
    
    if (purchaseItemsList.length === 0) {
        purchaseHTML = '<p style="color: var(--text-light); text-align: center; padding: 20px;">No hay productos de compra</p>';
    } else {
        purchaseItemsList.forEach(item => {
            const itemTotal = (item.price || 0) * item.quantity;
            purchaseTotal += itemTotal;
            
            purchaseHTML += `<div class="cart-item-improved"><div class="cart-item-image-improved"><img src="${item.image || 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop'}" alt="${item.name}"></div><div class="cart-item-details-improved"><h3>${item.name}</h3><p class="cart-item-meta-improved">Talla: <span>${item.size || 'M'}</span></p><p class="cart-item-price-improved">€${(item.price || 0).toFixed(2)} und.</p></div><div class="cart-item-quantity-improved"><button onclick="updateQuantity('${item.productId}', 'compra', ${item.quantity - 1})" class="qty-btn"><i class="fas fa-minus"></i></button><span>${item.quantity}</span><button onclick="updateQuantity('${item.productId}', 'compra', ${item.quantity + 1})" class="qty-btn"><i class="fas fa-plus"></i></button></div><div class="cart-item-total"><span>€${itemTotal.toFixed(2)}</span></div><button class="cart-item-remove-improved" onclick="removeFromCart('${item.productId}', 'compra')"><i class="fas fa-times"></i></button></div>`;
        });
    }
    purchaseItems.innerHTML = purchaseHTML;

    // Render rental items
    let rentalHTML = '';
    let rentalTotal = 0;
    
    if (rentalItemsList.length === 0) {
        rentalHTML = '<p style="color: var(--text-light); text-align: center; padding: 20px;">No hay productos de alquiler</p>';
    } else {
        rentalItemsList.forEach(item => {
            const itemTotal = (item.price || 0) * (item.days || 1) * item.quantity;
            rentalTotal += itemTotal;
            
            rentalHTML += `<div class="cart-item-improved rental-item"><div class="cart-item-image-improved"><img src="${item.image || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=200&fit=crop'}" alt="${item.name}"></div><div class="cart-item-details-improved"><h3>${item.name}</h3><p class="cart-item-meta-improved">Talla: <span>${item.size || 'M'}</span> • <span>${item.days || 1} dia(s)</span></p><p class="cart-item-price-improved">€${(item.price || 0).toFixed(2)}/dia</p></div><div class="cart-item-quantity-improved"><button onclick="updateQuantity('${item.productId}', 'alquiler', ${item.quantity - 1})" class="qty-btn"><i class="fas fa-minus"></i></button><span>${item.quantity}</span><button onclick="updateQuantity('${item.productId}', 'alquiler', ${item.quantity + 1})" class="qty-btn"><i class="fas fa-plus"></i></button></div><div class="cart-item-total"><span>€${itemTotal.toFixed(2)}</span></div><button class="cart-item-remove-improved" onclick="removeFromCart('${item.productId}', 'alquiler')"><i class="fas fa-times"></i></button></div>`;
        });
    }
    rentalItems.innerHTML = rentalHTML;

    // Update totals
    const totals = getTotals();
    subtotalPurchase.textContent = '€' + purchaseTotal.toFixed(2);
    subtotalRental.textContent = '€' + rentalTotal.toFixed(2);
    cartTotal.textContent = '€' + totals.total.toFixed(2);
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío');
        return;
    }
    showToast('¡Pedido realizado con éxito! Gracias por tu compra 💕✨');
    clearCart();
}

// Toast notification
function showToast(message) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Image fallback handler with better approach
const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

// ImageWithFallback functionality
function createImageWithFallback(img, fallbackSrc = ERROR_IMG_SRC) {
    const wrapper = document.createElement('div');
    wrapper.className = 'img-fallback-container';
    wrapper.style.cssText = 'display: inline-block; background: #F9E5E9; text-align: center; vertical-align: middle;';
    
    const fallback = document.createElement('div');
    fallback.style.cssText = 'display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;';
    fallback.innerHTML = `<img src="${fallbackSrc}" alt="Error loading image" style="width: 60px; height: 60px;">`;
    
    // Replace the image with wrapper
    if (img.parentNode) {
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        img.style.display = 'none';
        
        // Show fallback
        wrapper.appendChild(fallback);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            createImageWithFallback(this);
        });
    });
});

// Heart/Like buttons
document.addEventListener('DOMContentLoaded', function() {
    const heartButtons = document.querySelectorAll('.product-card-heart, .product-heart');
    heartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('liked');
            const icon = this.querySelector('i');
            if (this.classList.contains('liked')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });
});

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});