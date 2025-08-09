/**
 * Skills Visualization Component
 * Interactive radar chart and skill tree visualization
 */

class SkillsVisualization {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = {
            width: options.width || 600,
            height: options.height || 600,
            animationDuration: options.animationDuration || 1000,
            showDetails: options.showDetails !== false,
            ...options
        };
        
        this.skillsData = null;
        this.currentView = 'radar'; // 'radar' or 'tree'
        this.selectedCategory = null;
        
        console.log(`SkillsVisualization created for container: ${containerId}`, this.container);
    }

    /**
     * Initialize the visualization
     */
    async init() {
        try {
            console.log('Initializing skills visualization...');
            console.log('Container:', this.container);
            
            if (!this.container) {
                throw new Error(`Container element with ID "${this.containerId}" not found`);
            }
            
            this.skillsData = await window.SkillsService.loadSkillsData();
            console.log('Skills data loaded:', this.skillsData);
            
            if (!this.skillsData || !this.skillsData.skillCategories) {
                throw new Error('Invalid skills data structure');
            }
            
            this.render();
            this.attachEventListeners();
            console.log('Skills visualization initialized successfully');
        } catch (error) {
            console.error('Error initializing skills visualization:', error);
            this.renderError();
        }
    }

    /**
     * Main render method
     */
    render() {
        console.log('Rendering skills visualization...');
        console.log('Container:', this.container);
        console.log('Skills data:', this.skillsData);
        
        if (!this.container) {
            console.error('Skills visualization container not found');
            return;
        }

        if (!this.skillsData || !this.skillsData.skillCategories) {
            console.error('Invalid skills data for rendering');
            this.renderError();
            return;
        }

        const htmlContent = `
            <div class="skills-visualization">
                <div class="skills-header">
                    <h2 class="skills-title">Technical Skills & Expertise</h2>
                    <div class="skills-controls">
                        <div class="view-toggle">
                            <button class="toggle-btn ${this.currentView === 'radar' ? 'active' : ''}" data-view="radar">
                                📊 Radar Chart
                            </button>
                            <button class="toggle-btn ${this.currentView === 'tree' ? 'active' : ''}" data-view="tree">
                                🌳 Skill Tree
                            </button>
                        </div>
                        <div class="category-filter">
                            ${this.renderCategoryFilter()}
                        </div>
                    </div>
                </div>
                
                <div class="skills-content">
                    <div class="skills-chart-container">
                        ${this.currentView === 'radar' ? this.renderRadarChart() : this.renderSkillTree()}
                    </div>
                    
                    ${this.options.showDetails ? this.renderSkillDetails() : ''}
                </div>
                
                <div class="skills-summary">
                    ${this.renderSummary()}
                </div>
            </div>
        `;

        console.log('Setting HTML content...');
        this.container.innerHTML = htmlContent;

        // Add animations after render
        setTimeout(() => this.addAnimations(), 100);
        
        console.log('Render complete');
    }

    /**
     * Render category filter buttons
     */
    renderCategoryFilter() {
        const categories = this.skillsData.skillCategories;
        
        return `
            <select class="category-select" id="category-filter">
                <option value="">All Categories</option>
                ${categories.map(category => `
                    <option value="${category.id}" ${this.selectedCategory === category.id ? 'selected' : ''}>
                        ${category.icon} ${category.name}
                    </option>
                `).join('')}
            </select>
        `;
    }

    /**
     * Render radar chart visualization
     */
    renderRadarChart() {
        const categories = this.getFilteredCategories();
        const maxLevel = 10;
        const centerX = this.options.width / 2;
        const centerY = this.options.height / 2;
        const radius = Math.min(this.options.width, this.options.height) / 2 - 60;

        // Calculate positions for each category
        const points = categories.map((category, index) => {
            const angle = (index / categories.length) * 2 * Math.PI - Math.PI / 2;
            const avgLevel = category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length;
            const distance = (avgLevel / maxLevel) * radius;
            
            return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                labelX: centerX + Math.cos(angle) * (radius + 30),
                labelY: centerY + Math.sin(angle) * (radius + 30),
                category,
                avgLevel,
                angle
            };
        });

        return `
            <div class="radar-chart" style="width: ${this.options.width}px; height: ${this.options.height}px;">
                <svg width="${this.options.width}" height="${this.options.height}" class="radar-svg">
                    <!-- Background circles -->
                    ${[2, 4, 6, 8, 10].map(level => `
                        <circle cx="${centerX}" cy="${centerY}" r="${(level / maxLevel) * radius}" 
                                fill="none" stroke="var(--border-light, #e5e7eb)" stroke-width="1" opacity="0.3"/>
                        <text x="${centerX + 5}" y="${centerY - (level / maxLevel) * radius + 5}" 
                              fill="var(--text-secondary, #6b7280)" font-size="12" opacity="0.7">${level}</text>
                    `).join('')}
                    
                    <!-- Axis lines -->
                    ${points.map(point => `
                        <line x1="${centerX}" y1="${centerY}" x2="${point.labelX}" y2="${point.labelY}" 
                              stroke="var(--border-light, #e5e7eb)" stroke-width="1" opacity="0.3"/>
                    `).join('')}
                    
                    <!-- Data polygon -->
                    <polygon points="${points.map(p => `${p.x},${p.y}`).join(' ')}" 
                             fill="${points[0]?.category.color || '#3B82F6'}" 
                             fill-opacity="0.2" 
                             stroke="${points[0]?.category.color || '#3B82F6'}" 
                             stroke-width="2"
                             class="radar-polygon"/>
                    
                    <!-- Data points -->
                    ${points.map((point, index) => `
                        <circle cx="${point.x}" cy="${point.y}" r="6" 
                                fill="${point.category.color}" 
                                stroke="white" 
                                stroke-width="2"
                                class="radar-point"
                                data-category="${point.category.id}"
                                data-index="${index}"/>
                    `).join('')}
                    
                    <!-- Labels -->
                    ${points.map(point => `
                        <text x="${point.labelX}" y="${point.labelY}" 
                              text-anchor="middle" 
                              fill="var(--text-primary, #1f2937)" 
                              font-size="14" 
                              font-weight="600"
                              class="radar-label">
                            ${point.category.icon} ${point.category.name}
                        </text>
                    `).join('')}
                </svg>
            </div>
        `;
    }

    /**
     * Render skill tree visualization
     */
    renderSkillTree() {
        const categories = this.getFilteredCategories();
        
        return `
            <div class="skill-tree">
                ${categories.map(category => `
                    <div class="skill-category" data-category="${category.id}">
                        <div class="category-header" style="border-left: 4px solid ${category.color}">
                            <h3 class="category-title">
                                <span class="category-icon">${category.icon}</span>
                                ${category.name}
                            </h3>
                            <div class="category-stats">
                                ${category.skills.length} skills • 
                                Avg: ${(category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length).toFixed(1)}/10
                            </div>
                        </div>
                        
                        <div class="skills-grid">
                            ${category.skills.map(skill => `
                                <div class="skill-item" data-skill="${skill.name}">
                                    <div class="skill-header">
                                        <span class="skill-name">${skill.name}</span>
                                        <span class="skill-level">${skill.level}/10</span>
                                    </div>
                                    
                                    <div class="skill-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" 
                                                 style="width: ${(skill.level / 10) * 100}%; background-color: ${category.color}">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="skill-meta">
                                        <span class="experience">${skill.yearsOfExperience} years</span>
                                        <span class="projects">${skill.projects?.length || 0} projects</span>
                                    </div>
                                    
                                    <div class="skill-description">
                                        ${skill.description}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render skill details panel
     */
    renderSkillDetails() {
        return `
            <div class="skill-details-panel">
                <h3>Skill Details</h3>
                <div id="skill-details-content">
                    <p class="details-placeholder">Hover over a skill to see details</p>
                </div>
            </div>
        `;
    }

    /**
     * Render summary statistics
     */
    renderSummary() {
        const summary = this.skillsData.summary;
        
        return `
            <div class="skills-summary-grid">
                <div class="summary-card">
                    <div class="summary-number">${summary.totalSkills}</div>
                    <div class="summary-label">Technical Skills</div>
                </div>
                
                <div class="summary-card">
                    <div class="summary-number">${summary.totalYearsExperience}+</div>
                    <div class="summary-label">Years Experience</div>
                </div>
                
                <div class="summary-card">
                    <div class="summary-number">${this.skillsData.skillCategories.length}</div>
                    <div class="summary-label">Skill Categories</div>
                </div>
                
                <div class="summary-card specialties">
                    <div class="summary-label">Specialties</div>
                    <div class="specialties-list">
                        ${summary.specialties?.map(specialty => `
                            <span class="specialty-tag">${specialty}</span>
                        `).join('') || ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get filtered categories based on selection
     */
    getFilteredCategories() {
        const categories = this.skillsData.skillCategories;
        
        if (this.selectedCategory) {
            return categories.filter(cat => cat.id === this.selectedCategory);
        }
        
        return categories;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // View toggle buttons
        this.container.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentView = e.target.dataset.view;
                this.render();
            });
        });

        // Category filter
        const categoryFilter = this.container.querySelector('#category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.selectedCategory = e.target.value || null;
                this.render();
            });
        }

        // Skill hover effects
        this.addHoverEffects();
    }

    /**
     * Add hover effects for interactive elements
     */
    addHoverEffects() {
        // Radar chart points
        this.container.querySelectorAll('.radar-point').forEach(point => {
            point.addEventListener('mouseenter', (e) => {
                const categoryId = e.target.dataset.category;
                this.showCategoryDetails(categoryId);
            });
        });

        // Skill tree items
        this.container.querySelectorAll('.skill-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const skillName = e.target.closest('.skill-item').dataset.skill;
                this.showSkillDetails(skillName);
            });
        });
    }

    /**
     * Show category details
     */
    showCategoryDetails(categoryId) {
        const category = this.skillsData.skillCategories.find(cat => cat.id === categoryId);
        if (!category) return;

        const detailsPanel = this.container.querySelector('#skill-details-content');
        if (detailsPanel) {
            detailsPanel.innerHTML = `
                <h4>${category.icon} ${category.name}</h4>
                <p><strong>${category.skills.length} skills</strong> in this category</p>
                <div class="category-skills">
                    ${category.skills.map(skill => `
                        <div class="skill-summary">
                            <strong>${skill.name}</strong> (${skill.level}/10) - ${skill.yearsOfExperience} years
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    /**
     * Show individual skill details
     */
    showSkillDetails(skillName) {
        const allSkills = this.skillsData.skillCategories.flatMap(cat => 
            cat.skills.map(skill => ({ ...skill, category: cat }))
        );
        
        const skill = allSkills.find(s => s.name === skillName);
        if (!skill) return;

        const detailsPanel = this.container.querySelector('#skill-details-content');
        if (detailsPanel) {
            detailsPanel.innerHTML = `
                <h4>${skill.name}</h4>
                <div class="skill-detail-stats">
                    <span class="stat">Level: ${skill.level}/10</span>
                    <span class="stat">Experience: ${skill.yearsOfExperience} years</span>
                    <span class="stat">Projects: ${skill.projects?.length || 0}</span>
                </div>
                <p>${skill.description}</p>
                ${skill.projects && skill.projects.length > 0 ? `
                    <div class="related-projects">
                        <strong>Related Projects:</strong>
                        ${skill.projects.map(project => `<span class="project-tag">${project}</span>`).join('')}
                    </div>
                ` : ''}
            `;
        }
    }

    /**
     * Add animations to elements
     */
    addAnimations() {
        // Fade in animation
        const elements = this.container.querySelectorAll('.skill-item, .radar-point, .summary-card');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'all 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Progress bar animations
        setTimeout(() => {
            this.container.querySelectorAll('.progress-fill').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease';
                    bar.style.width = width;
                }, 500);
            });
        }, 300);
    }

    /**
     * Render error state
     */
    renderError() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="skills-error">
                    <h3>Unable to load skills data</h3>
                    <p>Please try refreshing the page.</p>
                </div>
            `;
        }
    }
}

// Make SkillsVisualization available globally
window.SkillsVisualization = SkillsVisualization;
console.log('SkillsVisualization component loaded');
