// Souqak Marketplace - JavaScript Functions

// Sample products data
const products = [
    {
        id: 1,
        name: 'ساعة ذكية Apple Watch Series 9',
        price: '2,499',
        originalPrice: '2,999',
        discount: '17%',
        rating: 4.5,
        reviews: 128,
        icon: 'fas fa-clock',
        category: 'إلكترونيات'
    },
    {
        id: 2,
        name: 'هاتف Samsung Galaxy S24 Ultra',
        price: '15,999',
        originalPrice: '18,999',
        discount: '16%',
        rating: 4.8,
        reviews: 256,
        icon: 'fas fa-mobile-alt',
        category: 'إلكترونيات'
    },
    {
        id: 3,
        name: 'لابتوب Dell XPS 13 الجديد',
        price: '25,999',
        originalPrice: '29,999',
        discount: '13%',
        rating: 4.6,
        reviews: 89,
        icon: 'fas fa-laptop',
        category: 'إلكترونيات'
    },
    {
        id: 4,
        name: 'سماعات AirPods Pro الجيل الثاني',
        price: '1,899',
        originalPrice: '2,299',
        discount: '17%',
        rating: 4.7,
        reviews: 342,
        icon: 'fas fa-headphones',
        category: 'إلكترونيات'
    },
    {
        id: 5,
        name: 'كاميرا Canon EOS R6 Mark II',
        price: '45,999',
        originalPrice: '52,999',
        discount: '13%',
        rating: 4.9,
        reviews: 67,
        icon: 'fas fa-camera',
        category: 'إلكترونيات'
    },
    {
        id: 6,
        name: 'تابلت iPad Air الجيل الخامس',
        price: '8,999',
        originalPrice: '10,499',
        discount: '14%',
        rating: 4.6,
        reviews: 198,
        icon: 'fas fa-tablet-alt',
        category: 'إلكترونيات'
    }
];

// Shopping cart
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initializeAnimations();
    initializeEventListeners();
    loadCartFromStorage();
});

// Load products function
function loadProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 fade-in';
    
    const stars = generateStars(product.rating);
    
    col.innerHTML = `
        <div class="product-card">
            <div class="product-image">
                <i class="${product.icon}"></i>
                <span class="discount-badge">-${product.discount}</span>
            </div>
            <div class="product-info">
                <h5 class="product-title">${product.name}</h5>
                <div class="product-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <div>
                        <span class="current-price">${product.price} ج.م</span>
                        <span class="original-price">${product.originalPrice} ج.م</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Generate stars for rating
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCartToStorage();
    showNotification(`تم إضافة ${product.name} إلى السلة`, 'success');
    
    // Add animation to cart icon
    animateCartIcon();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    saveCartToStorage();
    showNotification('تم حذف المنتج من السلة', 'info');
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Animate cart icon
function animateCartIcon() {
    const cartIcon = document.querySelector('.nav-icons .fa-shopping-cart').parentElement;
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('souqak_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('souqak_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Search function
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        showNotification(`البحث عن: ${query}`, 'info');
        // Filter products based on search query
        filterProducts(query);
    } else {
        loadProducts(); // Show all products if search is empty
    }
}

// Filter products
function filterProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-search me-2"></i>
                    لم يتم العثور على منتجات تطابق البحث "${query}"
                </div>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // Re-initialize animations for new elements
    initializeAnimations();
}

// Initialize event listeners
function initializeEventListeners() {
    // Search input Enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
            filterByCategory(category);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Filter by category
function filterByCategory(category) {
    if (category === 'الكل') {
        loadProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.category === category
    );
    
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    لا توجد منتجات في فئة "${category}" حالياً
                </div>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    // Re-initialize animations
    initializeAnimations();
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'}`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Get cart items
function getCartItems() {
    return cart;
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(',', ''));
        return total + (price * item.quantity);
    }, 0);
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartCount();
    saveCartToStorage();
    showNotification('تم إفراغ السلة', 'info');
}

// Update product quantity in cart
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartCount();
            saveCartToStorage();
        }
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('ar-EG').format(price);
}

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number (Egyptian format)
function validatePhone(phone) {
    const phoneRegex = /^(\+20|0)?1[0125]\d{8}$/;
    return phoneRegex.test(phone);
}

// Show loading state
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    }
}

// Hide loading state
function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create debounced search function
const debouncedSearch = debounce(performSearch, 300);

// Add real-time search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh cart count when page becomes visible
        loadCartFromStorage();
    }
});

// Export functions for use in other files
window.SouqakApp = {
    addToCart,
    removeFromCart,
    getCartItems,
    getCartTotal,
    clearCart,
    updateQuantity,
    performSearch,
    showNotification,
    formatPrice,
    validateEmail,
    validatePhone
};

