// Blog utility functions following your pragmatic approach
class BlogService {
    constructor() {
        this.blogIndex = null;
        this.categories = {
            neuroscience: 'Neuroscience & Leadership',
            engineering: 'Software Engineering',
            ai: 'The Age of AI'
        };
    }

    async loadBlogIndex() {
        try {
            const response = await fetch('./public/data/blog-index.json');
            if (!response.ok) {
                throw new Error(`Failed to load blog index: ${response.statusText}`);
            }
            this.blogIndex = await response.json();
            return this.blogIndex;
        } catch (error) {
            console.error('Error loading blog index:', error);
            return this.getFallbackIndex();
        }
    }

    getFallbackIndex() {
        return {
            posts: [],
            categories: this.categories
        };
    }

    async getBlogPosts(category = null) {
        if (!this.blogIndex) {
            await this.loadBlogIndex();
        }

        let posts = this.blogIndex.posts || [];

        if (category) {
            posts = posts.filter(post => post.category === category);
        }

        // Enhance posts with calculated reading time and dynamic published date
        const enhancedPosts = await Promise.all(posts.map(async (post) => {
            try {
                const content = await SimpleMarkdownParser.loadAndParse(post.markdownPath);
                const calculatedReadTime = this.calcReadTime(content);
                const calculatedPublishedAt = await this.getFileCreationDate(post.markdownPath);
                
                return {
                    ...post,
                    readTime: calculatedReadTime,
                    publishedAt: calculatedPublishedAt || post.publishedAt // fallback to JSON date
                };
            } catch (error) {
                console.warn(`Could not enhance post ${post.id}:`, error);
                return {
                    ...post,
                    readTime: '5 min read', // fallback
                    publishedAt: post.publishedAt // use JSON date as fallback
                };
            }
        }));

        // Sort by date (newest first)
        return enhancedPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    async getFeaturedPosts() {
        if (!this.blogIndex) {
            await this.loadBlogIndex();
        }

        return (this.blogIndex.posts || [])
            .filter(post => post.featured)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }

    async getBlogPost(id) {
        if (!this.blogIndex) {
            await this.loadBlogIndex();
        }

        const post = (this.blogIndex.posts || []).find(post => post.id === id);
        if (!post) return null;

        try {
            // Load the markdown content
            const content = await SimpleMarkdownParser.loadAndParse(post.markdownPath);
            // Calculate reading time based on actual content
            const calculatedReadTime = this.calcReadTime(content);
            // Get file creation date
            const calculatedPublishedAt = await this.getFileCreationDate(post.markdownPath);
            
            return {
                ...post,
                content: content || '<p>Content not available.</p>',
                readTime: calculatedReadTime,
                publishedAt: calculatedPublishedAt || post.publishedAt // fallback to JSON date
            };
        } catch (error) {
            console.error('Error loading blog post content:', error);
            return {
                ...post,
                content: '<p>Content not available.</p>',
                publishedAt: post.publishedAt // use JSON date as fallback
            };
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getCategoryName(categoryKey) {
        return this.categories[categoryKey] || categoryKey;
    }

    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            category: params.get('category'),
            post: params.get('post')
        };
    }

    calcReadTime(text) {
        const wordsPerMinute = 200; // Average reading speed
        const textLength = text.split(' ').length;
        const readTime = Math.ceil(textLength / wordsPerMinute);

        if (readTime < 1) return '1 min read'; // Ensure at least 1 minute

        return `${readTime} min read`;
    }

    async getFileCreationDate(filePath) {
        try {
            // For client-side JavaScript, we can't directly access file system metadata
            // However, we can try to get it through fetch headers if the server provides them
            const response = await fetch(filePath, { method: 'HEAD' });
            
            if (response.ok) {
                // Try to get Last-Modified header (closest we can get to creation date)
                const lastModified = response.headers.get('Last-Modified');
                if (lastModified) {
                    const date = new Date(lastModified);
                    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
                }
            }
            
            // If we can't get the file date, return null to use fallback
            return null;
        } catch (error) {
            console.warn(`Could not get file creation date for ${filePath}:`, error);
            return null;
        }
    }
}

// Make available globally
window.BlogService = new BlogService();
