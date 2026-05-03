// Login page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    
    // Auto-focus first input
    if (inputs.length > 0) {
        inputs[0].focus();
    }
    
    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;
            
            // Reset after 3 seconds (in case of errors)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
    
    // Add input animations
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Add keyboard navigation
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    loginForm.submit();
                }
            }
        });
    });
    
    // Add form validation feedback
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.remove('error');
            }
        });
    });
    
    // Add shake animation for errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.style.animation = 'shake 0.5s';
    });
});

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-group.focused label {
        color: #3a5c3e;
        transform: translateY(-2px);
        font-size: 0.85rem;
    }
    
    .form-group input.error {
        border-color: #e74c3c;
        box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
`;
document.head.appendChild(style);
