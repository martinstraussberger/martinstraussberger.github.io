// Shared Script Loader - Conservative Approach
// Loads common JavaScript utilities to reduce duplication across HTML files

class ScriptLoader {
    constructor() {
        this.loadedScripts = new Set();
    }

    // Load a single script if not already loaded
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (this.loadedScripts.has(src) || document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                this.loadedScripts.add(src);
                resolve();
            };
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            document.head.appendChild(script);
        });
    }

    // Load multiple scripts in parallel
    async loadScripts(scripts) {
        const promises = scripts.map(src => this.loadScript(src));
        return Promise.all(promises);
    }

    // Core utilities used across multiple pages
    async loadCoreUtilities() {
        const coreScripts = [
            './public/js/config/supabase-config.js',
            './public/js/url-router.js',
            './public/js/util/markdown-parser.js',
            './public/js/util/ui-components.js'
        ];
        
        return this.loadScripts(coreScripts);
    }

    // Blog-related utilities (for blog, blog-post, index pages)
    async loadBlogUtilities() {
        const blogScripts = [
            './public/js/util/ui-components.js',
            './public/js/util/blog-service.js'
        ];
        
        return this.loadScripts(blogScripts);
    }

    // Card and interaction utilities (for blog, projects pages)
    async loadInteractionUtilities() {
        const interactionScripts = [
            './public/js/util/card-renderer.js',
            './public/js/util/like-system.js'
        ];
        
        return this.loadScripts(interactionScripts);
    }

    // Projects utilities
    async loadProjectUtilities() {
        const projectScripts = [
            './public/js/util/projects-service.js'
        ];
        
        return this.loadScripts(projectScripts);
    }

    // Common toggle functionality
    async loadToggleUtilities() {
        const toggleScripts = [
            './public/js/toggle.js'
        ];
        
        return this.loadScripts(toggleScripts);
    }

    // Convenience methods for common combinations
    async loadBlogPageScripts() {
        await Promise.all([
            this.loadCoreUtilities(),
            this.loadBlogUtilities(),
            this.loadInteractionUtilities(),
            this.loadToggleUtilities()
        ]);
    }

    async loadProjectsPageScripts() {
        await Promise.all([
            this.loadCoreUtilities(),
            this.loadProjectUtilities(),
            this.loadInteractionUtilities(),
            this.loadToggleUtilities()
        ]);
    }

    async loadBlogPostPageScripts() {
        await Promise.all([
            this.loadCoreUtilities(),
            this.loadBlogUtilities()
        ]);
    }

    async loadIndexPageScripts() {
        await Promise.all([
            this.loadCoreUtilities(),
            this.loadBlogUtilities()
        ]);
    }

    async loadAboutPageScripts() {
        await Promise.all([
            this.loadCoreUtilities(),
            this.loadBlogUtilities()
        ]);
    }
}

// Create global instance
window.scriptLoader = new ScriptLoader();

// Export convenience methods to global scope for easy access
window.loadBlogPageScripts = () => window.scriptLoader.loadBlogPageScripts();
window.loadProjectsPageScripts = () => window.scriptLoader.loadProjectsPageScripts();
window.loadBlogPostPageScripts = () => window.scriptLoader.loadBlogPostPageScripts();
window.loadIndexPageScripts = () => window.scriptLoader.loadIndexPageScripts();
window.loadAboutPageScripts = () => window.scriptLoader.loadAboutPageScripts();
