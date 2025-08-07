// Projects component using modern functional approach

// === Template Functions ===

function createProjectCard(project) {
    return `
        <div class="blog-card" onclick="window.open('${project.projectUrl}', '_blank')">
            <div class="blog-card-content">
                <div class="blog-card-header">
                    <h3 class="blog-card-title">${project.title}</h3>
                    <div class="blog-card-meta">
                        <span class="blog-category">${ProjectsService.getCategoryName(project.category)}</span>
                    </div>
                </div>
                
                <p class="blog-card-excerpt">${project.description}</p>
                
                <div class="blog-card-footer">
                    <div class="blog-card-tech-stack">
                        <strong>Tech Stack:</strong> ${project.techStack}
                    </div>
                    <div class="blog-card-actions">
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" onclick="event.stopPropagation()" class="project-link">GitHub</a>` : ''}
                        <a href="${project.projectUrl}" target="_blank" onclick="event.stopPropagation()" class="project-link primary">View Project</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createCategoryFilter(categories, currentCategory) {
    const categoryLinks = Object.entries(categories).map(([key, name]) => {
        const isActive = currentCategory === key ? 'active' : '';
        return `<a href="./projects.html?category=${key}" class="category-filter ${isActive}">${name}</a>`;
    }).join('');

    const allActive = !currentCategory ? 'active' : '';
    
    return `
        <div class="blog-filters">
            <a href="./projects.html" class="category-filter ${allActive}">All Projects</a>
            ${categoryLinks}
        </div>
    `;
}

function createProjectsGrid(projects) {
    if (projects.length === 0) {
        return '<div class="no-projects"><p>No projects found for this category.</p></div>';
    }

    return projects.map(createProjectCard).join('');
}

function createLoadingState() {
    return `
        <div class="loading-state">
            <p>Loading projects...</p>
        </div>
    `;
}

function createErrorState(error) {
    return `
        <div class="error-state">
            <p>Sorry, there was an error loading the projects.</p>
            <p class="error-details">${error.message}</p>
        </div>
    `;
}

// === Main Render Function ===

async function renderProjects() {
    const container = document.getElementById('projects-container');
    const { category } = ProjectsService.getUrlParams();
    
    // Show loading state
    container.innerHTML = createLoadingState();
    
    try {
        // Load projects and categories
        const [projects, categories] = await Promise.all([
            ProjectsService.getProjects(category),
            Promise.resolve(ProjectsService.categories)
        ]);
        
        // Update page title based on category
        if (category) {
            const categoryName = ProjectsService.getCategoryName(category);
            document.querySelector('.blog-header h1').textContent = `${categoryName} Projects`;
            document.querySelector('.blog-header p').textContent = `Explore my ${categoryName.toLowerCase()} projects and implementations.`;
        }
        
        // Render category filters and projects
        const filtersHtml = createCategoryFilter(categories, category);
        const projectsHtml = createProjectsGrid(projects);
        
        container.innerHTML = `
            ${filtersHtml}
            <div class="blog-cards">
                ${projectsHtml}
            </div>
        `;
        
    } catch (error) {
        console.error('Error rendering projects:', error);
        container.innerHTML = createErrorState(error);
    }
}

// === Initialization ===

document.addEventListener('DOMContentLoaded', async () => {
    // Load required services
    await import('../util/projects-service.js');
    
    // Render projects
    await renderProjects();
});
