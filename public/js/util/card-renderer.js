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
            url: `/blog-post?post=${post.id}`,
            ariaLabel: `Read full article: ${post.title}`
        },
        image: post.image,
        type: CARD_TYPES.BLOG
    };
}

function mapProjectToCard(project) {
    return {
        id: project.id,
        title: project.title,
        description: project.description,
        primaryMeta: project.techStack,
        secondaryMeta: null,
        footerLeft: null,
        footerRight: {
            text: 'View Project →',
            url: project.projectUrl,
            ariaLabel: `View project: ${project.title}`,
            external: true
        },
        image: project.image,
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
        image,
        type
    } = cardData;
    
    return `
        <article class="blog-card" aria-labelledby="card-${id}">
            <a href="${footerRight.url}" 
               class="blog-card-link"
               ${footerRight.external ? 'target="_blank"' : ''}
               aria-label="${footerRight.ariaLabel}">
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-category contrast-darkMode">${primaryMeta}</span>
                        ${secondaryMeta ? `<time class="blog-date">${secondaryMeta}</time>` : ''}
                    </div>
                    <h2 id="card-${id}" class="blog-title">${title}</h2>
                    ${image ? `<img src="${image}" alt="${title}" class="card-image" loading="lazy" decoding="async" width="325" height="325" />` : ''}
                    <p class="blog-excerpt">${description}</p>
                    <div class="blog-footer">
                        ${footerLeft ? `<span class="blog-read-time">${footerLeft}</span>` : '<span></span>'}
                        <span class="blog-read-more">${footerRight.text}</span>
                    </div>
                </div>
            </a>
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
