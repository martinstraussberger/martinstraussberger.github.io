#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to update blog-index.json with Git creation dates
 * Run this script whenever you add new blog posts
 */

const blogIndexPath = './public/data/blog-index.json';

function getGitCreationDate(filePath) {
    try {
        // Get the first commit date for this file
        const gitCommand = `git log --follow --format=%aI --reverse -- "${filePath}" | head -1`;
        const result = execSync(gitCommand, { encoding: 'utf8' }).trim();
        
        if (result) {
            const date = new Date(result);
            return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
        }
        
        return null;
    } catch (error) {
        console.warn(`Could not get Git creation date for ${filePath}:`, error.message);
        return null;
    }
}

function updateBlogDates() {
    try {
        // Read the current blog index
        const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
        
        // Update each post with Git creation date
        const updatedPosts = blogIndex.posts.map(post => {
            const gitDate = getGitCreationDate(post.markdownPath);
            
            if (gitDate) {
                console.log(`Updated ${post.id}: ${gitDate}`);
                return {
                    ...post,
                    publishedAt: gitDate
                };
            } else {
                console.warn(`Could not get Git date for ${post.id}, keeping existing or using current date`);
                return {
                    ...post,
                    publishedAt: post.publishedAt || new Date().toISOString().split('T')[0]
                };
            }
        });
        
        // Update the blog index
        const updatedBlogIndex = {
            ...blogIndex,
            posts: updatedPosts
        };
        
        // Write back to file
        fs.writeFileSync(blogIndexPath, JSON.stringify(updatedBlogIndex, null, 2));
        console.log('✅ Blog dates updated successfully!');
        
    } catch (error) {
        console.error('❌ Error updating blog dates:', error);
        process.exit(1);
    }
}

// Run the update
updateBlogDates();
