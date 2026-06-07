document.addEventListener('DOMContentLoaded', () => {
    // ==================== COMMON LAYOUT SCRIPTS ====================
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav .nav-link');

    // Function to update icon visibility
    function updateIcons() {
        if (!sunIcon || !moonIcon) return;
        if (document.body.classList.contains('light-mode')) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // Initialize icons on load
    updateIcons();

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            updateIcons();

            // Save choice in localStorage
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Mobile Menu Interactivity
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('open');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('open');
            }
        });
    }

    // Close menu when a link is clicked
    if (navLinks && mobileMenuToggle && mainNav) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('open');
            });
        });
    }

    // ==================== INDEX PAGE: SCROLL & GALLERY ====================
    const sections = document.querySelectorAll('main, section');
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id') || '';
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Interactive Gallery & Slideshow for Profil Instansi (PT. APPKEY Office)
    const mainMediaImg = document.querySelector('#company .main-media-img');
    const thumbCards = document.querySelectorAll('#company .thumb-card');
    if (mainMediaImg && thumbCards.length > 0) {
        let currentIndex = 0;
        let autoplayTimer = null;

        function showImage(index) {
            const card = thumbCards[index];
            const img = card.querySelector('.thumb-img');
            if (!img) return;

            // Add fade-out transition effect
            mainMediaImg.style.opacity = 0;

            setTimeout(() => {
                mainMediaImg.src = img.src;
                mainMediaImg.alt = img.alt;
                // Fade back in
                mainMediaImg.style.opacity = 1;
            }, 200);

            // Update active state
            thumbCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            currentIndex = index;
        }

        function startAutoplay() {
            autoplayTimer = setInterval(() => {
                let nextIndex = (currentIndex + 1) % thumbCards.length;
                showImage(nextIndex);
            }, 2000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        // Add manual click event to thumbnails
        thumbCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                showImage(index);
                resetAutoplay();
            });
        });

        // Initialize slideshow
        startAutoplay();
    }

    // ==================== PROJECTS PAGE: AUTO SLIDER ====================
    const sliders = document.querySelectorAll('.project-item-screens');
    if (sliders.length > 0) {
        sliders.forEach(slider => {
            let autoplayInterval = null;

            function startAutoplay() {
                autoplayInterval = setInterval(() => {
                    const maxScroll = slider.scrollWidth - slider.clientWidth;
                    if (maxScroll <= 0) return;

                    const firstCard = slider.querySelector('.browser-mockup');
                    if (!firstCard) return;

                    // Width of one card + its gap dynamically calculated
                    const style = window.getComputedStyle(slider);
                    const gap = parseFloat(style.gap) || 24;
                    const cardWidth = firstCard.clientWidth + gap;

                    let newScrollLeft = slider.scrollLeft + cardWidth;

                    // If we reach the end, scroll back to 0
                    if (newScrollLeft >= maxScroll + 10) {
                        newScrollLeft = 0;
                    }

                    slider.scrollTo({
                        left: newScrollLeft,
                        behavior: 'smooth'
                    });
                }, 3000); // Slide every 3 seconds
            }

            function stopAutoplay() {
                clearInterval(autoplayInterval);
            }

            // Start autoplay initially
            startAutoplay();

            // Pause autoplay when hovering or touching, so it doesn't fight manual scroll
            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
            slider.addEventListener('touchstart', stopAutoplay, { passive: true });
            slider.addEventListener('touchend', startAutoplay);
        });
    }
});
