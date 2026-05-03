// Staff Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeModals();
    initializeQuickActions();
    initializeAlerts();
});

function initializeDashboard() {
    // Animate task counts
    animateTaskCounts();
    
    // Set up real-time updates
    setupRealTimeUpdates();
    
    // Initialize recent records feed
    initializeRecordsFeed();
    
    // Set up alert notifications
    setupAlertNotifications();
}

function animateTaskCounts() {
    const taskCounts = document.querySelectorAll('.task-count');
    
    taskCounts.forEach(count => {
        const finalValue = parseInt(count.textContent);
        if (!isNaN(finalValue)) {
            animateNumber(count, 0, finalValue, 1500);
        }
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = start + (end - start) * easeOutQuart;
        
        element.textContent = Math.round(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function initializeModals() {
    // Modal functions
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus first input in modal
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 300);
            }
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset form
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    };
    
    // Close modal handlers
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                const modalId = modal.id;
                closeModal(modalId);
            }
        });
    });
    
    // Close modal on overlay click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function initializeQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add ripple effect
            createRipple(this, e);
            
            // Add pulse animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

function createRipple(element, event) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    element.appendChild(ripple);
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    setTimeout(() => ripple.remove(), 600);
}

function initializeAlerts() {
    const alertItems = document.querySelectorAll('.alert-item');
    
    alertItems.forEach(alert => {
        // Add dismiss functionality
        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'alert-dismiss';
        dismissBtn.innerHTML = '×';
        dismissBtn.addEventListener('click', function() {
            alert.style.transform = 'translateX(100%)';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
        
        alert.appendChild(dismissBtn);
        
        // Auto-dismiss low priority alerts after 10 seconds
        if (alert.classList.contains('alert-low')) {
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.style.opacity = '0.5';
                }
            }, 10000);
        }
    });
}

function setupRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateTaskCounts();
        addNewRecord();
        checkForNewAlerts();
    }, 45000); // Update every 45 seconds
}

function updateTaskCounts() {
    const taskCounts = document.querySelectorAll('.task-count');
    if (taskCounts.length === 0) return;
    
    const randomTask = taskCounts[Math.floor(Math.random() * taskCounts.length)];
    const currentValue = parseInt(randomTask.textContent);
    const change = Math.floor(Math.random() * 3) - 1; // Random change between -1 and +1
    const newValue = Math.max(0, currentValue + change);
    
    animateNumber(randomTask, currentValue, newValue, 1000);
    
    // Flash the updated task
    const taskCard = randomTask.closest('.task-card');
    if (taskCard) {
        taskCard.style.background = 'rgba(157, 196, 159, 0.2)';
        setTimeout(() => {
            taskCard.style.background = '';
        }, 1000);
    }
}

function addNewRecord() {
    const recordsList = document.querySelector('.records-list');
    if (!recordsList) return;
    
    const records = [
        { icon: '🌿', title: 'Feeding recorded', details: 'Block B - 1.5kg pellets' },
        { icon: '🩺', title: 'Health observation', details: 'RBT-067 - Active and healthy' },
        { icon: '📈', title: 'Weight measured', details: 'RBT-089 - 1.8kg (+50g)' },
        { icon: '💕', title: 'Breeding check', details: 'RBT-034 - Progressing well' },
        { icon: '💰', title: 'Sale completed', details: 'RBT-056 - KES 2,800' }
    ];
    
    const randomRecord = records[Math.floor(Math.random() * records.length)];
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const newRecord = document.createElement('div');
    newRecord.className = 'record-item';
    newRecord.innerHTML = `
        <div class="record-icon">${randomRecord.icon}</div>
        <div class="record-content">
            <div class="record-title">${randomRecord.title}</div>
            <div class="record-details">${randomRecord.details}</div>
            <div class="record-time">${time}</div>
        </div>
    `;
    
    // Add to top of list
    recordsList.insertBefore(newRecord, recordsList.firstChild);
    
    // Remove last item if list is too long
    const items = recordsList.querySelectorAll('.record-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
    
    // Animate new item
    newRecord.style.opacity = '0';
    newRecord.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        newRecord.style.transition = 'all 0.3s ease';
        newRecord.style.opacity = '1';
        newRecord.style.transform = 'translateY(0)';
    }, 100);
}

function checkForNewAlerts() {
    // Simulate new alert
    const alerts = [
        { type: 'high', icon: '⚠️', title: 'Health Alert', message: 'RBT-045 showing signs of illness' },
        { type: 'medium', icon: '🔔', title: 'Vaccination Due', message: 'RBT-023, RBT-045 due for vaccination' },
        { type: 'low', icon: '📝', title: 'Reminder', message: 'Weight check for RBT-067 overdue' }
    ];
    
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const alertsList = document.querySelector('.alerts-list');
    if (!alertsList) return;
    
    const newAlert = document.createElement('div');
    newAlert.className = `alert-item alert-${randomAlert.type}`;
    newAlert.innerHTML = `
        <div class="alert-icon">${randomAlert.icon}</div>
        <div class="alert-content">
            <div class="alert-title">${randomAlert.title}</div>
            <div class="alert-message">${randomAlert.message}</div>
            <div class="alert-time">${time}</div>
        </div>
    `;
    
    // Add to top of alerts list
    alertsList.insertBefore(newAlert, alertsList.firstChild);
    
    // Remove last item if list is too long
    const items = alertsList.querySelectorAll('.alert-item');
    if (items.length > 3) {
        items[items.length - 1].remove();
    }
    
    // Initialize dismiss functionality for new alert
    initializeAlerts();
    
    // Show notification
    showNotification(randomAlert.title, randomAlert.message, randomAlert.type);
}

function showNotification(title, message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">${getNotificationIcon(type)}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getNotificationIcon(type) {
    const icons = {
        high: '⚠️',
        medium: '🔔',
        low: '📝'
    };
    return icons[type] || '📢';
}

function setupAlertNotifications() {
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 3000;
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 300px;
                transform: translateX(400px);
                transition: all 0.3s ease;
                border-left: 4px solid #2a5c30;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-high {
                border-left-color: #e74c3c;
            }
            
            .notification-medium {
                border-left-color: #f39c12;
            }
            
            .notification-low {
                border-left-color: #3498db;
            }
            
            .notification-icon {
                font-size: 1.5rem;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 2px;
            }
            
            .notification-message {
                font-size: 0.9rem;
                color: #666;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #999;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: background 0.3s ease;
            }
            
            .notification-close:hover {
                background: #f0f0f0;
            }
            
            .alert-dismiss {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #999;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.3s ease;
                position: absolute;
                top: 10px;
                right: 10px;
            }
            
            .alert-dismiss:hover {
                background: rgba(0, 0, 0, 0.1);
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }
}

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .record-item,
    .alert-item {
        transition: all 0.3s ease;
    }
    
    .task-card {
        transition: all 0.3s ease;
    }
    
    .task-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }
    
    .action-card:hover {
        transform: translateY(-3px) scale(1.02);
    }
`;
document.head.appendChild(style);
