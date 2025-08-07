// Modern projects service using functional approach

// Configuration constants
const PROJECTS_CONFIG = {
    indexPath: './public/data/projects-index.json',
    categories: {
        web: 'Web Development',
        react: 'React & TypeScript',
        'data-science': 'Data Science & R&D',
        flutter: 'Flutter Development'
    }
};

// Private module-level cache
let projectsIndexCache = null;

// === Core Data Loading Functions ===

async function loadProjectsIndex() {
    if (projectsIndexCache) return projectsIndexCache;
    
    try {
        const response = await fetch(PROJECTS_CONFIG.indexPath);
        if (!response.ok) {
            throw new Error(`Failed to load projects index: ${response.statusText}`);
        }
        projectsIndexCache = await response.json();
        return projectsIndexCache;
    } catch (error) {
        console.error('Error loading projects index:', error);
        return createFallbackProjectsIndex();
    }
}

function createFallbackProjectsIndex() {
    return {
        projects: [],
        categories: PROJECTS_CONFIG.categories
    };
}

// === Main Projects Functions ===

async function getProjects(category = null) {
    const index = await loadProjectsIndex();
    let projects = index.projects || [];

    if (category) {
        projects = projects.filter(project => project.category === category);
    }

    // Sort by featured first, then by title
    return projects.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.title.localeCompare(b.title);
    });
}

async function getFeaturedProjects() {
    const index = await loadProjectsIndex();
    return (index.projects || [])
        .filter(project => project.featured)
        .sort((a, b) => a.title.localeCompare(b.title));
}

async function getProject(id) {
    const index = await loadProjectsIndex();
    return (index.projects || []).find(project => project.id === id) || null;
}

// === Utility Functions ===

function getCategoryName(categoryKey) {
    return PROJECTS_CONFIG.categories[categoryKey] || categoryKey;
}

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category'),
        project: params.get('project')
    };
}

// === Public API ===

const ProjectsService = {
    // Main functions
    getProjects,
    getFeaturedProjects,
    getProject,
    
    // Utility functions
    getCategoryName,
    getUrlParams,
    
    // Config access (read-only)
    get categories() {
        return { ...PROJECTS_CONFIG.categories };
    }
};

// Make available globally
window.ProjectsService = ProjectsService;
