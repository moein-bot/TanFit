// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
});

// Smooth scroll to services section
function scrollToServices() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth'
    });
}

// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const resultDiv = document.getElementById('bmi-result');

    if (!height || !weight || height <= 0 || weight <= 0) {
        resultDiv.innerHTML = 'Please enter valid height and weight values.';
        resultDiv.className = 'bmi-result show';
        resultDiv.style.background = '#ffe6e6';
        resultDiv.style.color = '#d32f2f';
        return;
    }

    const bmi = weight / ((height / 100) ** 2);
    let category = '';
    let color = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#2196f3';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        color = '#2E8B57';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        color = '#ff9800';
    } else {
        category = 'Obese';
        color = '#f44336';
    }

    resultDiv.innerHTML = `
        <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">Your BMI: ${bmi.toFixed(1)}</div>
        <div style="color: ${color}; font-weight: bold;">${category}</div>
    `;
    resultDiv.className = 'bmi-result show';
    resultDiv.style.background = '#e8f5e8';
    resultDiv.style.color = '#333';
    resultDiv.style.border = `2px solid ${color}`;
}

// Start diet plan - redirect to questionnaire
function startDietPlan(planType) {
    // Check if user is logged in (this will be implemented with backend)
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Please sign up or log in to start your personalized diet plan.');
        window.location.href = 'profile.html';
        return;
    }

    // Store the selected plan type and redirect to questionnaire
    localStorage.setItem('selectedPlan', planType);
    window.location.href = 'questionnaire.html';
}

// Enhanced service card interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle pulse animation
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    });
});

// Add pulse animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: translateY(-10px) scale(1.05); }
        50% { transform: translateY(-12px) scale(1.06); }
        100% { transform: translateY(-10px) scale(1.05); }
    }
`;
document.head.appendChild(style);

// Parallax effect for background elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.bg-element');
    const speed = 0.5;

    parallax.forEach(element => {
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Form validation helper
function validateForm(formData) {
    const errors = [];
    
    for (const [key, value] of Object.entries(formData)) {
        if (!value || value.trim() === '') {
            errors.push(`${key} is required`);
        }
    }
    
    return errors;
}

// Loading animation
function showLoading(element) {
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    element.disabled = true;
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2E8B57' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(notificationStyle);