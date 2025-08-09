/**
 * Skills Page Component
 * Manages the skills visualization page
 */

const skillsPageData = {
    ui: {
        title: "Technical Skills & Expertise",
        subtitle: "Interactive visualization of my technical abilities and experience",
        loadingMessage: "Loading skills data..."
    },
    navigation: {
        homeUrl: "/",
        homeLabel: "Home"
    }
};

let skillsVisualization = null;

/**
 * Initialize skills page
 */
async function initSkillsPage() {
    try {
        console.log('Initializing skills page...');
        
        // First check if required dependencies are available
        if (!window.SkillsService) {
            throw new Error('SkillsService not available - scripts may not have loaded properly');
        }
        
        if (!window.SkillsVisualization) {
            throw new Error('SkillsVisualization not available - scripts may not have loaded properly');
        }
        
        console.log('✅ Dependencies available - SkillsService:', !!window.SkillsService, 'SkillsVisualization:', !!window.SkillsVisualization);
        
        const skillsElement = document.getElementById('skills');
        if (!skillsElement) {
            throw new Error('Skills element not found');
        }

        // Show loading state first
        skillsElement.innerHTML = `
            ${window.UIComponents ? window.UIComponents.BackToHome : createSimpleBackButton()}
            <div class="skills-container">
                <div style="text-align: center; padding: 2rem;">
                    <h2>Loading Skills Visualization...</h2>
                    <div style="margin: 1rem 0;">⏳</div>
                </div>
            </div>
        `;

        // Wait a moment for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 100));

        // Create container for visualization
        const containerHtml = `
            ${window.UIComponents ? window.UIComponents.BackToHome : createSimpleBackButton()}
            <div id="skills-viz-container" style="width: 100%; min-height: 600px;"></div>
        `;
        
        skillsElement.innerHTML = containerHtml;

        // Wait for container to be ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Verify container exists
        const vizContainer = document.getElementById('skills-viz-container');
        if (!vizContainer) {
            throw new Error('Visualization container was not created properly');
        }

        console.log('Container ready, creating visualization...');

        // Initialize the enhanced interactive radar chart
        if (window.EnhancedSkillsRadar) {
            console.log('Using EnhancedSkillsRadar...');
            skillsVisualization = new window.EnhancedSkillsRadar('skills-viz-container', {
                width: 700,
                height: 700,
                animationDuration: 1200,
                interactive: true,
                theme: 'modern'
            });
        } else {
            console.log('Fallback to SkillsVisualization...');
            skillsVisualization = new window.SkillsVisualization('skills-viz-container', {
                width: 700,
                height: 700,
                showDetails: true,
                animationDuration: 1200,
                interactive: true,
                theme: 'modern'
            });
        }

        // Initialize the visualization
        await skillsVisualization.init();

        console.log('Skills page initialized successfully');
    } catch (error) {
        console.error('Error initializing skills page:', error);
        showErrorState(error.message);
    }
}

/**
 * Create simple back button fallback
 */
function createSimpleBackButton() {
    return `
        <div style="margin: 2rem 0;">
            <a href="${skillsPageData.navigation.homeUrl}" 
               style="color: var(--text-twilight); text-decoration: none; font-weight: 500;">
                ← ${skillsPageData.navigation.homeLabel}
            </a>
        </div>
    `;
}

/**
 * Show error state
 */
function showErrorState(errorMessage = 'Unknown error occurred') {
    const skillsElement = document.getElementById('skills');
    if (skillsElement) {
        skillsElement.innerHTML = `
            ${window.UIComponents ? window.UIComponents.BackToHome : createSimpleBackButton()}
            <div class="skills-error" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <h2>Unable to load skills visualization</h2>
                <p>Error: ${errorMessage}</p>
                <p>Please try refreshing the page or check the browser console for more details.</p>
                <button onclick="location.reload()" style="
                    padding: 0.75rem 1.5rem;
                    background: var(--accent-primary, #3B82F6);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 1rem;
                ">
                    Retry
                </button>
            </div>
        `;
    }
}

/**
 * Page load event handler - Removed to prevent double initialization
 * Now called manually from skills.html after scripts are loaded
 */

// Make functions available globally for debugging
window.SkillsPage = {
    init: initSkillsPage,
    showError: showErrorState,
    visualization: () => skillsVisualization
};

// Make initSkillsPage available globally
window.initSkillsPage = initSkillsPage;
