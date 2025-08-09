/**
 * Minimal Skills Visualization for Testing
 */

class SimpleSkillsVisualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.skillsData = null;
        
        console.log(`SimpleSkillsVisualization created for container: ${containerId}`, this.container);
    }

    async init() {
        try {
            console.log('Initializing simple skills visualization...');
            
            if (!this.container) {
                throw new Error(`Container element with ID "${this.containerId}" not found`);
            }
            
            this.skillsData = await window.SkillsService.loadSkillsData();
            console.log('Skills data loaded:', this.skillsData);
            
            if (!this.skillsData || !this.skillsData.skillCategories) {
                throw new Error('Invalid skills data structure');
            }
            
            this.render();
            console.log('Simple visualization initialized successfully');
        } catch (error) {
            console.error('Error initializing simple visualization:', error);
            this.renderError(error);
        }
    }

    render() {
        console.log('Rendering simple skills visualization...');
        
        const categories = this.skillsData.skillCategories;
        
        const html = `
            <div class="simple-skills" style="padding: 20px; font-family: Arial, sans-serif;">
                <h2 style="text-align: center; color: #333; margin-bottom: 30px;">Technical Skills & Expertise</h2>
                
                <div class="skills-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    ${categories.map(category => `
                        <div class="skill-category" style="background: white; border: 2px solid ${category.color}; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <h3 style="color: ${category.color}; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.5em;">${category.icon}</span>
                                ${category.name}
                            </h3>
                            
                            <div class="skills-list">
                                ${category.skills.map(skill => `
                                    <div class="skill-item" style="margin: 10px 0; padding: 8px; background: #f9f9f9; border-radius: 4px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <span style="font-weight: 500;">${skill.name}</span>
                                            <span style="background: ${category.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                                                ${skill.level}/10
                                            </span>
                                        </div>
                                        <div style="margin-top: 4px; font-size: 12px; color: #666;">
                                            ${skill.yearsOfExperience} years experience
                                        </div>
                                        <div style="margin-top: 4px; width: 100%; background: #e0e0e0; border-radius: 10px; height: 6px;">
                                            <div style="width: ${(skill.level / 10) * 100}%; background: ${category.color}; height: 100%; border-radius: 10px;"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                    📊 ${categories.length} skill categories • ${categories.reduce((total, cat) => total + cat.skills.length, 0)} total skills
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        console.log('Simple visualization rendered successfully');
    }

    renderError(error) {
        if (this.container) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: red;">
                    <h3>⚠️ Error Loading Skills Visualization</h3>
                    <p>${error.message}</p>
                    <p style="font-size: 12px; color: #666;">Check console for more details</p>
                </div>
            `;
        }
    }
}

// Make SimpleSkillsVisualization available globally
window.SimpleSkillsVisualization = SimpleSkillsVisualization;
console.log('SimpleSkillsVisualization component loaded');
