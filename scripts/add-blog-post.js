#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Interactive script to add a new blog post to blog-index.json
 * Run with: npm run blog:add
 */

const blogIndexPath = './public/data/blog-index.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, resolve);
    });
}

function generateId(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

async function addBlogPost() {
    console.log('📝 Adding a new blog post...\n');
    
    try {
        // Get blog post details
        const title = await askQuestion('📰 Blog post title: ');
        const id = generateId(title);
        console.log(`🆔 Generated ID: ${id}`);
        
        const excerpt = await askQuestion('📄 Short excerpt/description: ');
        
        console.log('\n📁 Available categories:');
        console.log('  • neuroscience (Neuroscience & Leadership)');
        console.log('  • engineering (Software Engineering)');
        console.log('  • ai (The Age of AI)');
        const category = await askQuestion('🏷️  Category: ');
        
        const featured = await askQuestion('⭐ Featured post? (y/N): ');
        const isFeatured = featured.toLowerCase() === 'y' || featured.toLowerCase() === 'yes';
        
        // Generate paths
        const markdownPath = `./public/markdown/blog/${id}.md`;
        const imagePath = `./public/images/blog/${category}/${id}.png`;
        
        console.log(`\n📁 Markdown file will be: ${markdownPath}`);
        console.log(`🖼️  Image file will be: ${imagePath}`);
        
        const useImage = await askQuestion('🖼️  Include image? (Y/n): ');
        const includeImage = useImage.toLowerCase() !== 'n' && useImage.toLowerCase() !== 'no';
        
        // Create blog post object
        const newPost = {
            id,
            title,
            excerpt,
            category,
            markdownPath,
            featured: isFeatured,
            publishedAt: getCurrentDate(),
            ...(includeImage && { image: imagePath })
        };
        
        // Read current blog index
        const blogIndex = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
        
        // Check for duplicate ID
        if (blogIndex.posts.some(post => post.id === id)) {
            console.log(`❌ Blog post with ID '${id}' already exists!`);
            process.exit(1);
        }
        
        // Add new post
        blogIndex.posts.push(newPost);
        
        // Write back to file
        fs.writeFileSync(blogIndexPath, JSON.stringify(blogIndex, null, 2));
        
        // Create markdown file template
        const markdownDir = path.dirname(markdownPath);
        if (!fs.existsSync(markdownDir)) {
            fs.mkdirSync(markdownDir, { recursive: true });
        }
        
        const markdownTemplate = `# ${title}

## Introduction

Write your blog post content here...

## Conclusion

Conclude your thoughts...

---

*Published on ${getCurrentDate()}*
`;
        
        fs.writeFileSync(markdownPath, markdownTemplate);
        
        // Create image directory if needed
        if (includeImage) {
            const imageDir = path.dirname(imagePath);
            if (!fs.existsSync(imageDir)) {
                fs.mkdirSync(imageDir, { recursive: true });
                console.log(`📁 Created image directory: ${imageDir}`);
            }
        }
        
        console.log('\n✅ Blog post added successfully!');
        console.log('\n📋 Summary:');
        console.log(`  • ID: ${id}`);
        console.log(`  • Title: ${title}`);
        console.log(`  • Category: ${category}`);
        console.log(`  • Featured: ${isFeatured}`);
        console.log(`  • Markdown: ${markdownPath}`);
        if (includeImage) {
            console.log(`  • Image: ${imagePath}`);
        }
        
        console.log('\n📝 Next steps:');
        console.log(`  1. Edit ${markdownPath} with your content`);
        if (includeImage) {
            console.log(`  2. Add your image to ${imagePath}`);
        }
        console.log(`  3. Run 'npm run blog:validate' to check everything is correct`);
        
    } catch (error) {
        console.error('❌ Error adding blog post:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Run the script
addBlogPost();
