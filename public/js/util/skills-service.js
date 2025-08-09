/**
 * Skills Service - Handles skills data operations
 * Follows the same pattern as BlogService and ProjectsService
 */

let skillsCache = null;

/**
 * Load skills data from JSON file
 * @returns {Promise<Object>} Skills data object
 */
async function loadSkillsData() {
    if (skillsCache) {
        console.log('Using cached skills data');
        return skillsCache;
    }

    try {
        console.log('Loading skills data from JSON...');
        const response = await fetch('./public/data/skills-data.json');
        if (!response.ok) {
            throw new Error(`Failed to load skills data: ${response.status} ${response.statusText}`);
        }
        
        skillsCache = await response.json();
        console.log('Skills data loaded successfully:', skillsCache);
        return skillsCache;
    } catch (error) {
        console.error('Error loading skills data:', error);
        return { skillCategories: [], summary: {} };
    }
}

/**
 * Get all skill categories
 * @returns {Promise<Array>} Array of skill categories
 */
async function getSkillCategories() {
    const data = await loadSkillsData();
    return data.skillCategories || [];
}

/**
 * Get skills by category
 * @param {string} categoryId - Category ID to filter by
 * @returns {Promise<Array>} Array of skills in the category
 */
async function getSkillsByCategory(categoryId) {
    const categories = await getSkillCategories();
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.skills : [];
}

/**
 * Get all skills flattened from all categories
 * @returns {Promise<Array>} Array of all skills with category info
 */
async function getAllSkills() {
    const categories = await getSkillCategories();
    return categories.flatMap(category => 
        category.skills.map(skill => ({
            ...skill,
            categoryId: category.id,
            categoryName: category.name,
            categoryColor: category.color
        }))
    );
}

/**
 * Get skills summary statistics
 * @returns {Promise<Object>} Summary object with stats
 */
async function getSkillsSummary() {
    const data = await loadSkillsData();
    return data.summary || {};
}

/**
 * Get top skills by level
 * @param {number} limit - Number of top skills to return
 * @returns {Promise<Array>} Array of top skills
 */
async function getTopSkills(limit = 5) {
    const skills = await getAllSkills();
    return skills
        .sort((a, b) => b.level - a.level)
        .slice(0, limit);
}

/**
 * Search skills by name or description
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching skills
 */
async function searchSkills(query) {
    const skills = await getAllSkills();
    const lowercaseQuery = query.toLowerCase();
    
    return skills.filter(skill => 
        skill.name.toLowerCase().includes(lowercaseQuery) ||
        skill.description.toLowerCase().includes(lowercaseQuery)
    );
}

/**
 * Get skills with experience level above threshold
 * @param {number} minLevel - Minimum skill level (1-10)
 * @returns {Promise<Array>} Array of skills above threshold
 */
async function getSkillsAboveLevel(minLevel = 7) {
    const skills = await getAllSkills();
    return skills.filter(skill => skill.level >= minLevel);
}

// Make functions available globally
const SkillsService = {
    loadSkillsData,
    getSkillCategories,
    getSkillsByCategory,
    getAllSkills,
    getSkillsSummary,
    getTopSkills,
    searchSkills,
    getSkillsAboveLevel
};

// Global assignment
window.SkillsService = SkillsService;
console.log('SkillsService loaded and available globally');
