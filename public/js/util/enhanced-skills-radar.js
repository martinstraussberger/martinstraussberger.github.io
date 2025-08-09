/**
 * Enhanced Interactive Skills Radar Chart
 * Modern UX/UI implementation with smooth animations and interactions
 */

class EnhancedSkillsRadar {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        // Responsive sizing based on screen width
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 768;
        const isTablet = screenWidth >= 768 && screenWidth < 1024;
        
        this.options = {
            width: this.getResponsiveWidth(screenWidth),
            height: this.getResponsiveHeight(screenWidth),
            animationDuration: options.animationDuration || (isMobile ? 800 : 1200),
            interactive: options.interactive !== false,
            theme: options.theme || 'modern',
            showTooltips: options.showTooltips !== false && !isMobile, // Disable tooltips on mobile
            isMobile,
            isTablet,
            ...options
        };
        
        this.skillsData = null;
        this.selectedCategory = null;
        this.hoveredPoint = null;
        this.animationId = null;
        this.resizeTimeout = null;
        
        console.log(`EnhancedSkillsRadar created for container: ${containerId}`, {
            screenWidth,
            isMobile,
            isTablet,
            dimensions: `${this.options.width}x${this.options.height}`
        });
        
        // Add resize listener for responsive updates
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    getResponsiveWidth(screenWidth) {
        if (screenWidth < 380) return 280;
        if (screenWidth < 480) return Math.min(screenWidth - 40, 320);
        if (screenWidth < 768) return Math.min(screenWidth - 60, 400);
        if (screenWidth < 1024) return Math.min(screenWidth - 100, 600);
        return 700;
    }

