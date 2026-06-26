/* ==========================================================================
   MIVIDOOR INTERACTIVE JAVASCRIPT
   Description: Core interactivity, Hero Slider, Nav toggles, Scroll Reveal
   Author: Antigravity AI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. STICKY HEADER & SCROLL STATE
       -------------------------------------------------------------------------- */
    const header = document.querySelector('.site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check on load
    handleScroll();

    /* --------------------------------------------------------------------------
       2. HERO SLIDER (CAROUSEL)
       -------------------------------------------------------------------------- */
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 6000; // 6 seconds per slide

    // Generate dots dynamically to ensure perfect match
    if (slides.length > 0 && dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.setAttribute('data-slide', idx);
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.slider-dots .dot');

    const goToSlide = (index) => {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        if (dots.length > 0) dots[currentSlide].classList.remove('active');
        
        // Update current index
        currentSlide = (index + slides.length) % slides.length;
        
        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        if (dots.length > 0) dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        goToSlide(currentSlide + 1);
    };

    const startSlideShow = () => {
        stopSlideShow();
        slideInterval = setInterval(nextSlide, slideDuration);
    };

    const stopSlideShow = () => {
        if (slideInterval) clearInterval(slideInterval);
    };

    // Dot navigation events
    if (dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-slide'));
                goToSlide(targetIndex);
                startSlideShow(); // Reset interval
            });
        });
    }

    // Initialize slideshow
    if (slides.length > 0) {
        startSlideShow();
    }

    /* --------------------------------------------------------------------------
       3. SEARCH OVERLAY TOGGLE
       -------------------------------------------------------------------------- */
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchOverlay && searchClose) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active')) {
                searchInput.focus();
            }
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        // Close search when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchOverlay.classList.remove('active');
            }
        });
    }

    /* --------------------------------------------------------------------------
       4. MOBILE NAVIGATION DRAWER
       -------------------------------------------------------------------------- */
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
    
    if (hamburger && mobileDrawer && drawerOverlay) {
        const toggleDrawer = () => {
            const isActive = mobileDrawer.classList.contains('active');
            hamburger.classList.toggle('active', !isActive);
            mobileDrawer.classList.toggle('active', !isActive);
            drawerOverlay.classList.toggle('active', !isActive);
            document.body.style.overflow = isActive ? '' : 'hidden'; // Lock background scroll
        };

        hamburger.addEventListener('click', toggleDrawer);
        drawerOverlay.addEventListener('click', toggleDrawer);

        // Close mobile drawer on navigation click
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            // Only close if it's not a dropdown header toggle
            if (!link.closest('.mobile-dropdown')) {
                link.addEventListener('click', toggleDrawer);
            }
        });
    }

    // Mobile Drawer Dropdowns
    const mobileDropdownBtn = document.querySelector('.mobile-dropdown-toggle');
    const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');

    if (mobileDropdownBtn && mobileDropdownMenu) {
        mobileDropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileDropdownBtn.classList.toggle('active');
            mobileDropdownMenu.classList.toggle('active');
        });
    }

    /* --------------------------------------------------------------------------
       5. SCROLL REVEAL (Intersection Observer)
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    /* --------------------------------------------------------------------------
       6. WORK PROCESS STEPPER LINE ANIMATION
       -------------------------------------------------------------------------- */
    const processSection = document.querySelector('.section-process');
    const processLineProgress = document.querySelector('.process-line-progress');
    const stepItems = document.querySelectorAll('.step-item');

    if (processSection && processLineProgress) {
        const animateProcess = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Check window width to determine direction
                    if (window.innerWidth > 991) {
                        processLineProgress.style.width = '100%';
                    } else {
                        processLineProgress.style.height = '100%';
                    }
                    
                    // Cascade activation of step items
                    stepItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('active');
                        }, index * 250); // Stagger steps delay
                    });
                    
                    observer.unobserve(processSection);
                }
            });
        };

        const processObserver = new IntersectionObserver(animateProcess, {
            root: null,
            threshold: 0.25
        });

        processObserver.observe(processSection);
    }

    /* --------------------------------------------------------------------------
       7. AUTOMATIC EVENT SLIDESHOW (CROSS-FADE)
       -------------------------------------------------------------------------- */
    const slideshows = document.querySelectorAll('.event-slideshow');
    
    slideshows.forEach(slideshow => {
        const imgs = slideshow.querySelectorAll('.project-img');
        if (imgs.length <= 1) return;
        
        let activeIdx = 0;
        
        setInterval(() => {
            // Remove active class from current image
            imgs[activeIdx].classList.remove('active');
            
            // Increment index
            activeIdx = (activeIdx + 1) % imgs.length;
            
            // Add active class to new image
            imgs[activeIdx].classList.add('active');
        }, 3500); // Cycle every 3.5 seconds
    });

    /* --------------------------------------------------------------------------
       8. STATS COUNTER ANIMATION
       -------------------------------------------------------------------------- */
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statsSection && statNumbers.length > 0) {
        const animateStats = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        const suffix = stat.getAttribute('data-suffix') || '';
                        const duration = 2000; // 2 seconds animation
                        const startTime = performance.now();

                        const updateCount = (currentTime) => {
                            const elapsedTime = currentTime - startTime;
                            if (elapsedTime >= duration) {
                                // Final value formatting
                                if (target >= 1000) {
                                    stat.textContent = target.toLocaleString('vi-VN') + suffix;
                                } else {
                                    stat.textContent = target + suffix;
                                }
                            } else {
                                const progress = elapsedTime / duration;
                                // Ease out cubic for smoother slow down
                                const easeProgress = 1 - Math.pow(1 - progress, 3);
                                const currentValue = Math.floor(easeProgress * target);
                                
                                if (currentValue >= 1000) {
                                    stat.textContent = currentValue.toLocaleString('vi-VN') + suffix;
                                } else {
                                    stat.textContent = currentValue + suffix;
                                }
                                requestAnimationFrame(updateCount);
                            }
                        };
                        requestAnimationFrame(updateCount);
                    });
                    
                    observer.unobserve(statsSection);
                }
            });
        };

        const statsObserver = new IntersectionObserver(animateStats, {
            root: null,
            threshold: 0.2
        });

        statsObserver.observe(statsSection);
    }

    /* --------------------------------------------------------------------------
       9. GOOGLE MAP SCROLL-ZOOM HELPER
       -------------------------------------------------------------------------- */
    const mapContainer = document.querySelector('.contact-map-container');
    if (mapContainer) {
        const iframe = mapContainer.querySelector('iframe');
        if (iframe) {
            mapContainer.addEventListener('click', () => {
                iframe.style.pointerEvents = 'auto';
            });
            mapContainer.addEventListener('mouseleave', () => {
                iframe.style.pointerEvents = 'none';
            });
        }
    }
});

