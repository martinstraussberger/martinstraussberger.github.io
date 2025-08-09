#!/usr/bin/env node

const fs = require('fs');

/**
 * Script to lint and format blog-index.json
 * Sorts posts by date, formats consistently, and validates structure
 */

const blogIndexPath = './public/data/blog-index.json';

function sortPostsByDate(posts) {
    return posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function formatBlogIndex() {
    console.log('🧹 Linting and formatting blog index...\n');
    
    try {
        // Read current blog index
        const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
        
        if (!blogIndex.posts || !Array.isArray(blogIndex.posts)) {
            console.error('❌ Invalid blog index structure');
            process.exit(1);
        }
        
        // Sort posts by date (newest first)
        const sortedPosts = sortPostsByDate(blogIndex.posts);
        
        // Create formatted blog index
        const formattedBlogIndex = {
            posts: sortedPosts,
            categories: blogIndex.categories || {
                neuroscience: 'Neuroscience & Leadership',
                engineering: 'Software Engineering',
                ai: 'The Age of AI'
            }
        };
        
        // Write back to file with consistent formatting
        fs.writeFileSync(blogIndexPath, JSON.stringify(formattedBlogIndex, null, 2));
        
        console.log('✅ Blog index formatted successfully!');
        console.log(`📊 ${sortedPosts.length} posts sorted by date (newest first)`);
        
        // Show recent posts
        if (sortedPosts.length > 0) {
            console.log('\n📰 Recent posts:');
            sortedPosts.slice(0, 3).forEach(post => {
                console.log(`  • ${post.publishedAt} - ${post.title} (${post.category})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error formatting blog index:', error.message);
        process.exit(1);
    }
}

// Run formatting
formatBlogIndex();
