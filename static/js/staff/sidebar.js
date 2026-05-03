// Staff Sidebar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const overlay = document.querySelector('.sidebar-overlay');
    
    // Mobile menu toggle
    if (toggleBtn && overlay) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }
    
    // Active link highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Add hover effects
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Logout confirmation
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to logout?')) {
                e.preventDefault();
            }
        });
    }
    
    // Sidebar scroll indicators
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (sidebarNav) {
        sidebarNav.addEventListener('scroll', function() {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight;
            const clientHeight = this.clientHeight;
            
            // Add/remove scroll shadows based on scroll position
            if (scrollTop > 0) {
                sidebar.classList.add('scrolled-top');
            } else {
                sidebar.classList.remove('scrolled-top');
            }
            
            if (scrollTop + clientHeight < scrollHeight) {
                sidebar.classList.add('scrolled-bottom');
            } else {
                sidebar.classList.remove('scrolled-bottom');
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }
    });
    
    // User avatar animation
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    }
    
    // Dynamic time update
    updateTime();
    setInterval(updateTime, 1000);
});

function updateTime() {
    const currentTimeElements = document.querySelectorAll('.current-time');
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    currentTimeElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Add custom styles
const style = document.createElement('style');
style.textContent = `
    .sidebar.scrolled-top::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(to bottom, rgba(42, 92, 48, 0.2), transparent);
        pointer-events: none;
    }
    
    .sidebar.scrolled-bottom::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: linear-gradient(to top, rgba(42, 92, 48, 0.2), transparent);
        pointer-events: none;
    }
    
    .nav-link {
        transition: all 0.3s ease;
    }
    
    .user-avatar {
        transition: transform 0.2s ease;
        cursor: pointer;
    }
    
    .sidebar-toggle {
        display: none;
    }
    
    @media (max-width: 768px) {
        .sidebar-toggle {
            display: block;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #2a5c30;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
        }
    }
`;
document.head.appendChild(style);