    getResponsiveHeight(screenWidth) {
        if (screenWidth < 380) return 280;
        if (screenWidth < 480) return Math.min(screenWidth - 40, 320);
        if (screenWidth < 768) return Math.min(screenWidth - 60, 400);
        if (screenWidth < 1024) return Math.min(screenWidth - 100, 600);
        return 700;
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            const newScreenWidth = window.innerWidth;
            const newWidth = this.getResponsiveWidth(newScreenWidth);
            const newHeight = this.getResponsiveHeight(newScreenWidth);
            
            // Only re-render if dimensions changed significantly
            if (Math.abs(newWidth - this.options.width) > 50 || 
                Math.abs(newHeight - this.options.height) > 50) {
                
                this.options.width = newWidth;
                this.options.height = newHeight;
                this.options.isMobile = newScreenWidth < 768;
                this.options.isTablet = newScreenWidth >= 768 && newScreenWidth < 1024;
                
                console.log('Responsive resize triggered', {
                    newDimensions: `${newWidth}x${newHeight}`,
                    isMobile: this.options.isMobile
                });
                
                this.render();
            }
        }, 300);
    }

    async init() {
        try {
            console.log('Initializing enhanced skills radar chart...');
            
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
            this.animateEntry();
            
            console.log('Enhanced radar chart initialized successfully');
        } catch (error) {
            console.error('Error initializing enhanced radar chart:', error);
            this.renderError(error);
        }
    }

    render() {
        const categories = this.getFilteredCategories();
        const maxLevel = 10;
        const centerX = this.options.width / 2;
        const centerY = this.options.height / 2;
        const radius = Math.min(this.options.width, this.options.height) / 2 - 80;

        // Calculate radar chart data
        const radarData = this.calculateRadarData(categories, centerX, centerY, radius, maxLevel);

        const html = `
            <div class="enhanced-skills-radar" style="max-width: 100%; margin: 0 auto;">
                <!-- Header Section -->
                <div class="radar-header" style="text-align: center; margin-bottom: 2rem;">
                    <h2 style="font-size: 2rem; font-weight: 700; color: var(--text-primary, #1f2937); margin: 0 0 0.5rem 0;">
                        Technical Skills Radar
                    </h2>
                    <p style="color: var(--text-secondary, #6b7280); font-size: 1.1rem; margin: 0;">
                        Interactive visualization of expertise across ${categories.length} skill domains
                    </p>
                </div>

                <!-- Controls Section -->
                <div class="radar-controls" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;">
                    ${this.renderCategoryFilters()}
                </div>

                <!-- Main Radar Chart -->
                <div class="radar-chart-container" style="position: relative; display: flex; justify-content: center;">
                    <svg width="${this.options.width}" height="${this.options.height}" 
                         class="radar-svg" style="max-width: 100%; height: auto; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.1));">
                        
                        <!-- Background Grid -->
                        ${this.renderRadarGrid(centerX, centerY, radius, maxLevel)}
                        
                        <!-- Axis Lines -->
                        ${this.renderAxisLines(radarData.points, centerX, centerY)}
                        
                        <!-- Data Area -->
                        ${this.renderDataArea(radarData.points)}
                        
                        <!-- Data Points -->
                        ${this.renderDataPoints(radarData.points)}
                        
                        <!-- Category Labels -->
                        ${this.renderCategoryLabels(radarData.points)}
                        
                        <!-- Tooltip Container -->
                        <g class="tooltip-container" style="pointer-events: none;"></g>
                    </svg>

                    <!-- Legend Panel -->
                    ${this.renderLegendPanel(radarData.points)}
                </div>

                <!-- Skills Detail Panel -->
                <div class="skills-detail-panel" style="margin-top: 2rem;">
                    ${this.renderSkillsDetails(categories)}
                </div>

                <!-- Summary Stats -->
                <div class="radar-summary" style="margin-top: 2rem; text-align: center;">
                    ${this.renderSummaryStats(categories)}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.setupInteractivity();
    }

    calculateRadarData(categories, centerX, centerY, radius, maxLevel) {
        const points = categories.map((category, index) => {
            const angle = (index / categories.length) * 2 * Math.PI - Math.PI / 2;
            const avgLevel = category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length;
            const normalizedLevel = avgLevel / maxLevel;
            const distance = normalizedLevel * radius;
            
            // Responsive label positioning
            const labelDistance = this.options.isMobile ? radius + 25 : radius + 50;
            
            return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                labelX: centerX + Math.cos(angle) * labelDistance,
                labelY: centerY + Math.sin(angle) * labelDistance,
                category,
                avgLevel,
                normalizedLevel,
                angle,
                index
            };
        });

        return { points, centerX, centerY, radius, maxLevel };
    }

    renderRadarGrid(centerX, centerY, radius, maxLevel) {
        const levels = [2, 4, 6, 8, 10];
        return `
            <g class="radar-grid">
                ${levels.map(level => `
                    <circle cx="${centerX}" cy="${centerY}" r="${(level / maxLevel) * radius}" 
                            fill="none" 
                            stroke="var(--border-light, #e5e7eb)" 
                            stroke-width="1" 
                            opacity="0.4"
                            class="grid-circle"/>
                    <text x="${centerX + 8}" y="${centerY - (level / maxLevel) * radius - 5}" 
                          fill="var(--text-tertiary, #9ca3af)" 
                          font-size="12" 
                          font-weight="500"
                          opacity="0.8">${level}</text>
                `).join('')}
                
                <!-- Center Point -->
                <circle cx="${centerX}" cy="${centerY}" r="3" 
                        fill="var(--primary-color, #3b82f6)" 
                        opacity="0.8"/>
            </g>
        `;
    }

    renderAxisLines(points, centerX, centerY) {
        return `
            <g class="axis-lines">
                ${points.map(point => `
                    <line x1="${centerX}" y1="${centerY}" 
                          x2="${point.labelX}" y2="${point.labelY}" 
                          stroke="var(--border-light, #e5e7eb)" 
                          stroke-width="1" 
                          opacity="0.3"
                          class="axis-line"/>
                `).join('')}
            </g>
        `;
    }

    renderDataArea(points) {
        if (points.length === 0) return '';
        
        const gradientId = `radar-gradient-${Date.now()}`;
        
        return `
            <defs>
                <radialGradient id="${gradientId}" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" style="stop-color: var(--primary-color, #3b82f6); stop-opacity: 0.4"/>
                    <stop offset="100%" style="stop-color: var(--primary-color, #3b82f6); stop-opacity: 0.1"/>
                </radialGradient>
            </defs>
            
            <g class="data-area">
                <polygon points="${points.map(p => `${p.x},${p.y}`).join(' ')}" 
                         fill="url(#${gradientId})" 
                         stroke="var(--primary-color, #3b82f6)" 
                         stroke-width="3"
                         stroke-linejoin="round"
                         class="radar-polygon"
                         style="filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3)); transition: all 0.3s ease;"/>
            </g>
        `;
    }

    renderDataPoints(points) {
        const pointRadius = this.options.isMobile ? 10 : 8;
        const hoverRadius = this.options.isMobile ? 14 : 12;
        
        return `
            <g class="data-points">
                ${points.map((point, index) => `
                    <circle cx="${point.x}" cy="${point.y}" r="${pointRadius}" 
                            fill="white" 
                            stroke="${point.category.color}" 
                            stroke-width="3"
                            class="radar-point interactive-point"
                            data-category="${point.category.id}"
                            data-index="${index}"
                            style="cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                   filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"
                            onmouseover="if(!window.matchMedia('(hover: none)').matches) { this.setAttribute('r', '${hoverRadius}'); this.style.filter='drop-shadow(0 4px 12px rgba(0,0,0,0.2))'; }"
                            onmouseout="if(!window.matchMedia('(hover: none)').matches) { this.setAttribute('r', '${pointRadius}'); this.style.filter='drop-shadow(0 2px 4px rgba(0,0,0,0.1))'; }"
                            />
                    
                    <!-- Inner dot for visual appeal -->
                    <circle cx="${point.x}" cy="${point.y}" r="${this.options.isMobile ? 4 : 3}" 
                            fill="${point.category.color}" 
                            class="radar-point-inner"
                            style="pointer-events: none;"/>
                `).join('')}
            </g>
        `;
    }

    renderCategoryLabels(points) {
        const labelWidth = this.options.isMobile ? 70 : 90;
        const labelHeight = this.options.isMobile ? 20 : 24;
        const fontSize = this.options.isMobile ? 10 : 12;
        const iconSize = this.options.isMobile ? 12 : 16;
        
        return `
            <g class="category-labels">
                ${points.map(point => {
                    const halfWidth = labelWidth / 2;
                    const halfHeight = labelHeight / 2;
                    
                    return `
                        <g class="category-label-group" data-category="${point.category.id}">
                            <!-- Background for better readability -->
                            <rect x="${point.labelX - halfWidth}" y="${point.labelY - halfHeight}" 
                                  width="${labelWidth}" height="${labelHeight}" 
                                  rx="${halfHeight}" ry="${halfHeight}"
                                  fill="white" 
                                  stroke="${point.category.color}"
                                  stroke-width="2"
                                  opacity="0.95"
                                  style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.1));"/>
                            
                            ${this.options.isMobile ? `
                                <!-- Mobile: Stack icon and text vertically -->
                                <text x="${point.labelX}" y="${point.labelY - 2}" 
                                      text-anchor="middle" 
                                      font-size="${iconSize}" 
                                      class="category-icon">${point.category.icon}</text>
                                
                                <text x="${point.labelX}" y="${point.labelY + 8}" 
                                      text-anchor="middle" 
                                      fill="${point.category.color}" 
                                      font-size="${fontSize - 2}" 
                                      font-weight="600"
                                      class="category-level">${point.avgLevel.toFixed(1)}</text>
                            ` : `
                                <!-- Desktop: Horizontal layout -->
                                <text x="${point.labelX - 25}" y="${point.labelY + 4}" 
                                      text-anchor="middle" 
                                      font-size="${iconSize}" 
                                      class="category-icon">${point.category.icon}</text>
                                
                                <text x="${point.labelX + 5}" y="${point.labelY - 2}" 
                                      text-anchor="middle" 
                                      fill="${point.category.color}" 
                                      font-size="${fontSize}" 
                                      font-weight="600"
                                      class="category-name">${point.category.name}</text>
                                
                                <text x="${point.labelX + 5}" y="${point.labelY + 8}" 
                                      text-anchor="middle" 
                                      fill="var(--text-secondary, #6b7280)" 
                                      font-size="${fontSize - 2}" 
                                      font-weight="500"
                                      class="category-level">${point.avgLevel.toFixed(1)}/10</text>
                            `}
                        </g>
                    `;
                }).join('')}
            </g>
        `;
    }

    renderCategoryFilters() {
        const categories = this.skillsData.skillCategories;
        
        return `
            <button class="category-filter-btn ${!this.selectedCategory ? 'active' : ''}" 
                    data-category="" 
                    style="padding: 0.5rem 1rem; border: 2px solid var(--primary-color, #3b82f6); 
                           background: ${!this.selectedCategory ? 'var(--primary-color, #3b82f6)' : 'white'}; 
                           color: ${!this.selectedCategory ? 'white' : 'var(--primary-color, #3b82f6)'}; 
                           border-radius: 25px; font-weight: 600; cursor: pointer; 
                           transition: all 0.3s ease; font-size: 0.9rem;">
                🎯 All Skills
            </button>
            
            ${categories.map(category => `
                <button class="category-filter-btn ${this.selectedCategory === category.id ? 'active' : ''}" 
                        data-category="${category.id}" 
                        style="padding: 0.5rem 1rem; border: 2px solid ${category.color}; 
                               background: ${this.selectedCategory === category.id ? category.color : 'white'}; 
                               color: ${this.selectedCategory === category.id ? 'white' : category.color}; 
                               border-radius: 25px; font-weight: 600; cursor: pointer; 
                               transition: all 0.3s ease; font-size: 0.9rem;">
                    ${category.icon} ${category.name}
                </button>
            `).join('')}
        `;
    }

    renderLegendPanel(points) {
        const positioning = this.options.isMobile ? 
            'position: static; margin: 1rem auto 0 auto; max-width: 280px; width: calc(100% - 1rem);' :
            'position: absolute; top: 20px; right: 20px; min-width: 200px;';
            
        return `
            <div class="legend-panel" style="${positioning}
                                            background: white; border-radius: 12px; padding: 1rem;
                                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 0.75rem 0; color: var(--text-primary, #1f2937); 
                           font-size: ${this.options.isMobile ? '0.8rem' : '0.9rem'}; font-weight: 600;">
                    📊 Skill Levels
                </h4>
                <div class="legend-items">
                    ${points.map(point => `
                        <div class="legend-item" style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                            <div style="width: ${this.options.isMobile ? '10px' : '12px'}; 
                                        height: ${this.options.isMobile ? '10px' : '12px'}; 
                                        border-radius: 50%; background: ${point.category.color};"></div>
                            <span style="font-size: ${this.options.isMobile ? '0.7rem' : '0.8rem'}; 
                                         color: var(--text-secondary, #6b7280); line-height: 1.2;">
                                ${this.options.isMobile ? point.category.icon : point.category.name}: 
                                <strong>${point.avgLevel.toFixed(1)}/10</strong>
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderSkillsDetails(categories) {
        if (this.selectedCategory) {
            const category = categories.find(cat => cat.id === this.selectedCategory);
            if (category) {
                return `
                    <div class="selected-category-details" style="background: white; border-radius: 12px; padding: 1.5rem;
                                                                  box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 2px solid ${category.color};">
                        <h3 style="color: ${category.color}; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            ${category.icon} ${category.name}
                        </h3>
                        <div class="skills-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                            ${category.skills.map(skill => `
                                <div class="skill-card" style="background: #f9fafb; border-radius: 8px; padding: 1rem; border-left: 4px solid ${category.color};">
                                    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem;">
                                        <span style="font-weight: 600; color: var(--text-primary, #1f2937);">${skill.name}</span>
                                        <span style="background: ${category.color}; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
                                            ${skill.level}/10
                                        </span>
                                    </div>
                                    <div style="font-size: 0.8rem; color: var(--text-secondary, #6b7280); margin-bottom: 0.5rem;">
                                        ${skill.yearsOfExperience} years experience
                                    </div>
                                    <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 6px;">
                                        <div style="width: ${(skill.level / 10) * 100}%; background: ${category.color}; height: 100%; border-radius: 4px; transition: width 0.8s ease;"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }
        
        return `
            <div class="skills-overview" style="text-align: center; color: var(--text-secondary, #6b7280); padding: 2rem;">
                <p style="font-size: 1.1rem;">Select a category above or hover over the radar chart to explore specific skills</p>
            </div>
        `;
    }

    renderSummaryStats(categories) {
        const totalSkills = categories.reduce((sum, cat) => sum + cat.skills.length, 0);
        const avgLevel = categories.reduce((sum, cat) => 
            sum + cat.skills.reduce((catSum, skill) => catSum + skill.level, 0) / cat.skills.length, 0
        ) / categories.length;
        const totalExperience = Math.max(...categories.flatMap(cat => 
            cat.skills.map(skill => skill.yearsOfExperience)
        ));

        return `
            <div class="summary-stats" style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                <div class="stat-item" style="text-align: center; padding: 1rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-width: 120px;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color, #3b82f6);">${totalSkills}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary, #6b7280); font-weight: 500;">Total Skills</div>
                </div>
                <div class="stat-item" style="text-align: center; padding: 1rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-width: 120px;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color, #3b82f6);">${avgLevel.toFixed(1)}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary, #6b7280); font-weight: 500;">Avg Level</div>
                </div>
                <div class="stat-item" style="text-align: center; padding: 1rem; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-width: 120px;">
                    <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color, #3b82f6);">${totalExperience}+</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary, #6b7280); font-weight: 500;">Max Experience</div>
                </div>
            </div>
        `;
    }

    getFilteredCategories() {
        const categories = this.skillsData.skillCategories;
        
        if (this.selectedCategory) {
            return categories.filter(cat => cat.id === this.selectedCategory);
        }
        
        return categories;
    }

    setupInteractivity() {
        // Category filter buttons
        this.container.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryId = e.target.dataset.category;
                this.selectedCategory = categoryId || null;
                this.render(); // Re-render with new filter
                this.animateEntry(); // Animate the transition
            });

            // Touch and hover effects (responsive)
            if (!this.options.isMobile) {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = 'none';
                });
            }

            // Touch feedback for mobile
            if (this.options.isMobile) {
                btn.addEventListener('touchstart', () => {
                    btn.style.transform = 'scale(0.95)';
                    btn.style.opacity = '0.8';
                });
                
                btn.addEventListener('touchend', () => {
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                        btn.style.opacity = '1';
                    }, 150);
                });
            }
        });

        // Radar point interactions
        this.container.querySelectorAll('.radar-point').forEach(point => {
            point.addEventListener('click', (e) => {
                const categoryId = e.target.dataset.category;
                this.selectedCategory = this.selectedCategory === categoryId ? null : categoryId;
                this.render();
                this.animateEntry();
            });

            // Touch feedback for mobile radar points
            if (this.options.isMobile) {
                point.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    point.style.transform = 'scale(1.1)';
                    point.style.filter = 'drop-shadow(0 6px 20px rgba(0,0,0,0.3))';
                });
                
                point.addEventListener('touchend', () => {
                    setTimeout(() => {
                        point.style.transform = 'scale(1)';
                        point.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
                    }, 200);
                });
            }
        });

        // Swipe gestures for mobile category switching
        if (this.options.isMobile) {
            this.addSwipeGestures();
        }
    }

    addSwipeGestures() {
        let startX = 0;
        let startTime = 0;
        const categories = this.skillsData.skillCategories;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
        });

        this.container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endTime = Date.now();
            const deltaX = endX - startX;
            const deltaTime = endTime - startTime;

            // Only process swipes (not taps)
            if (Math.abs(deltaX) > 50 && deltaTime < 300) {
                const currentIndex = this.selectedCategory ? 
                    categories.findIndex(cat => cat.id === this.selectedCategory) : -1;
                
                let newIndex;
                if (deltaX > 0) { // Swipe right - previous category
                    newIndex = currentIndex <= 0 ? categories.length - 1 : currentIndex - 1;
                } else { // Swipe left - next category
                    newIndex = currentIndex >= categories.length - 1 ? 0 : currentIndex + 1;
                }

                this.selectedCategory = categories[newIndex].id;
                this.render();
                this.animateEntry();

                // Show swipe feedback
                this.showSwipeFeedback(deltaX > 0 ? 'Previous' : 'Next');
            }
        });
    }

    showSwipeFeedback(direction) {
        const feedback = document.createElement('div');
        feedback.textContent = `${direction} Category`;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transition = 'opacity 0.3s ease';
            setTimeout(() => document.body.removeChild(feedback), 300);
        }, 1000);
    }

    attachEventListeners() {
        this.setupInteractivity();
    }

    animateEntry() {
        // Animate radar polygon entry
        const polygon = this.container.querySelector('.radar-polygon');
        if (polygon) {
            polygon.style.strokeDasharray = '1000';
            polygon.style.strokeDashoffset = '1000';
            polygon.style.fillOpacity = '0';
            
            setTimeout(() => {
                polygon.style.transition = `stroke-dashoffset ${this.options.animationDuration}ms ease, fill-opacity ${this.options.animationDuration}ms ease`;
                polygon.style.strokeDashoffset = '0';
                polygon.style.fillOpacity = '0.3';
            }, 100);
        }

        // Animate points with staggered timing
        const points = this.container.querySelectorAll('.radar-point');
        points.forEach((point, index) => {
            point.style.transform = 'scale(0)';
            point.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                point.style.transform = 'scale(1)';
            }, 200 + index * 100);
        });

        // Animate labels
        const labels = this.container.querySelectorAll('.category-label-group');
        labels.forEach((label, index) => {
            label.style.opacity = '0';
            label.style.transform = 'translateY(10px)';
            label.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                label.style.opacity = '1';
                label.style.transform = 'translateY(0)';
            }, 400 + index * 80);
        });
    }

    renderError(error) {
        if (this.container) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="color: #dc2626; margin-bottom: 1rem;">Unable to Load Skills Radar</h3>
                    <p style="color: #6b7280; margin-bottom: 1rem;">${error.message}</p>
                    <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: var(--primary-color, #3b82f6); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    // Cleanup method
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        clearTimeout(this.resizeTimeout);
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Make EnhancedSkillsRadar available globally
window.EnhancedSkillsRadar = EnhancedSkillsRadar;
console.log('EnhancedSkillsRadar component loaded');
