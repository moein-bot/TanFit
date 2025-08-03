// Services page functionality

// BMI Calculator for services page
function calculateServiceBMI() {
    const height = parseFloat(document.getElementById('height-service').value);
    const weight = parseFloat(document.getElementById('weight-service').value);
    const resultDiv = document.getElementById('bmi-result-service');

    if (!height || !weight || height <= 0 || weight <= 0) {
        resultDiv.innerHTML = 'Please enter valid height and weight values.';
        resultDiv.className = 'bmi-result show';
        resultDiv.style.background = '#ffe6e6';
        resultDiv.style.color = '#d32f2f';
        resultDiv.style.border = '2px solid #d32f2f';
        return;
    }

    const bmi = weight / ((height / 100) ** 2);
    let category = '';
    let color = '';
    let recommendation = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#2196f3';
        recommendation = 'Consider our Muscle Gain diet plan to reach a healthy weight.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        color = '#2E8B57';
        recommendation = 'Great! Maintain your health with our Happy Life diet plan.';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        color = '#ff9800';
        recommendation = 'Our Fat Loss diet plan can help you achieve a healthier weight.';
    } else {
        category = 'Obese';
        color = '#f44336';
        recommendation = 'Our Fat Loss diet plan is designed to help you lose weight safely.';
    }

    resultDiv.innerHTML = `
        <div style="font-size: 1.3rem; margin-bottom: 0.5rem; color: ${color};">
            Your BMI: ${bmi.toFixed(1)}
        </div>
        <div style="color: ${color}; font-weight: bold; margin-bottom: 1rem;">
            ${category}
        </div>
        <div style="color: #555; font-size: 0.95rem; line-height: 1.4;">
            ${recommendation}
        </div>
    `;
    resultDiv.className = 'bmi-result show';
    resultDiv.style.background = '#f8f9fa';
    resultDiv.style.color = '#333';
    resultDiv.style.border = `2px solid ${color}`;

    // Add a subtle animation
    resultDiv.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resultDiv.style.transform = 'scale(1)';
    }, 100);
}

// FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Enhanced plan card interactions
document.addEventListener('DOMContentLoaded', function() {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle glow effect
            this.style.boxShadow = '0 25px 50px rgba(46, 139, 87, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Input validation for BMI calculator
document.addEventListener('DOMContentLoaded', function() {
    const heightInput = document.getElementById('height-service');
    const weightInput = document.getElementById('weight-service');
    
    if (heightInput) {
        heightInput.addEventListener('input', function() {
            let value = parseFloat(this.value);
            if (value < 100) this.value = 100;
            if (value > 250) this.value = 250;
        });
    }
    
    if (weightInput) {
        weightInput.addEventListener('input', function() {
            let value = parseFloat(this.value);
            if (value < 30) this.value = 30;
            if (value > 300) this.value = 300;
        });
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.plan-card, .step-card, .faq-item, .bmi-calculator-card');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});

// Plan comparison functionality
function comparePlans() {
    const selectedPlans = [];
    const checkboxes = document.querySelectorAll('.plan-compare:checked');
    
    checkboxes.forEach(checkbox => {
        selectedPlans.push(checkbox.value);
    });
    
    if (selectedPlans.length < 2) {
        showNotification('Please select at least 2 plans to compare', 'error');
        return;
    }
    
    // Create comparison modal or redirect to comparison page
    showPlanComparison(selectedPlans);
}

function showPlanComparison(plans) {
    // This would typically open a modal or redirect to a comparison page
    console.log('Comparing plans:', plans);
    showNotification('Plan comparison feature coming soon!', 'info');
}

// Price calculator based on user preferences
function calculatePrice(planType, duration = 1, features = []) {
    const basePrices = {
        'muscle-gain': 49,
        'fat-loss': 39,
        'healthy-living': 29,
        'professional-athlete': 79
    };
    
    let basePrice = basePrices[planType] || 29;
    
    // Duration discounts
    if (duration >= 3) basePrice *= 0.9; // 10% off for 3+ months
    if (duration >= 6) basePrice *= 0.85; // 15% off for 6+ months
    if (duration >= 12) basePrice *= 0.8; // 20% off for 12+ months
    
    // Additional features
    const featurePrices = {
        'meal-prep': 15,
        'supplements': 25,
        'coaching': 50,
        'progress-tracking': 10
    };
    
    features.forEach(feature => {
        if (featurePrices[feature]) {
            basePrice += featurePrices[feature];
        }
    });
    
    return Math.round(basePrice * duration);
}

// Dynamic pricing display
function updatePricing(planType) {
    const duration = document.getElementById('duration-selector')?.value || 1;
    const selectedFeatures = Array.from(document.querySelectorAll('.feature-checkbox:checked'))
        .map(cb => cb.value);
    
    const totalPrice = calculatePrice(planType, duration, selectedFeatures);
    const priceElement = document.querySelector(`[data-plan="${planType}"] .price`);
    
    if (priceElement) {
        priceElement.textContent = `$${totalPrice}`;
    }
}

// Search functionality for plans
function searchPlans(query) {
    const planCards = document.querySelectorAll('.plan-card');
    const searchTerm = query.toLowerCase();
    
    planCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.plan-description p').textContent.toLowerCase();
        const features = Array.from(card.querySelectorAll('.plan-features li'))
            .map(li => li.textContent.toLowerCase()).join(' ');
        
        const content = `${title} ${description} ${features}`;
        
        if (content.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter plans by category
function filterPlans(category) {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        const planType = card.getAttribute('data-plan');
        
        if (category === 'all' || planType === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add to favorites functionality
function toggleFavorite(planType) {
    const favorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
    const index = favorites.indexOf(planType);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(planType);
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('favoritePlans', JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favoritePlans') || '[]');
    
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const planType = btn.getAttribute('data-plan');
        const icon = btn.querySelector('i');
        
        if (favorites.includes(planType)) {
            icon.className = 'fas fa-heart';
            btn.style.color = '#e74c3c';
        } else {
            icon.className = 'far fa-heart';
            btn.style.color = '#666';
        }
    });
}

// Initialize favorite buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    updateFavoriteButtons();
});

// Newsletter subscription for plan updates
function subscribeToUpdates(email) {
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    showLoading(document.querySelector('.subscribe-btn'));
    
    setTimeout(() => {
        hideLoading(document.querySelector('.subscribe-btn'), 'Subscribe');
        showNotification('Successfully subscribed to plan updates!', 'success');
        document.getElementById('newsletter-email').value = '';
    }, 2000);
}

// Plan recommendation based on BMI
function getRecommendedPlan(bmi) {
    if (bmi < 18.5) {
        return 'muscle-gain';
    } else if (bmi >= 25) {
        return 'fat-loss';
    } else {
        return 'healthy-living';
    }
}

// Show recommended plan after BMI calculation
function showRecommendedPlan(planType) {
    const planCard = document.querySelector(`[data-plan="${planType}"]`);
    if (planCard) {
        // Highlight the recommended plan
        planCard.style.border = '3px solid #2E8B57';
        planCard.style.boxShadow = '0 0 20px rgba(46, 139, 87, 0.3)';
        
        // Scroll to the plan
        setTimeout(() => {
            planCard.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 1000);
        
        // Remove highlight after 5 seconds
        setTimeout(() => {
            planCard.style.border = '';
            planCard.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        }, 5000);
    }
}