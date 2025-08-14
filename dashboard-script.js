// Dashboard JavaScript for Souqak

// Global variables
let dashboardData = null;
let salesChart = null;
let ordersChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    loadDashboardData();
});

// Load dashboard data from JSON
async function loadDashboardData() {
    try {
        const response = await fetch('dashboard-data.json');
        dashboardData = await response.json();
        
        if (dashboardData && dashboardData.dashboard) {
            initializeDashboard();
        } else {
            throw new Error('Invalid dashboard data format');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('حدث خطأ في تحميل بيانات لوحة التحكم');
    } finally {
        hideLoading();
    }
}

// Initialize dashboard components
function initializeDashboard() {
    const data = dashboardData.dashboard;
    
    // Update page title
    document.title = data.title;
    
    // Load components
    loadUserInfo(data.user);
    loadSidebarMenu(data.menuItems);
    loadStatsCards(data.stats);
    loadRecentOrders(data.recentOrders);
    loadTopProducts(data.topProducts);
    loadQuickActions(data.quickActions);
    loadRecentActivity(data.recentActivity);
    loadNotifications(data.notifications);
    
    // Initialize charts
    initializeCharts(data.salesChart, data.ordersChart);
    
    // Initialize animations
    initializeAnimations();
}

// Load user information
function loadUserInfo(user) {
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.name;
    }
    
    // Update user avatar if needed
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && user.avatar) {
        userAvatar.src = user.avatar;
    }
}

// Load sidebar menu
function loadSidebarMenu(menuItems) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;
    
    sidebarMenu.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuElement = createMenuElement(item);
        sidebarMenu.appendChild(menuElement);
    });
}

// Create menu element
function createMenuElement(item) {
    const menuItem = document.createElement('a');
    menuItem.href = item.url;
    menuItem.className = `menu-item ${item.active ? 'active' : ''}`;
    
    let badgeHtml = '';
    if (item.badge) {
        badgeHtml = `<span class="menu-badge">${item.badge}</span>`;
    }
    
    menuItem.innerHTML = `
        <i class="${item.icon}"></i>
        ${item.title}
        ${badgeHtml}
    `;
    
    // Add click event
    menuItem.addEventListener('click', function(e) {
        e.preventDefault();
        setActiveMenuItem(this);
        // Handle navigation here
        console.log('Navigate to:', item.url);
    });
    
    return menuItem;
}

// Set active menu item
function setActiveMenuItem(clickedItem) {
    // Remove active class from all items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    clickedItem.classList.add('active');
}

// Load stats cards
function loadStatsCards(stats) {
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = '';
    
    const statsArray = [
        {
            title: 'إجمالي المبيعات',
            value: formatCurrency(stats.totalSales.value),
            change: stats.totalSales.change,
            period: stats.totalSales.period,
            icon: 'fas fa-chart-line',
            type: 'sales'
        },
        {
            title: 'إجمالي الطلبات',
            value: stats.totalOrders.value.toLocaleString(),
            change: stats.totalOrders.change,
            period: stats.totalOrders.period,
            icon: 'fas fa-shopping-bag',
            type: 'orders'
        },
        {
            title: 'إجمالي المنتجات',
            value: stats.totalProducts.value.toLocaleString(),
            change: stats.totalProducts.change,
            period: stats.totalProducts.period,
            icon: 'fas fa-box',
            type: 'products'
        },
        {
            title: 'إجمالي العملاء',
            value: stats.totalCustomers.value.toLocaleString(),
            change: stats.totalCustomers.change,
            period: stats.totalCustomers.period,
            icon: 'fas fa-users',
            type: 'customers'
        }
    ];
    
    statsArray.forEach(stat => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 fade-in';
        
        const changeClass = stat.change.startsWith('+') ? 'positive' : 'negative';
        
        col.innerHTML = `
            <div class="stats-card">
                <div class="stats-icon ${stat.type}">
                    <i class="${stat.icon}"></i>
                </div>
                <div class="stats-value">${stat.value}</div>
                <div class="stats-label">${stat.title}</div>
                <div class="stats-change ${changeClass}">
                    <i class="fas fa-arrow-${stat.change.startsWith('+') ? 'up' : 'down'}"></i>
                    ${stat.change} ${stat.period}
                </div>
            </div>
        `;
        
        statsContainer.appendChild(col);
    });
}

