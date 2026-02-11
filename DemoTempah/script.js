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

// SLIDESHOW FUNCTIONALITY
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
const currentSlideElement = document.querySelector('.current-slide');
const totalSlidesElement = document.querySelector('.total-slides');

// Initialize slideshow
function initSlideshow() {
    totalSlidesElement.textContent = totalSlides;
    updateSlideCounter();
    
    // Auto slide every 5 seconds
    setInterval(() => {
        nextSlide();
    }, 5000);
}

// Change slide
function changeSlide(slideIndex) {
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
});

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', initSlideshow);

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
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function toggleMute() {
    video.muted = !video.muted;
    updateMuteButton();
}

function updateMuteButton() {
    const muteBtn = document.querySelector('[onclick="toggleMute()"]');
    const icon = muteBtn.querySelector('.control-icon');
    icon.textContent = video.muted ? '🔇' : '🔊';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        const videoWrapper = document.querySelector('.video-wrapper');
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

// Click to play on video overlay
document.querySelector('.video-overlay').addEventListener('click', togglePlay);

// Update play/pause on video
video.addEventListener('play', function() {
    document.querySelector('.play-btn').style.display = 'none';
});

video.addEventListener('pause', function() {
    document.querySelector('.play-btn').style.display = 'flex';
});

// SCROLL EVENT LISTENERS
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    animateSectionsOnScroll();
});

// Initial animations
window.addEventListener('load', () => {
    animateSectionsOnScroll();
    
    // Add animation delay to each section
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section, index) => {
        section.style.transitionDelay = `${index * 0.2}s`;
    });
});

// RESIZE HANDLER
window.addEventListener('resize', function() {
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
    if (e.key === ' ' && document.querySelector('video')) {
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

// Add hover effect to all interactive elements
document.querySelectorAll('a, button, .kenali-item, .link-card').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transition = 'var(--transition)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transition = 'var(--transition)';
    });
});

// Initialize mute button text
if (video) {
    updateMuteButton();
}

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

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

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
        
        // Optional: Show a subtle toast notification
        const toast = document.createElement('div');
        toast.textContent = '🎮 Keyboard shortcuts enabled!';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--brown-medium);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        localStorage.setItem('shortcutsShown', 'true');
    }
}, 2000);

// Add animation for scroll to top button
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
    opacity: 0.9;
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

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.display = 'flex';
        setTimeout(() => {
            scrollToTopBtn.style.opacity = '0.9';
        }, 10);
    } else {
        scrollToTopBtn.style.opacity = '0';
        setTimeout(() => {
            scrollToTopBtn.style.display = 'none';
        }, 300);
    }
});
