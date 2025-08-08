// Cache busting configuration
window.CACHE_VERSION = {
    css: 'v1.1',
    js: 'v1.1', 
    images: 'v1.1'
};

// Function to add version parameters to URLs
function addVersionToUrl(url, type) {
    const version = window.CACHE_VERSION[type] || 'v1.0';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${version}`;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CACHE_VERSION, addVersionToUrl };
}
