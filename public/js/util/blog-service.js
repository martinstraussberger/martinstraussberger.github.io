// Configuration constants - single source of truth
const BLOG_CONFIG = {
    indexPath: './public/data/blog-index.json',
    categories: {
        neuroscience: 'Neuroscience & Leadership',
        engineering: 'Software Engineering',
        ai: 'The Age of AI'
    },
    wordsPerMinute: 200,
    fallbackReadTime: '5 min read',
    minReadTime: 1
};

// Private module-level cache - better than instance state
let blogIndexCache = null;

// === Core Data Loading Functions ===

async function loadBlogIndex() {
    if (blogIndexCache) return blogIndexCache;
    
    try {
        const response = await fetch(BLOG_CONFIG.indexPath);
        if (!response.ok) {
            throw new Error(`Failed to load blog index: ${response.statusText}`);
        }
        blogIndexCache = await response.json();
        return blogIndexCache;
    } catch (error) {
        console.error('Error loading blog index:', error);
        return createFallbackIndex();
    }
}

function createFallbackIndex() {
    return {
        posts: [],
        categories: BLOG_CONFIG.categories
    };
}

// === Post Enhancement Functions ===

async function enhancePostWithReadTime(post) {
    try {
        const content = await SimpleMarkdownParser.loadAndParse(post.markdownPath);
        const readTime = calculateReadTime(content);
        return { ...post, readTime };
    } catch (error) {
        console.warn(`Could not enhance post ${post.id}:`, error);
        return { ...post, readTime: BLOG_CONFIG.fallbackReadTime };
    }
}

function sortPostsByDate(posts) {
    return posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

// === Main Blog Functions ===

async function getBlogPosts(category = null) {
    const index = await loadBlogIndex();
    let posts = index.posts || [];

    if (category) {
        posts = posts.filter(post => post.category === category);
    }

    const enhancedPosts = await Promise.all(
        posts.map(enhancePostWithReadTime)
    );

    return sortPostsByDate(enhancedPosts);
}

async function getFeaturedPosts() {
    const index = await loadBlogIndex();
    const featuredPosts = (index.posts || []).filter(post => post.featured);
    return sortPostsByDate(featuredPosts);
}

async function getBlogPost(id) {
    const index = await loadBlogIndex();
    const post = (index.posts || []).find(post => post.id === id);
    
    if (!post) return null;

    try {
        const content = await SimpleMarkdownParser.loadAndParse(post.markdownPath);
        const readTime = calculateReadTime(content);
        
        return {
            ...post,
            content: content || '<p>Content not available.</p>',
            readTime
        };
    } catch (error) {
        console.error('Error loading blog post content:', error);
        return {
            ...post,
            content: '<p>Content not available.</p>',
            readTime: BLOG_CONFIG.fallbackReadTime
        };
    }
}

// === Utility Functions ===

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getCategoryName(categoryKey) {
    return BLOG_CONFIG.categories[categoryKey] || categoryKey;
}

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category'),
        post: params.get('post')
    };
}

function calculateReadTime(text) {
    if (!text || typeof text !== 'string') {
        return `${BLOG_CONFIG.minReadTime} min read`;
    }
    
    const wordCount = text.trim().split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / BLOG_CONFIG.wordsPerMinute);
    const finalReadTime = Math.max(readTimeMinutes, BLOG_CONFIG.minReadTime);
    
    return `${finalReadTime} min read`;
}

// === Public API - Clean interface ===

const BlogService = {
    // Main functions
    getBlogPosts,
    getFeaturedPosts,
    getBlogPost,
    
    // Utility functions
    formatDate,
    getCategoryName,
    getUrlParams,
    calculateReadTime,
    
    // Config access (read-only)
    get categories() {
        return { ...BLOG_CONFIG.categories };
    }
};

// Maintain compatibility with existing code
window.BlogService = BlogService;
