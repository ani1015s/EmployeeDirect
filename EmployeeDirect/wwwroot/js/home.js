// Home page specific JavaScript

// DOM Elements
const employeeCountElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
const departmentCountElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
const countriesCountElement = document.querySelector('.stat-card:nth-child(3) .stat-value');
const newHiresCountElement = document.querySelector('.stat-card:nth-child(4) .stat-value');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add animation to stat cards
    animateStatCards();
    
    // Animate the static numbers
    setTimeout(() => {
        animateStaticNumbers();
    }, 500);
    
    // Add hover effects to feature cards
    addFeatureCardEffects();
});

// Function to add animation to stat cards
function animateStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Function to add hover effects to feature cards
function addFeatureCardEffects() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon i');
            if (icon) {
                icon.classList.add('animate__animated', 'animate__heartBeat');
                
                setTimeout(() => {
                    icon.classList.remove('animate__animated', 'animate__heartBeat');
                }, 1000);
            }
        });
    });
}

// Function to animate static numbers
function animateStaticNumbers() {
    // Store the original values
    const employeeCount = parseInt(employeeCountElement.textContent.replace(/[^0-9]/g, '')) || 0;
    const departmentCount = parseInt(departmentCountElement.textContent.replace(/[^0-9]/g, '')) || 0;
    const countriesCount = parseInt(countriesCountElement.textContent.replace(/[^0-9]/g, '')) || 0;
    const newHiresCount = parseInt(newHiresCountElement.textContent.replace(/[^0-9]/g, '')) || 0;
    
    // Reset to zero for animation
    employeeCountElement.textContent = '0';
    departmentCountElement.textContent = '0';
    countriesCountElement.textContent = '0';
    newHiresCountElement.textContent = '0';
    
    // Animate each counter
    animateCounter(employeeCountElement, 0, employeeCount, 1500);
    animateCounter(departmentCountElement, 0, departmentCount, 1200);
    animateCounter(countriesCountElement, 0, countriesCount, 1000);
    animateCounter(newHiresCountElement, 0, newHiresCount, 800);
}

// Function to animate counter
function animateCounter(element, start, end, duration) {
    // Handle case where start and end are the same
    if (start === end) {
        element.textContent = end;
        
        // Add the "+" sign if the value is for countries
        if (element === countriesCountElement && !element.textContent.includes('+')) {
            element.textContent = element.textContent + '+';
        }
        return;
    }
    
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range)) || 50; // Ensure stepTime is at least 50ms
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
            
            // Add the "+" sign if the value is for countries
            if (element === countriesCountElement && !element.textContent.includes('+')) {
                element.textContent = element.textContent + '+';
            }
            
            // Add a pulse animation when counter finishes
            element.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                element.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }, stepTime);
}

// Function to navigate to departments page
function showDepartments() {
    window.location.href = 'departments.html';
}

// Function to navigate to departments page
function showDepartments() {
    window.location.href = 'departments.html';
}