// Load recent orders
function loadRecentOrders(orders) {
    const tableBody = document.querySelector('#recentOrdersTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td><strong>${formatCurrency(order.amount)}</strong></td>
            <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
            <td>${formatDate(order.date)}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Load top products
function loadTopProducts(products) {
    const container = document.getElementById('topProductsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item fade-in';
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-sales">${product.sales} مبيعة</div>
            </div>
            <div class="product-revenue">${formatCurrency(product.revenue)}</div>
        `;
        
        container.appendChild(productElement);
    });
}

// Load quick actions
function loadQuickActions(actions) {
    const container = document.getElementById('quickActions');
    if (!container) return;
    
    container.innerHTML = '';
    
    actions.forEach(action => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 fade-in';
        
        col.innerHTML = `
            <div class="quick-action" onclick="handleQuickAction('${action.action}')">
                <div class="quick-action-icon ${action.color}">
                    <i class="${action.icon}"></i>
                </div>
                <div class="quick-action-title">${action.title}</div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Load recent activity
function loadRecentActivity(activities) {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    container.innerHTML = '';
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item fade-in';
        
        activityElement.innerHTML = `
            <div class="activity-icon ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-action">${activity.action}</div>
                <div class="activity-details">${activity.details}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        
        container.appendChild(activityElement);
    });
}

// Load notifications
function loadNotifications(notifications) {
    const dropdown = document.getElementById('notificationDropdown');
    const badge = document.getElementById('notificationBadge');
    
    if (!dropdown) return;
    
    // Update badge count
    const unreadCount = notifications.filter(n => !n.read).length;
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    
    dropdown.innerHTML = '';
    
    // Add header
    const header = document.createElement('li');
    header.innerHTML = `
        <div class="dropdown-header d-flex justify-content-between align-items-center">
            <span>الإشعارات</span>
            <button class="btn btn-sm btn-link" onclick="markAllAsRead()">تحديد الكل كمقروء</button>
        </div>
    `;
    dropdown.appendChild(header);
    
    // Add notifications
    notifications.forEach(notification => {
        const item = document.createElement('li');
        item.innerHTML = `
            <div class="notification-item ${notification.read ? '' : 'unread'}" onclick="markAsRead(${notification.id})">
                <div class="d-flex">
                    <div class="notification-icon ${notification.type}">
                        <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="fw-bold">${notification.title}</div>
                        <div class="text-muted small">${notification.message}</div>
                        <div class="text-muted small">${notification.time}</div>
                    </div>
                </div>
            </div>
        `;
        dropdown.appendChild(item);
    });
    
    // Add footer
    const footer = document.createElement('li');
    footer.innerHTML = `
        <div class="dropdown-footer text-center">
            <a href="#" class="btn btn-sm btn-link">عرض جميع الإشعارات</a>
        </div>
    `;
    dropdown.appendChild(footer);
}

// Initialize charts
function initializeCharts(salesData, ordersData) {
    initializeSalesChart(salesData);
    initializeOrdersChart(ordersData);
}

// Initialize sales chart
function initializeSalesChart(data) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'المبيعات (ج.م)',
                data: data.data,
                borderColor: data.borderColor,
                backgroundColor: data.backgroundColor + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Initialize orders chart
function initializeOrdersChart(data) {
    const ctx = document.getElementById('ordersChart');
    if (!ctx) return;
    
    ordersChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.backgroundColor,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0
    }).format(amount).replace('EGP', 'ج.م');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
}

function getStatusClass(status) {
    const statusMap = {
        'جديد': 'new',
        'قيد التجهيز': 'processing',
        'تم الشحن': 'shipped',
        'تم التسليم': 'delivered',
        'ملغي': 'cancelled'
    };
    return statusMap[status] || 'new';
}

function getNotificationIcon(type) {
    const iconMap = {
        'order': 'shopping-bag',
        'warning': 'exclamation-triangle',
        'review': 'star',
        'payment': 'money-bill'
    };
    return iconMap[type] || 'bell';
}

// Event handlers
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

function handleQuickAction(action) {
    console.log('Quick action:', action);
    
    const actions = {
        'addProduct': () => showNotification('فتح صفحة إضافة منتج جديد', 'info'),
        'manageOrders': () => showNotification('فتح صفحة إدارة الطلبات', 'info'),
        'salesReports': () => showNotification('فتح تقارير المبيعات', 'info'),
        'storeSettings': () => showNotification('فتح إعدادات المتجر', 'info')
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

function markAsRead(notificationId) {
    console.log('Mark notification as read:', notificationId);
    // Update notification status in data
    if (dashboardData && dashboardData.dashboard.notifications) {
        const notification = dashboardData.dashboard.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            loadNotifications(dashboardData.dashboard.notifications);
        }
    }
}

function markAllAsRead() {
    console.log('Mark all notifications as read');
    if (dashboardData && dashboardData.dashboard.notifications) {
        dashboardData.dashboard.notifications.forEach(n => n.read = true);
        loadNotifications(dashboardData.dashboard.notifications);
    }
}

// Loading and error handling
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function showError(message) {
    console.error(message);
    // You can implement a proper error display here
    alert(message);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.dashboard-notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `dashboard-notification alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        left: 20px;
        z-index: 9999;
        min-width: 300px;
        opacity: 0;
        transform: translateX(-100%);
        transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-100%)';
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

// Handle window resize
window.addEventListener('resize', function() {
    if (salesChart) {
        salesChart.resize();
    }
    if (ordersChart) {
        ordersChart.resize();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh data when page becomes visible
        console.log('Page visible - refreshing data');
    }
});

// Export functions for global access
window.DashboardApp = {
    toggleSidebar,
    handleQuickAction,
    markAsRead,
    markAllAsRead,
    showNotification,
    loadDashboardData
};

