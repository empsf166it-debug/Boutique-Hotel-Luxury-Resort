/**
 * AURELLE RETREAT — Boutique Hotel & Luxury Resort
 * Main JavaScript Interactions & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS Animation Library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  /* ==========================================================================
     TOAST NOTIFICATION HELPER (SCOPED GLOBALLY WITHIN DOMContentLoaded)
     ========================================================================== */
  const toast = document.getElementById('luxury-toast');
  const toastMessage = document.getElementById('toast-message');

  const showToast = (message) => {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  };

  /* ==========================================================================
     1. THEME TOGGLE & STICKY HEADER SCROLL DYNAMICS
     ========================================================================== */
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Theme Toggle Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
  const themeSunIcon = document.getElementById('theme-sun-icon');
  const themeMoonIcon = document.getElementById('theme-moon-icon');
  const themeToggleText = document.getElementById('theme-toggle-text');
  const mobileThemeSunIcon = document.getElementById('mobile-theme-sun-icon');
  const mobileThemeMoonIcon = document.getElementById('mobile-theme-moon-icon');
  const mobileThemeText = document.getElementById('mobile-theme-text');

  const updateHeaderScroll = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (window.scrollY > 40) {
      if (isDark) {
        header.classList.add('scrolled-dark');
        header.classList.remove('scrolled-light');
      } else {
        header.classList.add('scrolled-light');
        header.classList.remove('scrolled-dark');
      }
    } else {
      if (isDark) {
        header.classList.add('scrolled-dark');
        header.classList.remove('scrolled-light');
      } else {
        header.classList.remove('scrolled-dark', 'scrolled-light');
      }
    }
  };

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (themeSunIcon) themeSunIcon.classList.remove('hidden');
      if (themeMoonIcon) themeMoonIcon.classList.add('hidden');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to Warm Ivory Light Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Warm Ivory Light Mode');
      }
      if (mobileThemeSunIcon) mobileThemeSunIcon.classList.remove('hidden');
      if (mobileThemeMoonIcon) mobileThemeMoonIcon.classList.add('hidden');
      if (mobileThemeText) mobileThemeText.textContent = 'Light Mode';
      try { localStorage.setItem('aurelle-theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      if (themeSunIcon) themeSunIcon.classList.add('hidden');
      if (themeMoonIcon) themeMoonIcon.classList.remove('hidden');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('title', 'Switch to Deep Forest Dark Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Deep Forest Dark Mode');
      }
      if (mobileThemeSunIcon) mobileThemeSunIcon.classList.add('hidden');
      if (mobileThemeMoonIcon) mobileThemeMoonIcon.classList.remove('hidden');
      if (mobileThemeText) mobileThemeText.textContent = 'Dark Mode';
      try { localStorage.setItem('aurelle-theme', 'light'); } catch (e) {}
    }
    updateHeaderScroll();
  };

  // Initialize theme from storage or system preference
  let initialDark = false;
  try {
    const saved = localStorage.getItem('aurelle-theme');
    if (saved === 'dark') {
      initialDark = true;
    } else if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialDark = true;
    }
  } catch (e) {}

  applyTheme(initialDark);

  const toggleTheme = () => {
    const currentlyDark = document.documentElement.classList.contains('dark');
    applyTheme(!currentlyDark);
    showToast(!currentlyDark ? "Deep Forest Dark Mode Activated." : "Warm Ivory Light Mode Activated.");
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  // Active navigation highlight with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const updateActiveNavLink = (id) => {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active-nav');
      } else {
        link.classList.remove('active-nav');
      }
    });

    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('mobile-active-nav');
      } else {
        link.classList.remove('mobile-active-nav');
      }
    });
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveNavLink(id);
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const openMobileMenu = () => {
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    document.body.style.overflow = '';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }
  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        updateActiveNavLink(href.substring(1));
      }
      closeMobileMenu();
    });
  });

  // Close mobile drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. ROOM SHOWCASE & RESERVATION SYNC
     ========================================================================== */
  const roomSelect = document.getElementById('room-preference');
  const roomButtons = document.querySelectorAll('.room-select-trigger');

  roomButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomValue = btn.getAttribute('data-room');
      if (roomSelect && roomValue) {
        roomSelect.value = roomValue;
        // Trigger change event to update summary
        const event = new Event('change');
        roomSelect.dispatchEvent(event);
      }
      
      const reservationSection = document.getElementById('reservation');
      if (reservationSection) {
        reservationSection.scrollIntoView({ behavior: 'smooth' });
        // Subtle focus highlight on select element
        setTimeout(() => {
          roomSelect.focus();
          roomSelect.classList.add('ring-2', 'ring-amber-500');
          setTimeout(() => roomSelect.classList.remove('ring-2', 'ring-amber-500'), 1500);
        }, 700);
      }
    });
  });

  /* ==========================================================================
     4. CURATED EXPERIENCES INTERACTIVE SELECTOR
     ========================================================================== */
  const experienceData = [
    {
      id: 0,
      title: "Sunrise Yoga & Mindful Mornings",
      label: "Morning Awakening",
      time: "06:30 – 08:00 AM · Ocean Pavillion",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      desc: "Greet the dawn above the tranquil horizon with guided breathwork and restorative Hatha movement led by our resident wellness masters. Complete your awakening with cold-pressed botanical tonics and herbal infusions.",
      highlights: ["Open-air cantilevered teak deck", "Sound healing with Tibetan singing bowls", "Bespoke organic breakfast tasting"]
    },
    {
      id: 1,
      title: "Private Dining Under the Stars",
      label: "Gastronomic Escape",
      time: "07:30 – 10:30 PM · Secluded Cove",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
      desc: "An exclusive cliffside sanctuary reserved entirely for you. Indulge in an bespoke five-course degustation menu prepared by your private chef, paired with rare estate vintages beneath the Balearic constellations.",
      highlights: ["Private sommelier and dedicated butler", "Bespoke seafood and botanical menu", "Acoustic cello accompaniment available"]
    },
    {
      id: 2,
      title: "Guided Heritage & Cultural Discoveries",
      label: "Local Terroir",
      time: "09:30 AM – 01:00 PM · Historic Hamlet",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
      desc: "Venture beyond the retreat in our private vintage Land Rover to explore century-old olive groves, artisan ceramic ateliers, and hidden coastal monasteries with our knowledgeable cultural curator.",
      highlights: ["Private access to historic stone estates", "Artisan olive oil & honey tasting", "Chauffeured scenic transportation"]
    },
    {
      id: 3,
      title: "Scenic Coastal Nature Walks & Foraging",
      label: "Untamed Beauty",
      time: "08:00 – 11:00 AM · Coastal Cliffs",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85",
      desc: "Trace ancient maritime footpaths carved into dramatic limestone cliffs. Learn to identify wild maritime rosemary, sea fennel, and rock samphire with our resident botanist followed by a secluded cove swim.",
      highlights: ["Spectacular cliffside panoramic vistas", "Guided flora identification", "Gourmet picnic hamper in secluded cove"]
    },
    {
      id: 4,
      title: "Thermal Spa & Ancient Relaxation Rituals",
      label: "Restorative Calm",
      time: "Available Daily · Spa Sanctuary",
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=85",
      desc: "Immerse yourself in centuries-old thermal hydrotherapy, volcanic basalt stone massage, and botanical body polishes using cold-pressed almonds, sea salt, and wild mountain lavender harvested from our retreat gardens.",
      highlights: ["Heated mineral salt hydrotherapy pools", "Private cedar sauna and ice rain suites", "Personalized aromatic oil blending"]
    },
    {
      id: 5,
      title: "Sunset Terrace Aperitivo & Celestial Viewing",
      label: "Golden Hour",
      time: "06:00 – 08:30 PM · Upper Mirador",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
      desc: "As twilight paints the Mediterranean in shades of rose and amber, savor handcrafted botanical mocktails and biodynamic reserve aperitifs, followed by deep stargazing through our high-powered celestial telescope.",
      highlights: ["Unobstructed 180° sunset panoramic views", "Artisan local cheeses and wild tapas", "Astronomer-guided constellation mapping"]
    }
  ];

  const expButtons = document.querySelectorAll('.exp-tab-btn');
  const expImage = document.getElementById('exp-featured-img');
  const expTitle = document.getElementById('exp-featured-title');
  const expLabel = document.getElementById('exp-featured-label');
  const expTime = document.getElementById('exp-featured-time');
  const expDesc = document.getElementById('exp-featured-desc');
  const expHighlights = document.getElementById('exp-featured-highlights');

  if (expButtons.length && expImage) {
    expButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const data = experienceData[index];

        expButtons.forEach(b => b.classList.remove('active', 'border-champagne-gold', 'bg-[#F2EDE4]'));
        btn.classList.add('active', 'border-champagne-gold', 'bg-[#F2EDE4]');

        // Fade transition
        expImage.style.opacity = '0.3';
        expImage.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
          expImage.src = data.image;
          expImage.alt = data.title;
          expTitle.textContent = data.title;
          expLabel.textContent = data.label;
          expTime.textContent = data.time;
          expDesc.textContent = data.desc;
          
          if (expHighlights) {
            expHighlights.innerHTML = data.highlights.map(item => `
              <li class="flex items-center text-sm text-[#77766F]">
                <svg class="w-4 h-4 mr-2.5 text-[#C5A46D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${item}</span>
              </li>
            `).join('');
          }

          expImage.style.opacity = '1';
          expImage.style.transform = 'scale(1)';
        }, 220);
      });
    });
  }

  /* ==========================================================================
     5. DINING MENU TABS
     ========================================================================== */
  const menuTabs = document.querySelectorAll('.menu-tab-btn');
  const menuPanels = document.querySelectorAll('.menu-panel');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetMenu = tab.getAttribute('data-target');

      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      menuPanels.forEach(panel => {
        if (panel.id === targetMenu) {
          panel.classList.remove('hidden');
          panel.classList.add('block');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('block');
        }
      });
    });
  });

  /* ==========================================================================
     6. RESORT GALLERY & LIGHTBOX
     ========================================================================== */
  const galleryItems = [
    {
      src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
      title: "Resort Facade & Illuminated Reflection Pool at Dusk",
      category: "architecture",
      categoryName: "Architecture"
    },
    {
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85",
      title: "Panoramic Suite Living Space Overlooking the Sea",
      category: "suites",
      categoryName: "Suites"
    },
    {
      src: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1400&q=85",
      title: "Cliffside Infinity Pool & Sunken Daybeds",
      category: "wellness",
      categoryName: "Pool & Wellness"
    },
    {
      src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85",
      title: "Thermal Stone Hydrotherapy & Herbal Aromatherapy",
      category: "wellness",
      categoryName: "Wellness"
    },
    {
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85",
      title: "Candlelit Tasting Terrace at L'Archipel",
      category: "dining",
      categoryName: "Dining"
    },
    {
      src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
      title: "Architectural Travertine Archways & Shadow Geometry",
      category: "architecture",
      categoryName: "Architecture"
    },
    {
      src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=85",
      title: "Botanical Walkways Leading to Private Cove",
      category: "architecture",
      categoryName: "Grounds"
    },
    {
      src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1400&q=85",
      title: "Sunset Horizon Terrace & Mirador",
      category: "suites",
      categoryName: "Sanctuary"
    }
  ];

  // Gallery Filtering
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryDOMItems = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#24372D]', 'text-[#F8F5EF]');
        b.classList.add('text-[#77766F]', 'hover:text-[#242622]');
      });
      btn.classList.add('bg-[#24372D]', 'text-[#F8F5EF]');
      btn.classList.remove('text-[#77766F]', 'hover:text-[#242622]');

      galleryDOMItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Lightbox Implementation
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentLightboxIndex = 0;

  const updateLightboxContent = (index) => {
    currentLightboxIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentLightboxIndex];

    lightboxImg.style.opacity = '0.3';
    lightboxImg.style.transform = 'scale(0.96)';

    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      lightboxCaption.textContent = item.title;
      lightboxCategory.textContent = item.categoryName;
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryItems.length}`;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 180);
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryDOMItems.forEach((card, index) => {
    card.addEventListener('click', () => {
      const imgIndex = parseInt(card.getAttribute('data-gallery-index'), 10);
      openLightbox(isNaN(imgIndex) ? index : imgIndex);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => updateLightboxContent(currentLightboxIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => updateLightboxContent(currentLightboxIndex + 1));

  // Lightbox Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxContent(currentLightboxIndex - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentLightboxIndex + 1);
  });

  // Close when clicking backdrop
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'lightbox-backdrop') {
        closeLightbox();
      }
    });
  }

  /* ==========================================================================
     7. TESTIMONIALS SLIDER
     ========================================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevSlideBtn = document.getElementById('testi-prev');
  const nextSlideBtn = document.getElementById('testi-next');
  const dotsContainer = document.getElementById('testi-dots');
  let currentSlide = 0;
  let slideInterval = null;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.remove('hidden', 'opacity-0');
        slide.classList.add('block', 'opacity-100');
      } else {
        slide.classList.add('hidden', 'opacity-0');
        slide.classList.remove('block', 'opacity-100');
      }
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.testi-dot');
      dots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.classList.add('bg-[#C5A46D]', 'w-8');
          dot.classList.remove('bg-[#D9CCB8]', 'w-2.5');
        } else {
          dot.classList.remove('bg-[#C5A46D]', 'w-8');
          dot.classList.add('bg-[#D9CCB8]', 'w-2.5');
        }
      });
    }
  };

  if (slides.length > 0) {
    // Generate dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `testi-dot h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[#C5A46D] w-8' : 'bg-[#D9CCB8] w-2.5'}`;
        dot.setAttribute('aria-label', `Navigate to testimonial ${i + 1}`);
        dot.addEventListener('click', () => {
          showSlide(i);
          resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
      });
    }

    if (prevSlideBtn) {
      prevSlideBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetAutoSlide();
      });
    }

    if (nextSlideBtn) {
      nextSlideBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetAutoSlide();
      });
    }

    // Auto-advance
    const startAutoSlide = () => {
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 8000);
    };

    const resetAutoSlide = () => {
      clearInterval(slideInterval);
      startAutoSlide();
    };

    startAutoSlide();

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;
    const testiContainer = document.getElementById('testimonials-container');

    if (testiContainer) {
      testiContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      testiContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 45) {
          showSlide(currentSlide + 1);
          resetAutoSlide();
        } else if (touchEndX - touchStartX > 45) {
          showSlide(currentSlide - 1);
          resetAutoSlide();
        }
      }, { passive: true });
    }
  }

  /* ==========================================================================
     8. RESERVATION ENQUIRY & STAY PLANNER
     ========================================================================== */
  const checkInInput = document.getElementById('check-in-date');
  const checkOutInput = document.getElementById('check-out-date');
  const adultsInput = document.getElementById('adults-count');
  const childrenInput = document.getElementById('children-count');
  const formRoomSelect = document.getElementById('room-preference');
  const reservationForm = document.getElementById('reservation-form');

  // Summary elements
  const summaryRoomName = document.getElementById('summary-room-name');
  const summaryRoomRate = document.getElementById('summary-room-rate');
  const summaryNights = document.getElementById('summary-nights');
  const summaryDates = document.getElementById('summary-dates');
  const summaryGuests = document.getElementById('summary-guests');
  const summaryTotal = document.getElementById('summary-total');
  const summaryRoomThumb = document.getElementById('summary-room-thumb');

  const roomRates = {
    'signature-deluxe': { name: 'Signature Deluxe Room', rate: 620, img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80' },
    'garden-suite': { name: 'Garden Suite', rate: 850, img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80' },
    'panoramic-suite': { name: 'Panoramic Suite', rate: 1150, img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80' },
    'private-pool-villa': { name: 'Private Pool Villa', rate: 2400, img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80' },
    'undecided': { name: 'Curated Suite Recommendation', rate: 850, img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80' }
  };

  // Configure min date for check-in to today
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  if (checkInInput) {
    checkInInput.min = todayStr;
    
    // Set default check-in to tomorrow and check-out to 4 days later
    const defaultCheckIn = new Date();
    defaultCheckIn.setDate(today.getDate() + 1);
    const defaultCheckInStr = defaultCheckIn.toISOString().split('T')[0];
    
    const defaultCheckOut = new Date();
    defaultCheckOut.setDate(today.getDate() + 4);
    const defaultCheckOutStr = defaultCheckOut.toISOString().split('T')[0];
    
    checkInInput.value = defaultCheckInStr;
    if (checkOutInput) {
      checkOutInput.min = defaultCheckInStr;
      checkOutInput.value = defaultCheckOutStr;
    }
  }

  const updateStaySummary = () => {
    if (!checkInInput || !checkOutInput || !formRoomSelect) return;

    const inDateVal = checkInInput.value;
    const outDateVal = checkOutInput.value;
    const roomKey = formRoomSelect.value || 'panoramic-suite';
    const roomInfo = roomRates[roomKey] || roomRates['panoramic-suite'];
    const adults = adultsInput ? parseInt(adultsInput.value, 10) || 2 : 2;
    const children = childrenInput ? parseInt(childrenInput.value, 10) || 0 : 0;

    let nights = 3;
    if (inDateVal && outDateVal) {
      const d1 = new Date(inDateVal);
      const d2 = new Date(outDateVal);
      const diffTime = d2 - d1;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      nights = diffDays > 0 ? diffDays : 1;
    }

    if (summaryRoomName) summaryRoomName.textContent = roomInfo.name;
    if (summaryRoomRate) summaryRoomRate.textContent = `$${roomInfo.rate.toLocaleString()} / night`;
    if (summaryNights) summaryNights.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
    if (summaryRoomThumb) summaryRoomThumb.src = roomInfo.img;

    if (summaryDates) {
      if (inDateVal && outDateVal) {
        const d1 = new Date(inDateVal + 'T00:00:00');
        const d2 = new Date(outDateVal + 'T00:00:00');
        const opts = { month: 'short', day: 'numeric', year: 'numeric' };
        summaryDates.textContent = `${d1.toLocaleDateString('en-US', opts)} — ${d2.toLocaleDateString('en-US', opts)}`;
      } else {
        summaryDates.textContent = 'Dates to be selected';
      }
    }

    if (summaryGuests) {
      summaryGuests.textContent = `${adults} ${adults === 1 ? 'Adult' : 'Adults'}${children > 0 ? `, ${children} ${children === 1 ? 'Child' : 'Children'}` : ''}`;
    }

    if (summaryTotal) {
      const totalCost = nights * roomInfo.rate;
      summaryTotal.textContent = `$${totalCost.toLocaleString()} USD`;
    }
  };

  // Date Change Handler: ensure checkout is strictly after checkin
  if (checkInInput && checkOutInput) {
    checkInInput.addEventListener('change', () => {
      const inDate = new Date(checkInInput.value);
      if (!isNaN(inDate.getTime())) {
        const nextDay = new Date(inDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const minOutStr = nextDay.toISOString().split('T')[0];
        checkOutInput.min = minOutStr;

        const currentOutDate = new Date(checkOutInput.value);
        if (isNaN(currentOutDate.getTime()) || currentOutDate <= inDate) {
          checkOutInput.value = minOutStr;
        }
      }
      updateStaySummary();
    });

    checkOutInput.addEventListener('change', () => {
      const inDate = new Date(checkInInput.value);
      const outDate = new Date(checkOutInput.value);
      if (outDate <= inDate) {
        const nextDay = new Date(inDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.value = nextDay.toISOString().split('T')[0];
      }
      updateStaySummary();
    });
  }

  [formRoomSelect, adultsInput, childrenInput].forEach(elem => {
    if (elem) elem.addEventListener('change', updateStaySummary);
  });

  // Run initial summary calculation
  updateStaySummary();

  // Form Validation and Accessible Demo Submission
  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fullNameInput = document.getElementById('full-name');
      const emailInput = document.getElementById('email-address');

      // Clear existing errors
      document.querySelectorAll('.error-text').forEach(el => el.classList.remove('visible'));
      document.querySelectorAll('.form-input-luxury').forEach(el => el.classList.remove('is-invalid'));

      // Validate Full Name
      if (!fullNameInput.value.trim()) {
        isValid = false;
        fullNameInput.classList.add('is-invalid');
        const err = document.getElementById('error-full-name');
        if (err) err.classList.add('visible');
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        isValid = false;
        emailInput.classList.add('is-invalid');
        const err = document.getElementById('error-email');
        if (err) err.classList.add('visible');
      }

      // Validate Dates
      if (!checkInInput.value) {
        isValid = false;
        checkInInput.classList.add('is-invalid');
      }
      if (!checkOutInput.value) {
        isValid = false;
        checkOutInput.classList.add('is-invalid');
      }

      if (!isValid) {
        const firstInvalid = reservationForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Generate Reference Code
      const refCode = `AUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const roomKey = formRoomSelect.value || 'panoramic-suite';
      const roomInfo = roomRates[roomKey] || roomRates['panoramic-suite'];

      // Populate Success Modal
      const modalRef = document.getElementById('modal-ref-code');
      const modalGuest = document.getElementById('modal-guest-name');
      const modalRoom = document.getElementById('modal-room-type');
      const modalDates = document.getElementById('modal-stay-dates');
      const modalSuccess = document.getElementById('enquiry-success-modal');

      if (modalRef) modalRef.textContent = refCode;
      if (modalGuest) modalGuest.textContent = fullNameInput.value.trim();
      if (modalRoom) modalRoom.textContent = roomInfo.name;
      if (modalDates && summaryDates) modalDates.textContent = summaryDates.textContent;

      if (modalSuccess) {
        modalSuccess.classList.remove('hidden');
        modalSuccess.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }

      reservationForm.reset();
      updateStaySummary();
    });
  }

  // Close Success Modal
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalSuccess = document.getElementById('enquiry-success-modal');
  if (modalCloseBtn && modalSuccess) {
    modalCloseBtn.addEventListener('click', () => {
      modalSuccess.classList.add('hidden');
      modalSuccess.classList.remove('flex');
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     9. NEWSLETTER SUBSCRIPTION & TOAST NOTIFICATION
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && emailPattern.test(email.value.trim())) {
        showToast("Thank you. You have been added to our private journal correspondence.");
        newsletterForm.reset();
      } else if (email) {
        showToast("Please enter a valid email address.");
      }
    });
  }

  /* ==========================================================================
     10. TERMS & PRIVACY MODAL
     ========================================================================== */
  const privacyLinks = document.querySelectorAll('.privacy-modal-trigger');
  const termsModal = document.getElementById('legal-modal');
  const legalModalClose = document.getElementById('legal-modal-close');

  privacyLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (termsModal) {
        termsModal.classList.remove('hidden');
        termsModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (legalModalClose && termsModal) {
    legalModalClose.addEventListener('click', () => {
      termsModal.classList.add('hidden');
      termsModal.classList.remove('flex');
      document.body.style.overflow = '';
    });
  }

  /* ==========================================================================
     11. AMBIENT AUDIO SOUNDSCAPE SYNTHESIZER (WEB AUDIO API)
     ========================================================================== */
  const soundToggle = document.getElementById('soundscape-toggle');
  let audioCtx = null;
  let isSoundPlaying = false;
  let masterGain = null;
  let noiseNode = null;
  let osc1 = null;
  let osc2 = null;

  const initAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // Create gentle sea surf noise buffer
      const bufferSize = audioCtx.sampleRate * 4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brownian pinkish noise filter
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 2.5;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      // Filter noise to sound like soothing ocean waves
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, audioCtx.currentTime);

      // Gentle LFO modulating the wave filter frequency
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // 8 second wave cycle
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(140, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      noiseNode.connect(filter);
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      filter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseNode.start();

      // Warm harmonic sine drone for calm meditative ambiance
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, audioCtx.currentTime); // A2 note
      const oscGain1 = audioCtx.createGain();
      oscGain1.gain.setValueAtTime(0.015, audioCtx.currentTime);
      osc1.connect(oscGain1);
      oscGain1.connect(masterGain);
      osc1.start();

      osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(164.81, audioCtx.currentTime); // E3 fifth
      const oscGain2 = audioCtx.createGain();
      oscGain2.gain.setValueAtTime(0.01, audioCtx.currentTime);
      osc2.connect(oscGain2);
      oscGain2.connect(masterGain);
      osc2.start();

    } catch (err) {
      console.warn("Audio synthesis not supported or prevented by browser policy", err);
    }
  };

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (!audioCtx) {
        initAudio();
      }

      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (!isSoundPlaying) {
        if (masterGain && audioCtx) {
          masterGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 1.2);
        }
        isSoundPlaying = true;
        soundToggle.classList.add('sound-playing');
        soundToggle.setAttribute('aria-label', 'Mute ambient sanctuary soundscape');
        showToast("Ambient coastal soundscape playing. Relax & enjoy.");
      } else {
        if (masterGain && audioCtx) {
          masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        }
        isSoundPlaying = false;
        soundToggle.classList.remove('sound-playing');
        soundToggle.setAttribute('aria-label', 'Play ambient sanctuary soundscape');
      }
    });
  }

  /* ==========================================================================
     12. BACK TO TOP SCROLL BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
