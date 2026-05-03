// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeCharts();
    initializeModals();
    initializeQuickActions();
});

function initializeDashboard() {
    // Animate stats on page load
    animateStats();
    
    // Set up real-time updates
    setupRealTimeUpdates();
    
    // Initialize activity feed
    initializeActivityFeed();
    
    // Set up decision outcome handlers
    setupDecisionHandlers();
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumeric = !isNaN(finalValue.replace(/[^0-9.]/g, ''));
        
        if (isNumeric) {
            const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
            const prefix = finalValue.match(/^[^0-9]*/)[0];
            const suffix = finalValue.match(/[^0-9.]*$/)[0];
            
            animateNumber(stat, 0, numericValue, 2000, prefix, suffix);
        }
    });
}

function animateNumber(element, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = start + (end - start) * easeOutQuart;
        
        element.textContent = prefix + Math.round(currentValue).toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function initializeCharts() {
    // Revenue trend chart
    createRevenueChart();
    
    // Breeding success chart
    createBreedingChart();
}

function createRevenueChart() {
    const canvas = document.getElementById('revenue-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = [45000, 52000, 48000, 61000, 58000, 67000];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    // Simple canvas chart
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw data
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length;
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
        const y = height - padding - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#3a5c3e';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw label
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, height - padding + 20);
        
        // Draw value
        ctx.fillText('KES ' + (value / 1000).toFixed(0) + 'k', x + barWidth / 2, y - 5);
    });
}

function createBreedingChart() {
    const canvas = document.getElementById('breeding-chart');
    if (!canvas) return;
    
    // Simple pie chart implementation
    const ctx = canvas.getContext('2d');
    const data = [65, 25, 10]; // Survival rates
    const labels = ['Survived', 'Lost', 'Unknown'];
    const colors = ['#3a5c3e', '#e74c3c', '#f39c12'];
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    let currentAngle = -Math.PI / 2;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        // Draw slice
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], labelX, labelY);
        ctx.fillText(value + '%', labelX, labelY + 15);
        
        currentAngle += sliceAngle;
    });
}

function initializeModals() {
    // Set up modal handlers
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-trigger');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('show');
            }
        });
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modal on overlay click
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('show'));
        }
    });
}

function initializeQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

function setupRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateRandomStat();
        addNewActivity();
    }, 30000); // Update every 30 seconds
}

function updateRandomStat() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    const randomStat = statNumbers[Math.floor(Math.random() * statNumbers.length)];
    const currentValue = parseInt(randomStat.textContent.replace(/[^0-9]/g, ''));
    const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
    const newValue = Math.max(0, currentValue + change);
    
    animateNumber(randomStat, currentValue, newValue, 1000);
}

function addNewActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const activities = [
        { icon: '🌿', title: 'Feeding recorded', details: 'Block A - 2kg pellets' },
        { icon: '🩺', title: 'Health check', details: 'RBT-045 - Normal' },
        { icon: '💕', title: 'Birth recorded', details: 'RBT-012 - 6 kits' },
        { icon: '📈', title: 'Weight measured', details: 'RBT-034 - 2.1kg' },
        { icon: '💰', title: 'Sale completed', details: 'RBT-023 - KES 3,500' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const newActivity = document.createElement('div');
    newActivity.className = 'activity-item';
    newActivity.innerHTML = `
        <div class="activity-icon">${randomActivity.icon}</div>
        <div class="activity-content">
            <div class="activity-title">${randomActivity.title}</div>
            <div class="activity-details">${randomActivity.details}</div>
            <div class="activity-time">${time}</div>
        </div>
    `;
    
    // Add to top of list
    activityList.insertBefore(newActivity, activityList.firstChild);
    
    // Remove last item if list is too long
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
    
    // Animate new item
    newActivity.style.opacity = '0';
    newActivity.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        newActivity.style.transition = 'all 0.3s ease';
        newActivity.style.opacity = '1';
        newActivity.style.transform = 'translateY(0)';
    }, 100);
}

function setupDecisionHandlers() {
    window.addOutcome = function(decisionId) {
        const modal = document.getElementById('outcome-modal');
        if (modal) {
            // Set decision ID in form
            const form = modal.querySelector('form');
            const decisionIdInput = form.querySelector('input[name="decision_id"]');
            if (decisionIdInput) {
                decisionIdInput.value = decisionId;
            }
            
            modal.classList.add('show');
        }
    };
}

function initializeActivityFeed() {
    // Add hover effects to activity items
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
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
    
    .activity-item {
        transition: all 0.3s ease;
    }
    
    .stat-card {
        transition: all 0.3s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(style);
