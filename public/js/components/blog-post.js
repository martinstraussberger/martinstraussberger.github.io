const blogPostData = {
  navigation: {
    homeUrl: "./index.html", 
    blogUrl: "./blog.html",
    homeLabel: "Home",
    blogLabel: "Blog"
  },
  ui: {
    notFoundTitle: "Article Not Found",
    notFoundMessage: "The requested article could not be found.",
    loadingMessage: "Loading article..."
  }
};

// Blog post metadata component
function createPostMeta(post) {
  const categoryName = window.BlogService.getCategoryName(post.category);
  const formattedDate = window.BlogService.formatDate(post.publishedAt);
  
  return `
    <div class="blog-post-meta">
      <span class="blog-category contrast-darkMode">${categoryName}</span>
      <div class="meta-details">
        <time datetime="${post.publishedAt}" class="blog-date">${formattedDate}</time>
        <span class="meta-separator">•</span>
        <span class="blog-read-time">${post.readTime}</span>
      </div>
    </div>
  `;
}

// Related posts component  
function createRelatedPosts(relatedPosts) {
  if (!relatedPosts || relatedPosts.length === 0) return '';
  
  return `
    <section class="related-posts" aria-labelledby="related-heading">
      <h3 id="related-heading">Related Articles</h3>
      <div class="related-grid">
        ${relatedPosts.map(post => `
          <article class="related-card">
            <a href="./blog-post.html?post=${post.id}" class="related-card-link" aria-label="Read article: ${post.title}">
              <span class="related-category">${window.BlogService.getCategoryName(post.category)}</span>
              <h4 class="related-title">${post.title}</h4>
              <p class="related-excerpt">${post.excerpt}</p>
            </a>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

// Main blog post state
let currentPost = null;
let relatedPosts = [];

async function loadBlogPost() {
  // Ensure BlogService is available
  if (!window.BlogService) {
    console.error('BlogService not available');
    return;
  }
  
  const params = window.BlogService.getUrlParams();
  const postId = params.post;
  
  if (!postId) {
    console.error('No post ID provided');
    return;
  }

  try {
    currentPost = await window.BlogService.getBlogPost(postId);
    
    if (currentPost) {
      // Load related posts (same category, excluding current post)
      const allPosts = await window.BlogService.getBlogPosts(currentPost.category);
      relatedPosts = allPosts
        .filter(post => post.id !== postId)
        .slice(0, 2); // Show max 2 related posts
      
      console.log(`Loaded blog post: ${currentPost.title}`);
    } else {
      console.error(`Blog post not found: ${postId}`);
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
  }
}

function renderBlogPost() {
  if (!currentPost) {
    const NotFoundPage = `
      ${window.UIComponents.createBlogPostNavigation()}
      <div class="blog-post-container">
        <article class="blog-post-content">
          <h1>${blogPostData.ui.notFoundTitle}</h1>
          <p>${blogPostData.ui.notFoundMessage}</p>
        </article>
      </div>
    `;
    
    const blogPostElement = document.getElementById('blog-post');
    if (blogPostElement) {
      blogPostElement.innerHTML = NotFoundPage;
    }
    return;
  }

  const BlogPost = `
    <div class="blog-post-container">
      <article class="blog-post-content" role="main" aria-labelledby="post-title">
        <header class="blog-post-header">
          ${createPostMeta(currentPost)}
          <h1 id="post-title" class="blog-post-title">${currentPost.title}</h1>
        </header>
        
        <div class="blog-post-body">
          ${currentPost.content}
        </div>
      </article>
      ${window.UIComponents.createBlogPostNavigation()}
      ${createRelatedPosts(relatedPosts)}
    </div>
  `;

  const blogPostElement = document.getElementById('blog-post');
  if (blogPostElement) {
    blogPostElement.innerHTML = BlogPost;
  } else {
    console.error('Blog post container element not found');
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  // Check if we're on the blog post page
  if (!document.getElementById('blog-post')) {
    return;
  }
  
  // Wait for required services to be available
  let attempts = 0;
  while ((!window.BlogService || !window.UIComponents) && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 10));
    attempts++;
  }
  
  if (!window.BlogService || !window.UIComponents) {
    console.error('Required services failed to initialize');
    return;
  }
  
  // Show loading state
  const blogPostElement = document.getElementById('blog-post');
  if (blogPostElement) {
    blogPostElement.innerHTML = `
      ${window.UIComponents.createBlogPostNavigation()}
      <div class="blog-post-container">
        ${window.UIComponents.createLoadingState(blogPostData.ui.loadingMessage)}
      </div>
    `;
  }
  
  // Load and render content
  await loadBlogPost();
  renderBlogPost();
});
