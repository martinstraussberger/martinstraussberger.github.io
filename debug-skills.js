// Simple test page to debug skills loading
console.log('=== Skills Debug Test ===');

// Test 1: Check if SkillsService is available
setTimeout(async () => {
    console.log('1. SkillsService available:', !!window.SkillsService);
    
    if (window.SkillsService) {
        try {
            console.log('2. Loading skills data...');
            const data = await window.SkillsService.loadSkillsData();
            console.log('3. Skills data loaded:', data);
            console.log('4. Categories count:', data.skillCategories?.length);
            console.log('5. Summary:', data.summary);
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }
    
    // Test 2: Check if SkillsVisualization is available
    console.log('6. SkillsVisualization available:', !!window.SkillsVisualization);
    
    // Test 3: Check container
    const container = document.getElementById('skills-viz-container');
    console.log('7. Container found:', !!container);
    console.log('8. Container element:', container);
    
}, 2000); // Wait 2 seconds for everything to load
