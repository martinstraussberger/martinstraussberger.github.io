// Shared UI Components - Reusable across all pages

// === Navigation Configuration ===
const NAVIGATION_CONFIG = {
    homeUrl: "./index.html",
    homeLabel: "Home",
    blogUrl: "./blog.html", 
    blogLabel: "Blog",
    projectsUrl: "./projects.html",
    projectsLabel: "Projects",
    aboutUrl: "./about.html",
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
        return createBackToHome();
    }

    const breadcrumbLinks = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const link = `<a href="${crumb.url}" aria-label="${crumb.ariaLabel || `Go to ${crumb.label}`}" class="back-link">${crumb.label}</a>`;
        const separatorHtml = !isLast ? `<span class="nav-separator">${separator}</span>` : '';
        
        return `${link}${separatorHtml}`;
    }).join('');

    return `
        <div class="${className}">
            <i class="fa-solid fa-arrow-left"></i>
            ${breadcrumbLinks}
        </div>
    `;
}

/**
 * Creates navigation for blog post pages
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for blog post navigation
 */
function createBlogPostNavigation(options = {}) {
    const breadcrumbs = [
        { 
            url: options.homeUrl || NAVIGATION_CONFIG.homeUrl, 
            label: options.homeLabel || NAVIGATION_CONFIG.homeLabel,
            ariaLabel: "Go back to homepage"
        },
        { 
            url: options.blogUrl || NAVIGATION_CONFIG.blogUrl, 
            label: options.blogLabel || NAVIGATION_CONFIG.blogLabel,
            ariaLabel: "Back to blog listing"
        }
    ];

    return createBreadcrumbNav(breadcrumbs, { className: 'blog-post-navigation' });
}

/**
 * Creates navigation for project pages
 * @param {Object} options - Configuration options
 * @returns {string} HTML string for project navigation
 */
function createProjectNavigation(options = {}) {
    const breadcrumbs = [
        { 
            url: options.homeUrl || NAVIGATION_CONFIG.homeUrl, 
            label: options.homeLabel || NAVIGATION_CONFIG.homeLabel,
            ariaLabel: "Go back to homepage"
        },
        { 
            url: options.projectsUrl || NAVIGATION_CONFIG.projectsUrl, 
            label: options.projectsLabel || NAVIGATION_CONFIG.projectsLabel,
            ariaLabel: "Back to projects listing"
        }
    ];

    return createBreadcrumbNav(breadcrumbs, { className: 'project-navigation' });
}

// === Loading and Error States ===

/**
 * Creates a loading state component
 * @param {string} message - Loading message
 * @param {string} className - Additional CSS class
 * @returns {string} HTML string for loading state
 */
function createLoadingState(message = "Loading...", className = "") {
    return `
        <div class="loading-state ${className}">
            <p class="loading">${message}</p>
        </div>
    `;
}

/**
 * Creates an error state component
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @param {string} className - Additional CSS class
 * @returns {string} HTML string for error state
 */
function createErrorState(title = "Something went wrong", message = "Please try again later.", className = "") {
    return `
        <div class="error-state ${className}">
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;
}

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
