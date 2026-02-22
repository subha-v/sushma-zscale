/**
 * zScale - Dark Theme JavaScript
 * Mobile menu, smooth scroll, header effects, scroll animations
 */

'use strict';

// ===========================================
// DOM READY
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initTabs();
    initPreviewSearch();
    initDemoForm();
});

// ===========================================
// MOBILE MENU
// ===========================================
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (!mobileMenuToggle || !mobileNav) return;

    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Toggle states
        this.setAttribute('aria-expanded', !isExpanded);
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (!isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active') &&
            !mobileNav.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// ===========================================
// SMOOTH SCROLL
// ===========================================
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Get header height for offset
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;

                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jumping
                history.pushState(null, '', href);
            }
        });
    });
}

// ===========================================
// HEADER SCROLL BEHAVIOR
// ===========================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleHeaderScroll(header);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    handleHeaderScroll(header);
}

function handleHeaderScroll(header) {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class based on scroll position
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ===========================================
// SCROLL ANIMATIONS (Fade-in on scroll)
// ===========================================
function initScrollAnimations() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Make all sections visible immediately
        document.querySelectorAll('section').forEach(function(section) {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
        return;
    }

    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all sections
        document.querySelectorAll('section').forEach(function(section) {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections except hero (hero should be visible immediately)
    document.querySelectorAll('section:not(.hero)').forEach(function(section) {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Also animate cards with staggered delay
    const animatedElements = document.querySelectorAll('.stat-card, .audience-card, .feature-card, .step-card');

    animatedElements.forEach(function(el, index) {
        el.style.transitionDelay = (index % 3) * 0.1 + 's';
    });
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// ===========================================
// TICKER PAUSE ON TOUCH DEVICES
// ===========================================
(function() {
    const ticker = document.querySelector('.data-ticker');
    if (!ticker) return;

    // Pause ticker when user touches it on mobile
    ticker.addEventListener('touchstart', function() {
        const track = this.querySelector('.ticker-track');
        if (track) {
            track.style.animationPlayState = 'paused';
        }
    }, { passive: true });

    ticker.addEventListener('touchend', function() {
        const track = this.querySelector('.ticker-track');
        if (track) {
            // Resume after a short delay
            setTimeout(function() {
                track.style.animationPlayState = 'running';
            }, 1000);
        }
    }, { passive: true });
})();

// ===========================================
// TABS FUNCTIONALITY
// ===========================================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons
            tabButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });

            // Remove active class from all panels
            tabPanels.forEach(function(panel) {
                panel.classList.remove('active');
            });

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding panel
            const targetPanel = document.getElementById('tab-' + tabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Handle keyboard navigation
    tabButtons.forEach(function(button, index) {
        button.addEventListener('keydown', function(e) {
            let newIndex;

            if (e.key === 'ArrowRight') {
                newIndex = (index + 1) % tabButtons.length;
            } else if (e.key === 'ArrowLeft') {
                newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            } else {
                return;
            }

            tabButtons[newIndex].focus();
            tabButtons[newIndex].click();
        });
    });
}

// ===========================================
// PREVIEW PAGE - SAMPLE BUSINESS DATA
// ===========================================
var sampleBusinesses = [
    // Manufacturing - Travis County
    { id: 1, name: "Precision Components Inc", address: "4521 Industrial Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78744", industry: "manufacturing", industryName: "Precision Turned Product Manufacturing", naics: "332721", status: "Active", founded: "2015" },
    { id: 2, name: "Austin Metal Works LLC", address: "8920 E Ben White Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78741", industry: "manufacturing", industryName: "Metal Stamping", naics: "332116", status: "Active", founded: "2008" },
    { id: 3, name: "Lone Star Fabrication", address: "3100 Industrial Terrace", city: "Austin", county: "Travis", state: "TX", zip: "78758", industry: "manufacturing", industryName: "Fabricated Structural Metal Manufacturing", naics: "332312", status: "Active", founded: "2012" },
    { id: 4, name: "Capitol City Plastics", address: "7650 Airport Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78752", industry: "manufacturing", industryName: "Plastics Product Manufacturing", naics: "326199", status: "Active", founded: "2010" },
    { id: 5, name: "TechForm Industries", address: "12400 N Lamar Blvd", city: "Austin", county: "Travis", state: "TX", zip: "78753", industry: "manufacturing", industryName: "Machine Shops", naics: "332710", status: "Active", founded: "2017" },

    // Healthcare - Travis County
    { id: 6, name: "Austin Regional Medical Group", address: "1201 W 38th St", city: "Austin", county: "Travis", state: "TX", zip: "78705", industry: "healthcare", industryName: "Offices of Physicians", naics: "621111", status: "Active", founded: "2005" },
    { id: 7, name: "Central Texas Orthopedics", address: "3705 Medical Parkway", city: "Austin", county: "Travis", state: "TX", zip: "78756", industry: "healthcare", industryName: "Specialty Medical Practice", naics: "621111", status: "Active", founded: "2009" },
    { id: 8, name: "Hill Country Senior Care", address: "4315 James Casey St", city: "Austin", county: "Travis", state: "TX", zip: "78745", industry: "healthcare", industryName: "Home Health Care Services", naics: "621610", status: "Active", founded: "2014" },

    // Logistics - Travis County
    { id: 9, name: "Austin Freight Solutions", address: "5800 Burleson Rd", city: "Austin", county: "Travis", state: "TX", zip: "78744", industry: "logistics", industryName: "General Freight Trucking", naics: "484110", status: "Active", founded: "2011" },
    { id: 10, name: "Capital Distribution Co", address: "9700 Dessau Rd", city: "Austin", county: "Travis", state: "TX", zip: "78754", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2013" },

    // Manufacturing - Williamson County
    { id: 11, name: "Round Rock Precision Machining", address: "1800 S Mays St", city: "Round Rock", county: "Williamson", state: "TX", zip: "78664", industry: "manufacturing", industryName: "Machine Shops", naics: "332710", status: "Active", founded: "2016" },
    { id: 12, name: "Cedar Park Manufacturing", address: "500 Brushy Creek Rd", city: "Cedar Park", county: "Williamson", state: "TX", zip: "78613", industry: "manufacturing", industryName: "Electronic Component Manufacturing", naics: "334419", status: "Active", founded: "2007" },
    { id: 13, name: "Georgetown Steel Solutions", address: "4020 Williams Dr", city: "Georgetown", county: "Williamson", state: "TX", zip: "78628", industry: "manufacturing", industryName: "Steel Product Manufacturing", naics: "331222", status: "Active", founded: "2019" },
    { id: 14, name: "Leander Industrial Products", address: "700 S US Hwy 183", city: "Leander", county: "Williamson", state: "TX", zip: "78641", industry: "manufacturing", industryName: "Industrial Machinery Manufacturing", naics: "333249", status: "Active", founded: "2015" },

    // Healthcare - Williamson County
    { id: 15, name: "Williamson County Medical Associates", address: "2300 Round Rock Ave", city: "Round Rock", county: "Williamson", state: "TX", zip: "78681", industry: "healthcare", industryName: "Offices of Physicians", naics: "621111", status: "Active", founded: "2006" },
    { id: 16, name: "Cedar Park Family Medicine", address: "1401 Medical Pkwy", city: "Cedar Park", county: "Williamson", state: "TX", zip: "78613", industry: "healthcare", industryName: "Family Medical Practice", naics: "621111", status: "Active", founded: "2011" },

    // Logistics - Williamson County
    { id: 17, name: "Round Rock Logistics Center", address: "3500 Gattis School Rd", city: "Round Rock", county: "Williamson", state: "TX", zip: "78664", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2018" },

    // Manufacturing - Dallas County
    { id: 18, name: "Dallas Precision Manufacturing", address: "4800 Spring Valley Rd", city: "Dallas", county: "Dallas", state: "TX", zip: "75244", industry: "manufacturing", industryName: "Precision Machining", naics: "332710", status: "Active", founded: "2008" },
    { id: 19, name: "North Texas Metal Fabricators", address: "2700 Singleton Blvd", city: "Dallas", county: "Dallas", state: "TX", zip: "75212", industry: "manufacturing", industryName: "Metal Fabrication", naics: "332312", status: "Active", founded: "2005" },
    { id: 20, name: "DFW Industrial Components", address: "9500 Forest Ln", city: "Dallas", county: "Dallas", state: "TX", zip: "75243", industry: "manufacturing", industryName: "Industrial Component Manufacturing", naics: "332999", status: "Active", founded: "2012" },
    { id: 21, name: "Trinity River Plastics", address: "1800 Chalk Hill Rd", city: "Dallas", county: "Dallas", state: "TX", zip: "75212", industry: "manufacturing", industryName: "Plastics Product Manufacturing", naics: "326199", status: "Active", founded: "2014" },
    { id: 22, name: "Metroplex Tool & Die", address: "3300 Lombardy Ln", city: "Dallas", county: "Dallas", state: "TX", zip: "75220", industry: "manufacturing", industryName: "Tool and Die Manufacturing", naics: "333514", status: "Active", founded: "2009" },

    // Healthcare - Dallas County
    { id: 23, name: "Dallas Medical Specialists Group", address: "8200 Walnut Hill Ln", city: "Dallas", county: "Dallas", state: "TX", zip: "75231", industry: "healthcare", industryName: "Specialty Medical Practice", naics: "621111", status: "Active", founded: "2007" },
    { id: 24, name: "North Dallas Primary Care", address: "5500 Preston Rd", city: "Dallas", county: "Dallas", state: "TX", zip: "75205", industry: "healthcare", industryName: "Primary Care Practice", naics: "621111", status: "Active", founded: "2010" },
    { id: 25, name: "DFW Rehabilitation Services", address: "3600 Gaston Ave", city: "Dallas", county: "Dallas", state: "TX", zip: "75246", industry: "healthcare", industryName: "Physical Therapy Services", naics: "621340", status: "Active", founded: "2016" },

    // Logistics - Dallas County
    { id: 26, name: "Dallas Distribution Partners", address: "4100 W Ledbetter Dr", city: "Dallas", county: "Dallas", state: "TX", zip: "75236", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2011" },
    { id: 27, name: "DFW Freight Services", address: "2800 Market Center Blvd", city: "Dallas", county: "Dallas", state: "TX", zip: "75207", industry: "logistics", industryName: "General Freight Trucking", naics: "484110", status: "Active", founded: "2013" },

    // Manufacturing - Harris County
    { id: 28, name: "Houston Industrial Manufacturing", address: "5600 Westheimer Rd", city: "Houston", county: "Harris", state: "TX", zip: "77056", industry: "manufacturing", industryName: "Industrial Equipment Manufacturing", naics: "333249", status: "Active", founded: "2006" },
    { id: 29, name: "Gulf Coast Metal Works", address: "8900 Gulf Fwy", city: "Houston", county: "Harris", state: "TX", zip: "77017", industry: "manufacturing", industryName: "Metal Fabrication", naics: "332312", status: "Active", founded: "2008" },
    { id: 30, name: "Bayou City Plastics Corp", address: "3200 Harrisburg Blvd", city: "Houston", county: "Harris", state: "TX", zip: "77003", industry: "manufacturing", industryName: "Plastics Manufacturing", naics: "326199", status: "Active", founded: "2015" },
    { id: 31, name: "Houston Precision Components", address: "12500 North Fwy", city: "Houston", county: "Harris", state: "TX", zip: "77060", industry: "manufacturing", industryName: "Precision Component Manufacturing", naics: "332721", status: "Active", founded: "2017" },
    { id: 32, name: "Energy Corridor Fabrication", address: "14400 Memorial Dr", city: "Houston", county: "Harris", state: "TX", zip: "77079", industry: "manufacturing", industryName: "Oil and Gas Equipment", naics: "333132", status: "Active", founded: "2010" },

    // Healthcare - Harris County
    { id: 33, name: "Houston Medical Associates", address: "6550 Fannin St", city: "Houston", county: "Harris", state: "TX", zip: "77030", industry: "healthcare", industryName: "Multi-Specialty Practice", naics: "621111", status: "Active", founded: "2005" },
    { id: 34, name: "Memorial Hermann Physicians", address: "9800 Bellaire Blvd", city: "Houston", county: "Harris", state: "TX", zip: "77036", industry: "healthcare", industryName: "Offices of Physicians", naics: "621111", status: "Active", founded: "2009" },
    { id: 35, name: "Gulf Coast Rehabilitation", address: "1700 Dryden Rd", city: "Houston", county: "Harris", state: "TX", zip: "77030", industry: "healthcare", industryName: "Rehabilitation Services", naics: "621340", status: "Active", founded: "2012" },

    // Logistics - Harris County
    { id: 36, name: "Houston Logistics Hub", address: "16800 Imperial Valley Dr", city: "Houston", county: "Harris", state: "TX", zip: "77060", industry: "logistics", industryName: "Warehousing and Distribution", naics: "493110", status: "Active", founded: "2014" },
    { id: 37, name: "Port City Freight", address: "4500 Navigation Blvd", city: "Houston", county: "Harris", state: "TX", zip: "77011", industry: "logistics", industryName: "Freight Transportation", naics: "484110", status: "Active", founded: "2007" },

    // Manufacturing - Bexar County
    { id: 38, name: "San Antonio Precision Machining", address: "3800 Fredericksburg Rd", city: "San Antonio", county: "Bexar", state: "TX", zip: "78201", industry: "manufacturing", industryName: "Machine Shops", naics: "332710", status: "Active", founded: "2011" },
    { id: 39, name: "Alamo City Metal Works", address: "5500 Rigsby Ave", city: "San Antonio", county: "Bexar", state: "TX", zip: "78222", industry: "manufacturing", industryName: "Metal Stamping", naics: "332116", status: "Active", founded: "2013" },
    { id: 40, name: "South Texas Industrial Co", address: "7800 W Military Dr", city: "San Antonio", county: "Bexar", state: "TX", zip: "78227", industry: "manufacturing", industryName: "Industrial Manufacturing", naics: "332999", status: "Active", founded: "2016" },

    // Healthcare - Bexar County
    { id: 41, name: "San Antonio Medical Group", address: "4100 Medical Dr", city: "San Antonio", county: "Bexar", state: "TX", zip: "78229", industry: "healthcare", industryName: "Multi-Specialty Practice", naics: "621111", status: "Active", founded: "2006" },
    { id: 42, name: "Alamo Heights Family Medicine", address: "5800 Broadway", city: "San Antonio", county: "Bexar", state: "TX", zip: "78209", industry: "healthcare", industryName: "Family Practice", naics: "621111", status: "Active", founded: "2014" },

    // Logistics - Bexar County
    { id: 43, name: "San Antonio Distribution Center", address: "6200 S Flores St", city: "San Antonio", county: "Bexar", state: "TX", zip: "78214", industry: "logistics", industryName: "Warehousing and Storage", naics: "493110", status: "Active", founded: "2018" },

    // Manufacturing - Tarrant County
    { id: 44, name: "Fort Worth Precision Tools", address: "4200 N Main St", city: "Fort Worth", county: "Tarrant", state: "TX", zip: "76106", industry: "manufacturing", industryName: "Tool Manufacturing", naics: "333514", status: "Active", founded: "2009" },
    { id: 45, name: "Arlington Industrial Components", address: "2100 E Division St", city: "Arlington", county: "Tarrant", state: "TX", zip: "76011", industry: "manufacturing", industryName: "Component Manufacturing", naics: "332999", status: "Active", founded: "2015" },

    // Healthcare - Tarrant County
    { id: 46, name: "Tarrant County Medical Associates", address: "1500 S Main St", city: "Fort Worth", county: "Tarrant", state: "TX", zip: "76104", industry: "healthcare", industryName: "Medical Practice", naics: "621111", status: "Active", founded: "2007" },

    // Logistics - Tarrant County
    { id: 47, name: "Fort Worth Logistics Services", address: "5000 Alliance Gateway", city: "Fort Worth", county: "Tarrant", state: "TX", zip: "76177", industry: "logistics", industryName: "Distribution Services", naics: "493110", status: "Active", founded: "2012" },

    // Manufacturing - Hays County
    { id: 48, name: "San Marcos Manufacturing", address: "1800 Industrial Dr", city: "San Marcos", county: "Hays", state: "TX", zip: "78666", industry: "manufacturing", industryName: "Industrial Manufacturing", naics: "332999", status: "Active", founded: "2017" },

    // Healthcare - Hays County
    { id: 49, name: "Hays County Medical Center", address: "401 Wonder World Dr", city: "San Marcos", county: "Hays", state: "TX", zip: "78666", industry: "healthcare", industryName: "Outpatient Care Center", naics: "621493", status: "Active", founded: "2019" },

    // Logistics - Hays County
    { id: 50, name: "Central Texas Distribution", address: "2500 S IH-35", city: "San Marcos", county: "Hays", state: "TX", zip: "78666", industry: "logistics", industryName: "Warehousing", naics: "493110", status: "Active", founded: "2016" }
];

// ===========================================
// PREVIEW PAGE - SEARCH & FILTER
// ===========================================
function initPreviewSearch() {
    var businessGrid = document.getElementById('business-grid');
    if (!businessGrid) return;

    var searchInput = document.getElementById('search-input');
    var filterIndustry = document.getElementById('filter-industry');
    var filterCounty = document.getElementById('filter-county');
    var clearFiltersBtn = document.getElementById('clear-filters');
    var prevPageBtn = document.getElementById('prev-page');
    var nextPageBtn = document.getElementById('next-page');
    var resetSearchBtn = document.getElementById('reset-search');

    var currentPage = 1;
    var itemsPerPage = 10;
    var filteredBusinesses = sampleBusinesses.slice();

    // Initial render
    renderBusinesses();

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            currentPage = 1;
            filterBusinesses();
        }, 300));
    }

    // Industry filter
    if (filterIndustry) {
        filterIndustry.addEventListener('change', function() {
            currentPage = 1;
            filterBusinesses();
        });
    }

    // County filter
    if (filterCounty) {
        filterCounty.addEventListener('change', function() {
            currentPage = 1;
            filterBusinesses();
        });
    }

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (filterIndustry) filterIndustry.value = '';
            if (filterCounty) filterCounty.value = '';
            currentPage = 1;
            filterBusinesses();
        });
    }

    // Reset search (from no results)
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            if (filterIndustry) filterIndustry.value = '';
            if (filterCounty) filterCounty.value = '';
            currentPage = 1;
            filterBusinesses();
        });
    }

    // Pagination
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderBusinesses();
                scrollToResults();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            var totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderBusinesses();
                scrollToResults();
            }
        });
    }

    function filterBusinesses() {
        var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var industryFilter = filterIndustry ? filterIndustry.value : '';
        var countyFilter = filterCounty ? filterCounty.value : '';

        filteredBusinesses = sampleBusinesses.filter(function(business) {
            var matchesSearch = !searchTerm ||
                business.name.toLowerCase().includes(searchTerm) ||
                business.industryName.toLowerCase().includes(searchTerm) ||
                business.industry.toLowerCase().includes(searchTerm);

            var matchesIndustry = !industryFilter || business.industry === industryFilter;
            var matchesCounty = !countyFilter || business.county === countyFilter;

            return matchesSearch && matchesIndustry && matchesCounty;
        });

        renderBusinesses();
    }

    function renderBusinesses() {
        var totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage) || 1;
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var pageBusinesses = filteredBusinesses.slice(startIndex, endIndex);

        // Update results info
        var resultsShowing = document.getElementById('results-showing');
        var resultsTotal = document.getElementById('results-total');
        var currentPageEl = document.getElementById('current-page');
        var totalPagesEl = document.getElementById('total-pages');

        if (resultsShowing) resultsShowing.textContent = pageBusinesses.length;
        if (resultsTotal) resultsTotal.textContent = filteredBusinesses.length;
        if (currentPageEl) currentPageEl.textContent = currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;

        // Update pagination buttons
        if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;

        // Show/hide no results
        var noResults = document.getElementById('no-results');
        var pagination = document.getElementById('pagination');

        if (filteredBusinesses.length === 0) {
            businessGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            if (pagination) pagination.style.display = 'none';
            return;
        } else {
            if (noResults) noResults.style.display = 'none';
            if (pagination) pagination.style.display = 'flex';
        }

        // Render cards
        businessGrid.innerHTML = pageBusinesses.map(function(business) {
            return createBusinessCard(business);
        }).join('');
    }

    function createBusinessCard(business) {
        return '<div class="business-card">' +
            '<div class="business-header">' +
                '<h3 class="business-name">' + escapeHtml(business.name) + '</h3>' +
                '<span class="business-status">' + business.status + '</span>' +
            '</div>' +
            '<div class="business-details">' +
                '<div class="business-detail">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                    '<span>' + escapeHtml(business.address) + ', ' + escapeHtml(business.city) + ', ' + business.state + ' ' + business.zip + '</span>' +
                '</div>' +
                '<div class="business-detail">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>' +
                    '<span><span class="business-detail-label">County:</span> ' + escapeHtml(business.county) + '</span>' +
                '</div>' +
                '<div class="business-detail">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' +
                    '<span><span class="business-detail-label">Industry:</span> ' + escapeHtml(business.industryName) + '</span>' +
                '</div>' +
                '<div class="business-detail">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' +
                    '<span><span class="business-detail-label">NAICS:</span> ' + business.naics + '</span>' +
                '</div>' +
                '<div class="business-detail">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
                    '<span><span class="business-detail-label">Founded:</span> ' + business.founded + '</span>' +
                '</div>' +
            '</div>' +
            '<button class="business-action" disabled>' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
                'Full details require demo access' +
            '</button>' +
        '</div>';
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function scrollToResults() {
        var searchSection = document.getElementById('search');
        if (searchSection) {
            var header = document.querySelector('.header');
            var headerHeight = header ? header.offsetHeight : 0;
            var targetPosition = searchSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: targetPosition - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    }
}

// ===========================================
// DEMO FORM SUBMISSION
// ===========================================
function initDemoForm() {
    var demoForm = document.getElementById('demo-form');
    if (!demoForm) return;

    var submitBtn = document.getElementById('submit-btn');
    var btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    var btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
    var formSuccess = document.getElementById('form-success');

    demoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate required fields
        var name = document.getElementById('name');
        var email = document.getElementById('email');
        var organization = document.getElementById('organization');
        var orgType = document.getElementById('org-type');

        if (!name.value.trim() || !email.value.trim() || !organization.value.trim() || !orgType.value) {
            alert('Please fill in all required fields.');
            return;
        }

        // Show loading state
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';
        if (submitBtn) submitBtn.disabled = true;

        // Collect form data
        var formData = new FormData(demoForm);

        // Submit to Formspree
        fetch(demoForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                // Show success message
                demoForm.style.display = 'none';
                if (formSuccess) formSuccess.style.display = 'block';

                // Scroll to success message
                var container = document.querySelector('.demo-form-container');
                if (container) {
                    var header = document.querySelector('.header');
                    var headerHeight = header ? header.offsetHeight : 0;
                    var targetPosition = container.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: targetPosition - headerHeight - 40,
                        behavior: 'smooth'
                    });
                }
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again or email us directly at help@zscale.com');

            // Reset button state
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
        });
    });

    // Real-time email validation
    var emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            var email = this.value.trim();
            if (email && !isValidEmail(email)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });

        emailInput.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }

    function isValidEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}
