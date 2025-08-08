// Shared card component system following clean architecture principles

// === Card Configuration Types ===
const CARD_TYPES = {
    BLOG: 'blog',
    PROJECT: 'project'
};

// === Card Data Mappers ===
function mapBlogPostToCard(post) {
    const categoryName = window.BlogService.getCategoryName(post.category);
    const formattedDate = window.BlogService.formatDate(post.publishedAt);
    
    return {
        id: post.id,
        title: post.title,
        description: post.excerpt,
        primaryMeta: categoryName,
        secondaryMeta: formattedDate,
        footerLeft: post.readTime,
        footerRight: {
            text: 'Read More →',
            url: `./blog-post.html?post=${post.id}`,
            ariaLabel: `Read full article: ${post.title}`
        },
        type: CARD_TYPES.BLOG
    };
}

function mapProjectToCard(project) {
    return {
        id: project.id,
        title: project.title,
        description: project.description,
        primaryMeta: 'MERN', // Placeholder as requested
        secondaryMeta: null, // No date for projects
        footerLeft: null, // No reading time for projects
        footerRight: {
            text: 'View Project →',
            url: project.projectUrl,
            ariaLabel: `View project: ${project.title}`,
            external: true
        },
        type: CARD_TYPES.PROJECT
    };
}

// === Core Card Renderer ===
function createUniversalCard(cardData) {
    const {
        id,
        title,
        description,
        primaryMeta,
        secondaryMeta,
        footerLeft,
        footerRight,
        type
    } = cardData;
    
    return `
        <article class="blog-card" aria-labelledby="card-${id}">
            <div class="blog-card-content">
                <div class="blog-meta">
                    <span class="blog-category contrast-darkMode">${primaryMeta}</span>
                    ${secondaryMeta ? `<time class="blog-date">${secondaryMeta}</time>` : ''}
                </div>
                <h2 id="card-${id}" class="blog-title">
                    <a href="${footerRight.url}" 
                       class="blog-title-link"
                       ${footerRight.external ? 'target="_blank"' : ''}
                       aria-label="${footerRight.ariaLabel}">${title}</a>
                </h2>
                <p class="blog-excerpt">${description}</p>
                <div class="blog-footer">
                    ${footerLeft ? `<span class="blog-read-time">${footerLeft}</span>` : '<span></span>'}
                    <a href="${footerRight.url}" 
                       class="blog-read-more" 
                       ${footerRight.external ? 'target="_blank"' : ''}
                       aria-label="${footerRight.ariaLabel}">
                        ${footerRight.text}
                    </a>
                </div>
            </div>
        </article>
    `;
}

// === Public Card API ===
const CardRenderer = {
    // Main rendering functions
    renderBlogPost(post) {
        const cardData = mapBlogPostToCard(post);
        return createUniversalCard(cardData);
    },
    
    renderProject(project) {
        const cardData = mapProjectToCard(project);
        return createUniversalCard(cardData);
    },
    
    // Batch rendering functions
    renderBlogPosts(posts) {
        return posts.map(this.renderBlogPost).join('');
    },
    
    renderProjects(projects) {
        return projects.map(this.renderProject).join('');
    },
    
    // Type constants for external use
    CARD_TYPES
};

// Make available globally
window.CardRenderer = CardRenderer;
