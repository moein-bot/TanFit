// Contact page functionality

// Copy to clipboard functionality
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(function() {
        // Show success feedback
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        
        showNotification(`Copied ${text} to clipboard!`, 'success');
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        showNotification('Failed to copy to clipboard', 'error');
        console.error('Could not copy text: ', err);
    });
}

// Email form submission
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const callbackForm = document.getElementById('callbackForm');

    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validate form
            const errors = validateContactForm(formData);
            if (errors.length > 0) {
                showNotification(errors.join(', '), 'error');
                return;
            }

            // Show loading state
            const submitBtn = emailForm.querySelector('.submit-btn');
            showLoading(submitBtn);

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                hideLoading(submitBtn, '<i class="fas fa-paper-plane"></i> Send Message');
                showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                emailForm.reset();
                
                // Reset floating labels
                resetFloatingLabels(emailForm);
            }, 2000);
        });
    }

    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('callbackName').value,
                phone: document.getElementById('callbackPhone').value,
                preferredTime: document.getElementById('preferredTime').value,
                message: document.getElementById('callbackMessage').value
            };

            // Validate form
            const errors = validateCallbackForm(formData);
            if (errors.length > 0) {
                showNotification(errors.join(', '), 'error');
                return;
            }

            // Show loading state
            const submitBtn = callbackForm.querySelector('.submit-btn');
            showLoading(submitBtn);

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                hideLoading(submitBtn, '<i class="fas fa-phone"></i> Request Call Back');
                showNotification('Callback request submitted! We\'ll call you during your preferred time.', 'success');
                callbackForm.reset();
                
                // Reset floating labels
                resetFloatingLabels(callbackForm);
            }, 2000);
        });
    }

    // Handle floating labels for dynamically filled forms
    handleFloatingLabels();
});

// Form validation functions
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email');
    if (!data.subject.trim()) errors.push('Subject is required');
    if (!data.message.trim()) errors.push('Message is required');
    if (data.message.length < 10) errors.push('Message must be at least 10 characters');
    
    return errors;
}

function validateCallbackForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.phone.trim()) errors.push('Phone number is required');
    if (!isValidPhone(data.phone)) errors.push('Please enter a valid phone number');
    if (!data.preferredTime) errors.push('Please select a preferred time');
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Iranian phone number validation
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Handle floating labels
function handleFloatingLabels() {
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    inputs.forEach(input => {
        // Check if input has value on page load
        if (input.value) {
            input.classList.add('has-value');
        }
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        input.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
}

function resetFloatingLabels(form) {
    const inputs = form.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    inputs.forEach(input => {
        input.classList.remove('has-value', 'focused');
    });
}

// Enhanced form animations
document.addEventListener('DOMContentLoaded', function() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('fade-in');
    });
});

// Add CSS for form animations
const formAnimationStyle = document.createElement('style');
formAnimationStyle.textContent = `
    .form-group.fade-in {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group input.has-value + label,
    .form-group textarea.has-value + label,
    .form-group select.has-value + label,
    .form-group input.focused + label,
    .form-group textarea.focused + label,
    .form-group select.focused + label {
        top: -8px;
        left: 12px;
        font-size: 0.8rem;
        color: #2E8B57;
        font-weight: 600;
    }
`;
document.head.appendChild(formAnimationStyle);

// Auto-format phone number input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format Iranian phone number
            if (value.startsWith('0')) {
                value = value.substring(1);
            }
            if (value.startsWith('98')) {
                value = value.substring(2);
            }
            
            // Add formatting
            if (value.length >= 3) {
                value = value.substring(0, 3) + ' ' + value.substring(3);
            }
            if (value.length >= 7) {
                value = value.substring(0, 7) + ' ' + value.substring(7);
            }
            
            e.target.value = '0' + value;
        });
    });
});

// Add smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});