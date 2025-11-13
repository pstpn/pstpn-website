// Animation Controller
export class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.observeElements();
        this.setupScrollAnimations();
    }
    
    observeElements() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe animatable elements
        document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupScrollAnimations() {
        const editor = document.getElementById('editor');
        
        if (editor) {
            editor.addEventListener('scroll', () => {
                this.handleScrollPosition();
            });
        }
    }
    
    handleScrollPosition() {
        const editor = document.getElementById('editor');
        const scrolled = editor.scrollTop;
        const height = editor.scrollHeight - editor.clientHeight;
        const scrollPercent = (scrolled / height) * 100;
        
        // You can use this for custom scroll effects
        // For example, updating a minimap or progress indicator
    }
    
    animateFileOpen(element) {
        element.style.animation = 'fadeInUp 0.4s ease';
    }
    
    animateTabOpen(element) {
        element.style.animation = 'tabOpen 0.2s ease';
    }
    
    animateTabClose(element, callback) {
        element.classList.add('closing');
        setTimeout(() => {
            if (callback) callback();
        }, 200);
    }
    
    typeWriter(element, text, speed = 50, callback) {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        };
        
        type();
    }
    
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let opacity = 0;
        const interval = 50;
        const steps = duration / interval;
        const increment = 1 / steps;
        
        const fade = setInterval(() => {
            opacity += increment;
            element.style.opacity = opacity;
            
            if (opacity >= 1) {
                clearInterval(fade);
                element.style.opacity = '1';
            }
        }, interval);
    }
    
    fadeOut(element, duration = 300, callback) {
        let opacity = 1;
        const interval = 50;
        const steps = duration / interval;
        const decrement = 1 / steps;
        
        const fade = setInterval(() => {
            opacity -= decrement;
            element.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(fade);
                element.style.display = 'none';
                element.style.opacity = '0';
                if (callback) callback();
            }
        }, interval);
    }
    
    slideDown(element, duration = 300) {
        element.style.maxHeight = '0';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease`;
        
        // Get full height
        element.style.maxHeight = 'none';
        const height = element.scrollHeight;
        element.style.maxHeight = '0';
        
        // Trigger reflow
        element.offsetHeight;
        
        // Animate
        element.style.maxHeight = height + 'px';
        
        setTimeout(() => {
            element.style.maxHeight = 'none';
        }, duration);
    }
    
    slideUp(element, duration = 300, callback) {
        const height = element.scrollHeight;
        element.style.maxHeight = height + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease`;
        
        // Trigger reflow
        element.offsetHeight;
        
        // Animate
        element.style.maxHeight = '0';
        
        setTimeout(() => {
            if (callback) callback();
        }, duration);
    }
    
    pulse(element, scale = 1.05, duration = 300) {
        const originalTransform = element.style.transform;
        
        element.style.transition = `transform ${duration / 2}ms ease`;
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, duration / 2);
    }
    
    shake(element, intensity = 5) {
        const originalPosition = element.style.position;
        const originalLeft = element.style.left;
        
        element.style.position = 'relative';
        
        let iterations = 0;
        const maxIterations = 4;
        
        const shakeInterval = setInterval(() => {
            if (iterations >= maxIterations) {
                clearInterval(shakeInterval);
                element.style.position = originalPosition;
                element.style.left = originalLeft;
                return;
            }
            
            const offset = iterations % 2 === 0 ? intensity : -intensity;
            element.style.left = offset + 'px';
            iterations++;
        }, 50);
    }
}
