// Shared UI Components - Reusable across all pages

// === Navigation Configuration ===
const NAVIGATION_CONFIG = {
    homeUrl: "/",
    homeLabel: "Home",
    blogUrl: "/blog", 
    blogLabel: "Blog",
    projectsUrl: "/projects",
    projectsLabel: "Projects",
    aboutUrl: "/about",
    aboutLabel: "About"
};

// === Reusable UI Components ===

/**
 * Creates a "Back to Home" navigation component
 * @param {Object} options - Configuration options
 * @param {string} options.homeUrl - URL to home page (optional, defaults to config)
 * @param {string} options.homeLabel - Label for home link (optional, defaults to config)
 * @param {string} options.className - Additional CSS class (optional)
 * @returns {string} HTML string for the back to home component
 */
function createBackToHome(options = {}) {
    const {
        homeUrl = NAVIGATION_CONFIG.homeUrl,
        homeLabel = NAVIGATION_CONFIG.homeLabel,
        className = ''
    } = options;

    return `
        <div class="blog-navigation ${className}">
            <a href="${homeUrl}" aria-label="Go back to homepage" class="back-link">
                <i class="fa-solid fa-arrow-left"></i> ${homeLabel}
            </a>
        </div>
    `;
}

/**
 * Creates a breadcrumb navigation component
 * @param {Array} breadcrumbs - Array of breadcrumb objects {url, label}
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for breadcrumb navigation
 */
function createBreadcrumbNav(breadcrumbs, options = {}) {
    const { className = '', separator = '|' } = options;
    
    if (!breadcrumbs || breadcrumbs.length === 0) {
        return '';
    }
    
    const breadcrumbItems = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        if (isLast) {
            return `<span class="breadcrumb-current">${crumb.label}</span>`;
        } else {
            return `
                <a href="${crumb.url}" class="breadcrumb-link">${crumb.label}</a>
                <span class="breadcrumb-separator">${separator}</span>
            `;
        }
    }).join(' ');
    
    return `
        <nav class="breadcrumb-nav ${className}" aria-label="Breadcrumb">
            ${breadcrumbItems}
        </nav>
    `;
}

/**
 * Creates blog post navigation component
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for blog post navigation
 */
function createBlogPostNavigation(options = {}) {
    const { className = '' } = options;
    
    const breadcrumbs = [
        { url: NAVIGATION_CONFIG.homeUrl, label: NAVIGATION_CONFIG.homeLabel },
        { url: NAVIGATION_CONFIG.blogUrl, label: NAVIGATION_CONFIG.blogLabel },
        { url: '#', label: 'Article' }
    ];
    
    return `
        <div class="blog-post-navigation ${className}">
            ${createBackToHome()}
            ${createBreadcrumbNav(breadcrumbs)}
        </div>
    `;
}

/**
 * Creates project navigation component
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for project navigation
 */
function createProjectNavigation(options = {}) {
    const { className = '' } = options;
    
    const breadcrumbs = [
        { url: NAVIGATION_CONFIG.homeUrl, label: NAVIGATION_CONFIG.homeLabel },
        { url: NAVIGATION_CONFIG.projectsUrl, label: NAVIGATION_CONFIG.projectsLabel },
        { url: '#', label: 'Project' }
    ];
    
    return `
        <div class="project-navigation ${className}">
            ${createBackToHome()}
            ${createBreadcrumbNav(breadcrumbs)}
        </div>
    `;
}

/**
 * Creates a loading state component
 * @param {string} message - Loading message to display
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for loading state
 */
function createLoadingState(message = 'Loading...', options = {}) {
    const { className = '', showSpinner = true } = options;
    
    return `
        <div class="loading-state ${className}">
            <div class="loading-content">
                ${showSpinner ? '<div class="loading-spinner"></div>' : ''}
                <p class="loading-message">${message}</p>
            </div>
        </div>
    `;
}

/**
 * Creates an error state component
 * @param {string} message - Error message to display
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for error state
 */
function createErrorState(message, options = {}) {
    const { className = '', retryButton = false } = options;
    
    return `
        <div class="error-state ${className}">
            <div class="error-content">
                <i class="fa-solid fa-exclamation-triangle error-icon"></i>
                <p class="error-message">${message}</p>
                ${retryButton ? '<button class="retry-btn" onclick="location.reload()">Try Again</button>' : ''}
            </div>
        </div>
    `;
}

/**
 * Initializes the like system with fallback handling
 * @param {string} context - Context for logging (e.g., 'Blog', 'Projects')
 * @param {number} retryDelay - Delay in milliseconds before retry (default: 200)
 * @returns {Promise<void>}
 */
async function initializeLikeSystem(context = 'Component', retryDelay = 200) {
    // Refresh like system after cards are rendered
    if (window.likeSystem) {
        console.log(`${context}: Refreshing like system after card render`);
        await window.likeSystem.refresh();
    } else {
        console.log(`${context}: Like system not available, waiting...`);
        // If like system isn't ready yet, wait a bit and try again
        setTimeout(async () => {
            if (window.likeSystem) {
                console.log(`${context}: Like system found after delay, refreshing...`);
                await window.likeSystem.refresh();
            }
        }, retryDelay);
    }
}

// === Export UIComponents ===

// === Public API ===
const UIComponents = {
    // Navigation components
    createBackToHome,
    createBreadcrumbNav,
    createBlogPostNavigation,
    createProjectNavigation,
    
    // State components
    createLoadingState,
    createErrorState,
    
    // Like system initialization
    initializeLikeSystem,
    
    // Quick access to common navigation patterns
    get BackToHome() {
        return createBackToHome();
    },
    
    get BlogPostNavigation() {
        return createBlogPostNavigation();
    },
    
    get ProjectNavigation() {
        return createProjectNavigation();
    },
    
    // Configuration access
    get navigationConfig() {
        return { ...NAVIGATION_CONFIG };
    }
};

// Make available globally
window.UIComponents = UIComponents;
