#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to validate blog-index.json structure and markdown files
 * Ensures all blog posts have required fields and valid markdown files
 */

const blogIndexPath = './public/data/blog-index.json';

function validateBlogPost(post, index) {
    const errors = [];
    const warnings = [];
    
    // Required fields
    const requiredFields = ['id', 'title', 'excerpt', 'category', 'markdownPath', 'publishedAt'];
    
    requiredFields.forEach(field => {
        if (!post[field]) {
            errors.push(`Post ${index + 1}: Missing required field '${field}'`);
        }
    });
    
    // Validate markdown file exists
    if (post.markdownPath) {
        if (!fs.existsSync(post.markdownPath)) {
            errors.push(`Post ${post.id}: Markdown file not found: ${post.markdownPath}`);
        }
    }
    
    // Validate image exists (if specified)
    if (post.image) {
        if (!fs.existsSync(post.image)) {
            warnings.push(`Post ${post.id}: Image file not found: ${post.image}`);
        }
    }
    
    // Validate date format
    if (post.publishedAt) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(post.publishedAt)) {
            errors.push(`Post ${post.id}: Invalid date format '${post.publishedAt}'. Use YYYY-MM-DD`);
        }
    }
    
    // Validate category
    const validCategories = ['neuroscience', 'engineering', 'ai'];
    if (post.category && !validCategories.includes(post.category)) {
        warnings.push(`Post ${post.id}: Unknown category '${post.category}'. Valid: ${validCategories.join(', ')}`);
    }
    
    return { errors, warnings };
}

function validateBlogIndex() {
    console.log('🔍 Validating blog index...\n');
    
    try {
        // Check if blog index exists
        if (!fs.existsSync(blogIndexPath)) {
            console.error('❌ Blog index file not found:', blogIndexPath);
            process.exit(1);
        }
        
        // Parse blog index
        const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
        
        if (!blogIndex.posts || !Array.isArray(blogIndex.posts)) {
            console.error('❌ Blog index must have a "posts" array');
            process.exit(1);
        }
        
        const allErrors = [];
        const allWarnings = [];
        
        // Validate each post
        blogIndex.posts.forEach((post, index) => {
            const { errors, warnings } = validateBlogPost(post, index);
            allErrors.push(...errors);
            allWarnings.push(...warnings);
        });
        
        // Check for duplicate IDs
        const ids = blogIndex.posts.map(post => post.id).filter(Boolean);
        const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
        if (duplicateIds.length > 0) {
            allErrors.push(`Duplicate post IDs found: ${duplicateIds.join(', ')}`);
        }
        
        // Report results
        if (allErrors.length > 0) {
            console.log('❌ ERRORS:');
            allErrors.forEach(error => console.log(`  • ${error}`));
            console.log('');
        }
        
        if (allWarnings.length > 0) {
            console.log('⚠️  WARNINGS:');
            allWarnings.forEach(warning => console.log(`  • ${warning}`));
            console.log('');
        }
        
        if (allErrors.length === 0 && allWarnings.length === 0) {
            console.log('✅ All blog posts are valid!');
        } else if (allErrors.length === 0) {
            console.log('✅ Blog validation passed with warnings');
        } else {
            console.log('❌ Blog validation failed');
            process.exit(1);
        }
        
        console.log(`📊 Summary: ${blogIndex.posts.length} posts, ${allErrors.length} errors, ${allWarnings.length} warnings`);
        
    } catch (error) {
        console.error('❌ Error validating blog index:', error.message);
        process.exit(1);
    }
}

// Run validation
validateBlogIndex();
