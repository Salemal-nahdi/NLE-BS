// Global Variables
let particleCanvas, particleCtx;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollEffects();
    initMobileMenu();
    initFormHandling();
    initSmoothScrolling();
    initServiceCategories();
    initHeaderDropdowns();
});

// Service Categories Expand/Collapse
function initServiceCategories() {
    const categories = document.querySelectorAll('.service-category');
    
    categories.forEach(category => {
        const header = category.querySelector('.category-header');
        const toggle = category.querySelector('.category-toggle');
        
        if (header && toggle) {
            header.addEventListener('click', () => {
                category.classList.toggle('active');
                const isExpanded = category.classList.contains('active');
                toggle.setAttribute('aria-expanded', isExpanded);
            });
        }
    });
}

// Header Dropdown Menus with Smooth Hover Behavior
function initHeaderDropdowns() {
    // Handle nav-dropdown-secondary (main header)
    const dropdownsSecondary = document.querySelectorAll('.nav-dropdown-secondary');
    let hideTimeoutsSecondary = new Map();
    
    // Function to close all secondary dropdowns except the specified one
    function closeAllSecondaryDropdowns(exceptDropdown = null) {
        dropdownsSecondary.forEach(dd => {
            if (dd === exceptDropdown) return;
            const menu = dd.querySelector('.dropdown-menu-secondary');
            if (menu) {
                const timeout = hideTimeoutsSecondary.get(dd);
                if (timeout) clearTimeout(timeout);
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.style.pointerEvents = 'none';
            }
        });
    }
    
    dropdownsSecondary.forEach((dropdown, index) => {
        const menu = dropdown.querySelector('.dropdown-menu-secondary');
        if (!menu) return;
        
        // Set unique z-index for each dropdown (higher for later ones)
        menu.style.zIndex = (10000 + index).toString();
        
        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', () => {
            // Close all other dropdowns first
            closeAllSecondaryDropdowns(dropdown);
            
            // Clear any existing timeout for this dropdown
            const existingTimeout = hideTimeoutsSecondary.get(dropdown);
            if (existingTimeout) clearTimeout(existingTimeout);
            
            // Show this dropdown
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
            menu.style.pointerEvents = 'auto';
        });
        
        // Hide dropdown with delay when leaving
        dropdown.addEventListener('mouseleave', () => {
            const timeout = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.style.pointerEvents = 'none';
                hideTimeoutsSecondary.delete(dropdown);
            }, 150); // 150ms delay before hiding
            hideTimeoutsSecondary.set(dropdown, timeout);
        });
        
        // Keep dropdown open when hovering over menu itself
        menu.addEventListener('mouseenter', () => {
            // Close all other dropdowns
            closeAllSecondaryDropdowns(dropdown);
            
            // Clear any existing timeout for this dropdown
            const existingTimeout = hideTimeoutsSecondary.get(dropdown);
            if (existingTimeout) clearTimeout(existingTimeout);
            
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
            menu.style.pointerEvents = 'auto';
        });
        
        menu.addEventListener('mouseleave', () => {
            const timeout = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.style.pointerEvents = 'none';
                hideTimeoutsSecondary.delete(dropdown);
            }, 150);
            hideTimeoutsSecondary.set(dropdown, timeout);
        });
    });
    
    // Handle nav-dropdown (service pages)
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    let hideTimeouts = new Map();
    
    // Function to close all dropdowns except the specified one
    function closeAllDropdowns(exceptDropdown = null) {
        dropdowns.forEach(dd => {
            if (dd === exceptDropdown) return;
            const menu = dd.querySelector('.dropdown-menu');
            if (menu) {
                const timeout = hideTimeouts.get(dd);
                if (timeout) clearTimeout(timeout);
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.style.pointerEvents = 'none';
            }
        });
    }
    
    dropdowns.forEach((dropdown, index) => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;
        
        // Set unique z-index for each dropdown (higher for later ones)
        menu.style.zIndex = (10000 + index).toString();
        
        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', () => {
            // Close all other dropdowns first
            closeAllDropdowns(dropdown);
            
            // Clear any existing timeout for this dropdown
            const existingTimeout = hideTimeouts.get(dropdown);
            if (existingTimeout) clearTimeout(existingTimeout);
            
            // Show this dropdown
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
            menu.style.pointerEvents = 'auto';
        });
        
        // Hide dropdown with delay when leaving
        dropdown.addEventListener('mouseleave', () => {
            const timeout = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.style.pointerEvents = 'none';
                hideTimeouts.delete(dropdown);
            }, 150); // 150ms delay before hiding
            hideTimeouts.set(dropdown, timeout);
        });
        
        // Keep dropdown open when hovering over menu itself
        menu.addEventListener('mouseenter', () => {
            // Close all other dropdowns
            closeAllDropdowns(dropdown);
            
            // Clear any existing timeout for this dropdown
            const existingTimeout = hideTimeouts.get(dropdown);
            if (existingTimeout) clearTimeout(existingTimeout);
            
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
            menu.style.pointerEvents = 'auto';
        });
        
        menu.addEventListener('mouseleave', () => {
            const timeout = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.style.pointerEvents = 'none';
                hideTimeouts.delete(dropdown);
            }, 150);
            hideTimeouts.set(dropdown, timeout);
        });
    });
}

// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.main-header');
    const headerTop = document.querySelector('.header-top');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Add subtle shadow to header when scrolled
        if (scrollPosition > 10) {
            headerTop.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        } else {
            headerTop.style.boxShadow = 'none';
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link:not(.services-toggle):not(.calculators-toggle), .mobile-cta');
    const mobileToggleSpans = document.querySelectorAll('.mobile-menu-toggle span');
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', () => {
        const isActive = mobileOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-open', isActive);
        
        // Set hamburger menu color to dark navy when menu is open
        if (isActive) {
            mobileToggleSpans.forEach(span => {
                span.style.background = 'var(--deep-navy)';
            });
        } else {
            mobileToggleSpans.forEach(span => {
                span.style.background = 'var(--deep-navy)';
            });
        }
    });
    
    // Close menu when clicking on links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        });
    });
    
    // Close menu when clicking outside
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) {
                mobileOverlay.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
    }
    
    // Calculator submenu toggle functionality
    const calculatorsToggle = document.querySelector('.calculators-toggle');
    const calculatorsSubmenu = document.querySelector('.mobile-calculators-submenu');
    
    if (calculatorsToggle && calculatorsSubmenu) {
        calculatorsToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            calculatorsToggle.classList.toggle('active');
            calculatorsSubmenu.classList.toggle('active');
        });
    }
    
    // Services submenu toggle functionality
    const servicesToggle = document.querySelector('.services-toggle');
    const servicesSubmenu = document.querySelector('.mobile-services-submenu');
    
    if (servicesToggle && servicesSubmenu) {
        servicesToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            servicesToggle.classList.toggle('active');
            servicesSubmenu.classList.toggle('active');
        });
    }
}









// Form Handling
function initFormHandling() {
    const form = document.getElementById('consultation-form');
    
    if (!form) return;
    
    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Real-time validation on blur
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => validateField(input));
        
        // Clear error state on input
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('error')) {
                clearFieldError(input);
            }
        });
    });
    
    // Form submission validation
    form.addEventListener('submit', (e) => {
        let isValid = true;
        
        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            // Focus on first error field
            const firstError = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        
        // Add loading state
        const submitBtn = form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            const btnText = submitBtn.querySelector('span');
            if (btnText) {
                btnText.textContent = 'Sending...';
            }
            submitBtn.disabled = true;
        }
        
        // Let Netlify handle the form submission naturally
    });
    
    // Validation functions
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return true;
        
        // Remove existing messages
        clearFieldError(field);
        clearFieldSuccess(field);
        
        // Remove error/success classes
        formGroup.classList.remove('error', 'success');
        
        // Check if field is required
        const isRequired = field.hasAttribute('required');
        const value = field.value.trim();
        
        // Required field validation
        if (isRequired && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s()+-]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 8) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // If field is valid and has value, show success
        if (value && (field.type === 'email' || field.type === 'tel')) {
            showFieldSuccess(field);
        }
        
        return true;
    }
    
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        formGroup.appendChild(errorMsg);
    }
    
    function showFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('success');
        formGroup.classList.remove('error');
        
        // Remove existing success message
        const existingSuccess = formGroup.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create success message
        const successMsg = document.createElement('span');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Looks good!';
        formGroup.appendChild(successMsg);
    }
    
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('error');
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
    
    function clearFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('success');
        const successMsg = formGroup.querySelector('.success-message');
        if (successMsg) {
            successMsg.remove();
        }
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll indicator click handler
document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});

// Service Hexagon Interactions
document.querySelectorAll('.service-hexagon').forEach(hex => {
    hex.addEventListener('mouseenter', function() {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
    
    hex.addEventListener('click', function() {
        const service = this.getAttribute('data-service');
        console.log('Service clicked:', service);
        // You can add modal or navigation logic here
    });
});

// Floating elements mouse parallax
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const benefitCards = document.querySelectorAll('.floating-benefit-card');
    benefitCards.forEach((card, index) => {
        const speed = (index + 1) * 8;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        card.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(69, 157, 216, 0.3);
        transform: translate(-50%, -50%);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    .pulse {
        animation: pulse 0.6s ease-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.service-hexagon, .expertise-card, .credentials-display, .values-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => fadeObserver.observe(element));

// Performance optimization: Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        // Handle scroll-based animations here
    });
});

 

 