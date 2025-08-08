const blogData = {
    navigation: {
        homeUrl: "./index.html",
        homeLabel: "Home"
    },
    ui: {
        title: "Blog",
        subtitle: "Insights on Leadership, Engineering & AI",
        noPostsMessage: "No articles found in this category.",
        loadingMessage: "Loading articles..."
    }
};

// Category filter component
function createCategoryFilter(currentCategory) {
    const categories = [
        { key: null, name: 'All Articles' },
        { key: 'neuroscience', name: 'Neuroscience & Leadership' },
        { key: 'engineering', name: 'Software Engineering' },
        { key: 'ai', name: 'The Age of AI' }
    ];

    return `
    <div class="category-filter">
      <h3>Categories</h3>
      <div class="category-buttons">
        ${categories.map(cat => `
          <a href="./blog.html${cat.key ? `?category=${cat.key}` : ''}" 
             class="category-btn ${currentCategory === cat.key ? 'active' : ''}"
             aria-label="Filter by ${cat.name}">
            ${cat.name}
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// Main blog listing
let blogPosts = [];
let currentCategory = null;

async function loadBlogContent() {
    // Ensure BlogService is available
    if (!window.BlogService) {
        console.error('BlogService not available');
        return;
    }

    const params = window.BlogService.getUrlParams();
    currentCategory = params.category;

    try {
        blogPosts = await window.BlogService.getBlogPosts(currentCategory);
        console.log(`Loaded ${blogPosts.length} blog posts for category: ${currentCategory || 'all'}`);
    } catch (error) {
        console.warn('Error loading blog posts:', error);
        blogPosts = [];
    }
}

function renderBlogPage() {
    const categoryName = currentCategory ? window.BlogService.getCategoryName(currentCategory) : 'All Categories';
    const subtitle = currentCategory ? `${categoryName} Articles` : blogData.ui.subtitle;

    const BlogPage = `
    <div class="blog-container">
      <header class="blog-header">
        <h1>${blogData.ui.title}</h1>
        <p class="blog-subtitle">${subtitle}</p>
      </header>
      
    ${createCategoryFilter(currentCategory)}
    ${window.UIComponents.BackToHome}

      <main class="blog-grid" role="main" aria-label="Blog articles">
        ${blogPosts.length > 0
            ? window.CardRenderer.renderBlogPosts(blogPosts)
            : `<p class="no-posts">${blogData.ui.noPostsMessage}</p>`
        }
      </main>
    </div>
  `;

    const blogElement = document.getElementById('blog');
    if (blogElement) {
        blogElement.innerHTML = BlogPage;
    } else {
        console.error('Blog container element not found');
    }
}

window.addEventListener('DOMContentLoaded', async function () {
    // Check if we're on the blog page
    if (!document.getElementById('blog')) {
        return;
    }

    // Wait for required services to be available
    let attempts = 0;
    while ((!window.BlogService || !window.CardRenderer || !window.UIComponents) && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 10));
        attempts++;
    }

    if (!window.BlogService || !window.CardRenderer || !window.UIComponents) {
        console.error('Required services failed to initialize');
        return;
    }

    // Show loading state
    const blogElement = document.getElementById('blog');
    if (blogElement) {
        blogElement.innerHTML = `
      ${window.UIComponents.BackToHome}
      <div class="blog-container">
        ${window.UIComponents.createLoadingState(blogData.ui.loadingMessage)}
      </div>
    `;
    }

    // Load and render content
    await loadBlogContent();
    renderBlogPage();
});