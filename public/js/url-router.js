// URL Router for Clean URLs - GitHub Pages Compatible
// This handles clean URL routing using client-side JavaScript

(function() {
    'use strict';
    
    // URL mapping for clean URLs to actual files
    const URL_MAPPING = {
        '/blog': '/blog.html',
        '/projects': '/projects.html', 
        '/about': '/about.html',
        '/blog-post': '/blog-post.html'
    };
    
    // Only run this on GitHub Pages or when needed
    function needsClientSideRouting() {
        // Check if we're on GitHub Pages domain or if server doesn't handle clean URLs
        return window.location.hostname.includes('github.io') || 
               window.location.hostname.includes('githubusercontent.com');
    }
    
    // Check if we're on a clean URL that needs to be handled
    function handleCleanURLs() {
        if (!needsClientSideRouting()) return false;
        
        const currentPath = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;
        
        // If we're on a clean URL, redirect to the actual file
        if (URL_MAPPING[currentPath]) {
            const actualFile = URL_MAPPING[currentPath] + search + hash;
            window.location.replace(actualFile);
            return true;
        }
        return false;
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleCleanURLs);
    } else {
        handleCleanURLs();
    }
    
    // Handle navigation clicks to use clean URLs (only on production)
    document.addEventListener('click', function(e) {
        if (!needsClientSideRouting()) return;
        
        const link = e.target.closest('a');
        if (!link || !link.href) return;
        
        const url = new URL(link.href, window.location.origin);
        
        // Check if it's an internal link to one of our HTML files
        for (const [cleanUrl, htmlFile] of Object.entries(URL_MAPPING)) {
            if (url.pathname === htmlFile) {
                e.preventDefault();
                
                // Navigate using clean URL in address bar
                const cleanUrlWithParams = cleanUrl + url.search + url.hash;
                window.history.pushState(null, '', cleanUrlWithParams);
                
                // Load the actual content
                window.location.assign(url.href);
                return;
            }
        }
    });
})();
