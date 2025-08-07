// Projects listing component using shared card renderer
const projectsData = {
    navigation: {
        homeUrl: "./index.html",
        homeLabel: "Home"
    },
    ui: {
        title: "Projects",
        subtitle: "Showcasing various technologies and solutions",
        noProjectsMessage: "No projects found in this category.",
        loadingMessage: "Loading projects..."
    }
};

const BackToHome = `
<div class="blog-navigation">
  <a href="${projectsData.navigation.homeUrl}" aria-label="Go back to homepage" class="back-link">
    <i class="fa-solid fa-arrow-left"></i> ${projectsData.navigation.homeLabel}
  </a>
</div>
`;

// Category filter component
function createCategoryFilter(currentCategory) {
    const categories = [
        { key: null, name: 'All Projects' },
        { key: 'web', name: 'Web Development' },
        { key: 'react', name: 'React & TypeScript' },
        { key: 'data-science', name: 'Data Science & R&D' },
        { key: 'flutter', name: 'Flutter Development' }
    ];

    return `
    <div class="category-filter">
      <h3>Categories</h3>
      <div class="category-buttons">
        ${categories.map(cat => `
          <a href="./projects.html${cat.key ? `?category=${cat.key}` : ''}" 
             class="category-btn ${currentCategory === cat.key ? 'active' : ''}"
             aria-label="Filter by ${cat.name}">
            ${cat.name}
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// Main projects listing
let projects = [];
let currentCategory = null;

async function loadProjectsContent() {
    // Ensure ProjectsService is available
    if (!window.ProjectsService) {
        console.error('ProjectsService not available');
        return;
    }

    const params = window.ProjectsService.getUrlParams();
    currentCategory = params.category;

    try {
        projects = await window.ProjectsService.getProjects(currentCategory);
        console.log(`Loaded ${projects.length} projects for category: ${currentCategory || 'all'}`);
    } catch (error) {
        console.warn('Error loading projects:', error);
        projects = [];
    }
}

function renderProjectsPage() {
    const categoryName = currentCategory ? window.ProjectsService.getCategoryName(currentCategory) : 'All Categories';
    const subtitle = currentCategory ? `${categoryName} Projects` : projectsData.ui.subtitle;

    const ProjectsPage = `
    ${BackToHome}
    <div class="blog-container">
      <header class="blog-header">
        <h1>${projectsData.ui.title}</h1>
        <p class="blog-subtitle">${subtitle}</p>
      </header>
      
      ${createCategoryFilter(currentCategory)}
      
      <main class="blog-grid" role="main" aria-label="Project showcase">
        ${projects.length > 0
            ? window.CardRenderer.renderProjects(projects)
            : `<p class="no-posts">${projectsData.ui.noProjectsMessage}</p>`
        }
      </main>
    </div>
  `;

    const projectsElement = document.getElementById('projects');
    if (projectsElement) {
        projectsElement.innerHTML = ProjectsPage;
    } else {
        console.error('Projects container element not found');
    }
}

window.addEventListener('DOMContentLoaded', async function () {
    // Check if we're on the projects page
    if (!document.getElementById('projects')) {
        return;
    }

    // Wait for required services to be available
    let attempts = 0;
    while ((!window.ProjectsService || !window.CardRenderer) && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 10));
        attempts++;
    }

    if (!window.ProjectsService || !window.CardRenderer) {
        console.error('Required services failed to initialize');
        return;
    }

    // Show loading state
    const projectsElement = document.getElementById('projects');
    if (projectsElement) {
        projectsElement.innerHTML = `
      ${BackToHome}
      <div class="blog-container">
        <p class="loading">${projectsData.ui.loadingMessage}</p>
      </div>
    `;
    }

    // Load and render content
    await loadProjectsContent();
    renderProjectsPage();
});
