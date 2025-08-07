// Global Variables
let particleCanvas, particleCtx;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initParticleAnimation();
    initScrollEffects();
    initMobileMenu();
    initFormHandling();
    initSmoothScrolling();
    initTypewriterEffect();
});

// Particle Animation System
function initParticleAnimation() {
    particleCanvas = document.getElementById('particle-canvas');
    if (!particleCanvas) return;
    
    particleCtx = particleCanvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around edges
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.y < 0) this.y = particleCanvas.height;
            if (this.y > particleCanvas.height) this.y = 0;
        }
        
        draw() {
            particleCtx.beginPath();
            particleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            particleCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            particleCtx.fill();
        }
    }
    
    // Create particles
    const particles = [];
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const distance = Math.sqrt(
                    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
                );
                
                if (distance < 100) {
                    particleCtx.beginPath();
                    particleCtx.moveTo(p1.x, p1.y);
                    particleCtx.lineTo(p2.x, p2.y);
                    particleCtx.strokeStyle = `rgba(69, 157, 216, ${0.3 * (1 - distance / 100)})`;
                    particleCtx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}



// Scroll Effects
function initScrollEffects() {
    const header = document.querySelector('.main-header');
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('.nav-link');
    const clientButton = document.querySelector('.client-button');
    const mobileToggleSpans = document.querySelectorAll('.mobile-menu-toggle span');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const maxScroll = 300; // Distance over which the transition happens
        const scrollProgress = Math.min(scrollPosition / maxScroll, 1);
        const isMobileMenuOpen = document.body.classList.contains('mobile-menu-open');
        
        // Progressive header background opacity
        if (scrollProgress > 0) {
            header.style.background = `rgba(255, 255, 255, ${scrollProgress * 0.95})`;
            header.style.backdropFilter = `blur(${scrollProgress * 10}px)`;
            header.style.boxShadow = `0 2px 20px rgba(0, 0, 0, ${scrollProgress * 0.1})`;
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'none';
        }
        
        // Clean white-to-blue logo transition (no brown in between)
        // Skip logo color change if mobile menu is open
        if (!isMobileMenuOpen) {
        if (scrollProgress < 0.4) {
            // White logo for first 40% of scroll
            logo.style.filter = 'brightness(0) invert(1)';
        } else {
            // Original blue colors after 40% scroll
            logo.style.filter = 'none';
            }
        }
        
                // Progressive text color transition
        navLinks.forEach(link => {
            const r = Math.round(255 * (1 - scrollProgress) + 3 * scrollProgress);
            const g = Math.round(255 * (1 - scrollProgress) + 59 * scrollProgress);
            const b = Math.round(255 * (1 - scrollProgress) + 135 * scrollProgress);
            link.style.color = `rgb(${r}, ${g}, ${b})`;
        });
        
        // Progressive button border and text color
        if (clientButton) {
            const r = Math.round(255 * (1 - scrollProgress) + 3 * scrollProgress);
            const g = Math.round(255 * (1 - scrollProgress) + 59 * scrollProgress);
            const b = Math.round(255 * (1 - scrollProgress) + 135 * scrollProgress);
            clientButton.style.color = `rgb(${r}, ${g}, ${b})`;
            clientButton.style.borderColor = `rgba(${r}, ${g}, ${b}, ${1 - scrollProgress * 0.3})`;
        }
        
        // Progressive mobile menu color
        // Skip mobile toggle color change if mobile menu is open
        if (!isMobileMenuOpen) {
        mobileToggleSpans.forEach(span => {
            const r = Math.round(255 * (1 - scrollProgress) + 3 * scrollProgress);
            const g = Math.round(255 * (1 - scrollProgress) + 59 * scrollProgress);
            const b = Math.round(255 * (1 - scrollProgress) + 135 * scrollProgress);
            span.style.background = `rgb(${r}, ${g}, ${b})`;
        });
        }
        
        // Parallax effect for hero elements
        const heroContent = document.querySelector('.hero-content');
        const hero3D = document.querySelector('.hero-3d-dashboard');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
        
        if (hero3D) {
            hero3D.style.transform = `translateY(-50%) translateX(${scrollPosition * 0.3}px)`;
        }
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link:not(.services-toggle):not(.calculators-toggle), .mobile-cta');
    const logo = document.querySelector('.logo');
    const mobileToggleSpans = document.querySelectorAll('.mobile-menu-toggle span');
    
    menuToggle.addEventListener('click', () => {
        const isActive = mobileOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('mobile-menu-open', isActive);
        
        // Force logo and hamburger menu to correct colors when menu opens
        if (isActive) {
            // Menu is opening - force colored logo and hamburger
            logo.style.filter = 'none';
            mobileToggleSpans.forEach(span => {
                span.style.background = 'var(--deep-navy)';
            });
        } else {
            // Menu is closing - apply correct colors based on current scroll position
            const scrollPosition = window.scrollY;
            const maxScroll = 300;
            const scrollProgress = Math.min(scrollPosition / maxScroll, 1);
            
            if (scrollProgress < 0.4) {
                logo.style.filter = 'brightness(0) invert(1)';
            } else {
                logo.style.filter = 'none';
            }
            
            mobileToggleSpans.forEach(span => {
                const r = Math.round(255 * (1 - scrollProgress) + 3 * scrollProgress);
                const g = Math.round(255 * (1 - scrollProgress) + 59 * scrollProgress);
                const b = Math.round(255 * (1 - scrollProgress) + 135 * scrollProgress);
                span.style.background = `rgb(${r}, ${g}, ${b})`;
            });
        }
    });
    
    // Close menu when clicking on links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            
            // Menu is closing - apply correct colors based on current scroll position
            const scrollPosition = window.scrollY;
            const maxScroll = 300;
            const scrollProgress = Math.min(scrollPosition / maxScroll, 1);
            
            if (scrollProgress < 0.4) {
                logo.style.filter = 'brightness(0) invert(1)';
            } else {
                logo.style.filter = 'none';
            }
            
            mobileToggleSpans.forEach(span => {
                const r = Math.round(255 * (1 - scrollProgress) + 3 * scrollProgress);
                const g = Math.round(255 * (1 - scrollProgress) + 59 * scrollProgress);
                const b = Math.round(255 * (1 - scrollProgress) + 135 * scrollProgress);
                span.style.background = `rgb(${r}, ${g}, ${b})`;
            });
        });
    });
    
    // Close menu when clicking outside
    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) {
            mobileOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            
            // Menu is closing - apply correct colors based on current scroll position
            const scrollPosition = window.scrollY;
            const maxScroll = 300;
            const scrollProgress = Math.min(scrollPosition / maxScroll, 1);
            
            if (scrollProgress < 0.4) {
                logo.style.filter = 'brightness(0) invert(1)';
            } else {
                logo.style.filter = 'none';
            }
            
            mobileToggleSpans.forEach(span => {
                const r = Math.round(255 * (1 - scrollProgress) + 3 * scrollProgress);
                const g = Math.round(255 * (1 - scrollProgress) + 59 * scrollProgress);
                const b = Math.round(255 * (1 - scrollProgress) + 135 * scrollProgress);
                span.style.background = `rgb(${r}, ${g}, ${b})`;
            });
        }
    });
    
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
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Thank You!';
            submitBtn.style.background = '#4CAF50';
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = 'Schedule Free Consultation';
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    });
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

// Typewriter Effect
function initTypewriterEffect() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const originalText = title.innerHTML;
    title.innerHTML = '';
    
    let index = 0;
    let currentText = '';
    
    function typeWriter() {
        if (index < originalText.length) {
            // Handle HTML tags properly to avoid visual glitches
            if (originalText.charAt(index) === '<') {
                // Find the end of the HTML tag
                let tagEnd = originalText.indexOf('>', index);
                if (tagEnd !== -1) {
                    // Add the entire tag at once
                    currentText += originalText.substring(index, tagEnd + 1);
                    index = tagEnd + 1;
                } else {
                    currentText += originalText.charAt(index);
                    index++;
                }
            } else {
                currentText += originalText.charAt(index);
                index++;
            }
            title.innerHTML = currentText;
            setTimeout(typeWriter, 25);
        }
    }
    
    // Start typewriter immediately
    setTimeout(typeWriter, 200);
}

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

 

 