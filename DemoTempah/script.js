// ================= MOBILE SLIDESHOW FIXES =================

// Detect touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Add touch events for mobile swipe
if (isTouchDevice) {
    const slideshow = document.querySelector('.slideshow');
    let touchStartX = 0;
    let touchEndX = 0;
    
    slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slideshow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
}

// Fix untuk slideshow autoplay pada mobile
let slideshowInterval;

function startSlideshow() {
    // Clear existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    
    // Start new interval (lebih perlahan pada mobile)
    const interval = window.innerWidth <= 768 ? 6000 : 5000;
    slideshowInterval = setInterval(nextSlide, interval);
}

// Pause slideshow ketika tidak dalam viewport
function handleVisibilityChange() {
    if (document.hidden) {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    } else {
        startSlideshow();
    }
}

// Initialize slideshow dengan fix mobile
function initSlideshow() {
    totalSlidesElement.textContent = totalSlides;
    updateSlideCounter();
    
    // Preload images untuk elak lag pada mobile
    preloadSlideImages();
    
    // Start slideshow
    startSlideshow();
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// Preload images untuk performance lebih baik
function preloadSlideImages() {
    slides.forEach(slide => {
        const img = slide;
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.classList.add('loading');
            img.addEventListener('load', function() {
                this.classList.remove('loading');
                this.classList.add('loaded');
            });
        }
    });
}

// Update changeSlide function untuk mobile
function changeSlide(slideIndex) {
    // Add transition class
    slideshow.classList.add('changing');
    
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Add active class to new slide and indicator
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    // Update counter
    updateSlideCounter();
    
    // Remove transition class after animation
    setTimeout(() => {
        slideshow.classList.remove('changing');
    }, 800);
    
    // Restart interval
    startSlideshow();
}

// Add CSS untuk transition state
const slideshowFixCSS = `
    .slideshow.changing {
        pointer-events: none;
    }
    
    .slideshow.changing .slide {
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    @media (max-width: 768px) {
        .slideshow {
            -webkit-overflow-scrolling: touch;
        }
        
        .slide.active {
            z-index: 2;
        }
        
        .slide:not(.active) {
            z-index: 1;
        }
    }
    
    /* Loading animation untuk images */
    .slide.loading {
        opacity: 0;
        transform: scale(0.95);
    }
    
    .slide.loaded {
        opacity: 1;
        transform: scale(1);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = slideshowFixCSS;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSlideshow();
    
    // Fix untuk iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        // Fix untuk Safari mobile
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.webkitTransform = 'translateZ(0)';
        });
    }
});

// Handle resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Restart slideshow dengan timing yang sesuai
        startSlideshow();
    }, 250);
});

// Pause slideshow ketika hover (desktop sahaja)
if (!isTouchDevice) {
    const slideshowElement = document.querySelector('.slideshow');
    
    slideshowElement.addEventListener('mouseenter', () => {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    });
    
    slideshowElement.addEventListener('mouseleave', () => {
        startSlideshow();
    });
}
