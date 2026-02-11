// PRELOADER
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
});

// TOGGLE MENU
function toggleMenu() {
    const menu = document.getElementById('menu');
    const toggle = document.querySelector('.menu-toggle');
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        menu.style.display = 'flex';
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
        }, 10);
    } else {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            menu.style.display = 'none';
        }, 300);
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const toggle = document.querySelector('.menu-toggle');
    
    if (!menu.contains(event.target) && !toggle.contains(event.target) && window.innerWidth <= 768) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            menu.style.display = 'none';
        }, 300);
    }
});

// SLIDESHOW VARIABLES
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
const currentSlideElement = document.querySelector('.current-slide');
const totalSlidesElement = document.querySelector('.total-slides');
let slideshowInterval;
const slideshow = document.querySelector('.slideshow');

// Detect touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Initialize slideshow with mobile fixes
function initSlideshow() {
    totalSlidesElement.textContent = totalSlides;
    updateSlideCounter();
    
    // Preload images untuk elak lag pada mobile
    preloadSlideImages();
    
    // Start slideshow dengan timing yang sesuai untuk mobile
    startSlideshow();
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add touch/swipe events untuk mobile
    if (isTouchDevice) {
        setupTouchEvents();
    }
    
    // Add hover pause untuk desktop sahaja
    if (!isTouchDevice) {
        setupHoverPause();
    }
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
            
            // Force load jika ada masalah
            if (img.src && !img.complete) {
                const tempImg = new Image();
                tempImg.src = img.src;
            }
        }
    });
}

// Start slideshow dengan timing yang sesuai
function startSlideshow() {
    // Clear existing interval
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
    
    // Timing berbeza untuk mobile (lebih perlahan)
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

// Setup touch events untuk mobile swipe
function setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        // Pause autoplay ketika user swipe
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    }, { passive: true });
    
    slideshow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        // Restart autoplay selepas swipe
        setTimeout(startSlideshow, 3000);
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

// Setup hover pause untuk desktop
function setupHoverPause() {
    slideshow.addEventListener('mouseenter', () => {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
    });
    
    slideshow.addEventListener('mouseleave', () => {
        startSlideshow();
    });
}

// Change slide dengan animation
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

// Next slide
function nextSlide() {
    const nextIndex = (currentSlide + 1) % totalSlides;
    changeSlide(nextIndex);
}

// Previous slide
function prevSlide() {
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    changeSlide(prevIndex);
}

// Update slide counter
function updateSlideCounter() {
    currentSlideElement.textContent = currentSlide + 1;
}

// Add click events to indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        changeSlide(index);
    });
    
    // Add touch events untuk mobile
    indicator.addEventListener('touchstart', (e) => {
        e.preventDefault();
        changeSlide(index);
    }, { passive: false });
});

// SMOOTH SCROLL WITH OFFSET
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                const menu = document.getElementById('menu');
                const toggle = document.querySelector('.menu-toggle');
                menu.classList.remove('active');
                toggle.classList.remove('active');
                menu.style.display = 'none';
            }
        }
    });
});

// ACTIVE NAV LINK ON SCROLL
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

// SCROLL ANIMATION FOR SECTIONS
function animateSectionsOnScroll() {
    const sections = document.querySelectorAll('.section-animate');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.85) {
            section.classList.add('animate-in');
        }
    });
}

// VIDEO CONTROLS
const video = document.querySelector('video');

function togglePlay() {
    if (video) {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
}

function toggleMute() {
    if (video) {
        video.muted = !video.muted;
        updateMuteButton();
    }
}

function updateMuteButton() {
    const muteBtn = document.querySelector('[onclick="toggleMute()"]');
    if (muteBtn && video) {
        const icon = muteBtn.querySelector('.control-icon');
        if (icon) {
            icon.textContent = video.muted ? '🔇' : '🔊';
        }
    }
}

function toggleFullscreen() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
        if (!document.fullscreenElement) {
            if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen();
            } else if (videoWrapper.webkitRequestFullscreen) {
                videoWrapper.webkitRequestFullscreen();
            } else if (videoWrapper.msRequestFullscreen) {
                videoWrapper.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}

// Click to play on video overlay
const videoOverlay = document.querySelector('.video-overlay');
if (videoOverlay) {
    videoOverlay.addEventListener('click', togglePlay);
}

// Update play/pause on video
if (video) {
    video.addEventListener('play', function() {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.style.display = 'none';
        }
    });
    
    video.addEventListener('pause', function() {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.style.display = 'flex';
        }
    });
}

// SCROLL EVENT LISTENERS
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    animateSectionsOnScroll();
    updateScrollToTopButton();
});

// SCROLL TO TOP BUTTON
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--brown-light), var(--brown-medium));
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 24px;
    cursor: pointer;
    z-index: 999;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 20px var(--shadow-dark);
    transition: var(--transition);
    opacity: 0;
    transform: translateY(20px);
`;

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.opacity = '1';
    scrollToTopBtn.style.transform = 'translateY(-5px)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.opacity = '0.9';
    scrollToTopBtn.style.transform = 'translateY(0)';
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.body.appendChild(scrollToTopBtn);

function updateScrollToTopButton() {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.display = 'flex';
        setTimeout(() => {
            scrollToTopBtn.style.opacity = '0.9';
            scrollToTopBtn.style.transform = 'translateY(0)';
        }, 10);
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.transform = 'translateY(20px)';
        setTimeout(() => {
            scrollToTopBtn.style.display = 'none';
        }, 300);
    }
}

// Initial animations
window.addEventListener('load', () => {
    // Initialize slideshow
    initSlideshow();
    
    // Animate sections
    animateSectionsOnScroll();
    
    // Add animation delay to each section
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section, index) => {
        section.style.transitionDelay = `${index * 0.2}s`;
    });
    
    // Update mute button
    updateMuteButton();
    
    // Add loading animation to images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        img.style.opacity = '0';
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Force load if already cached
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    });
});

// RESIZE HANDLER
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Restart slideshow dengan timing yang sesuai
        startSlideshow();
        
        // Fix untuk mobile menu
        if (window.innerWidth > 768) {
            const menu = document.getElementById('menu');
            menu.style.display = 'flex';
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
        } else {
            const menu = document.getElementById('menu');
            if (!menu.classList.contains('active')) {
                menu.style.display = 'none';
            }
        }
    }, 250);
});

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', function(e) {
    // Left/Right arrow for slideshow
    if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
    
    // Space bar for video play/pause
    if (e.key === ' ' && video) {
        e.preventDefault();
        togglePlay();
    }
    
    // M key for mute
    if (e.key === 'm' || e.key === 'M') {
        toggleMute();
    }
    
    // F key for fullscreen
    if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.link-btn, .control-btn, .nav-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add parallax effect to floating bubbles
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach((bubble, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        bubble.style.transform = `translateY(${yPos}px)`;
    });
});

// Add notification for keyboard shortcuts
setTimeout(() => {
    if (!localStorage.getItem('shortcutsShown')) {
        console.log('🎮 Keyboard Shortcuts Available:');
        console.log('→ Arrow Keys: Navigate slideshow');
        console.log('→ Space: Play/Pause video');
        console.log('→ M: Mute/Unmute video');
        console.log('→ F: Toggle fullscreen');
        
        // Optional
