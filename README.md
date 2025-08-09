# Martin Straussberger Portfolio

Personal portfolio website built with vanilla JavaScript, featuring a blog system, project showcase, and like functionality with persistent data storage.

## 🚀 Quick Start

```bash
# Start development server
npm run dev

# Open your browser to http://localhost:8000
```

## 📋 Project Overview

This is a static website built with:
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Static files with Supabase for like system
- **Deployment**: GitHub Pages compatible
- **Content**: Markdown-based blog posts and project data

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server (recommended)
npm run server       # Start development server (alias)
npm run pyserver     # Start Python development server
```

### Blog Management
```bash
npm run blog:add              # Interactive tool to add new blog posts
npm run blog:update           # Update blog dates from Git history
npm run blog:validate         # Validate blog structure and files
npm run lint:blog             # Format and sort blog index
```

### Image Optimization
```bash
npm run images:optimize       # Optimize all images for web
npm run optimize-images       # Optimize images (alias)
```

### Build & Deploy
```bash
npm run setup                 # Optimize images + update blog dates
npm run build:prepare         # Full prep: optimize + update + validate
```

## 📁 Project Structure

```
├── public/
│   ├── css/                  # Stylesheets
│   ├── js/
│   │   ├── components/       # Page components (blog.js, projects.js)
│   │   ├── config/           # Configuration files
│   │   ├── shared/           # Shared utilities (script-loader.js)
│   │   └── util/             # Utility functions
│   ├── data/                 # JSON data files
│   ├── images/               # Optimized images
│   └── markdown/             # Blog post content
├── scripts/                  # Build and maintenance scripts
├── *.html                    # Page templates
└── dev-server.py            # Development server
```

## 📝 Blog System

### Adding a New Blog Post

**Interactive Method (Recommended):**
```bash
npm run blog:add
```
Follow the prompts to create a new post with:
- Auto-generated ID from title
- Markdown file template
- Image directory creation
- Automatic blog index update

**Manual Method:**
1. Add entry to `public/data/blog-index.json`
2. Create markdown file in `public/markdown/blog/`
3. Add image to `public/images/blog/{category}/`
4. Run `npm run blog:validate` to check

### Blog Post Structure
```json
{
  "id": "unique-post-id",
  "title": "Post Title",
  "excerpt": "Short description",
  "category": "ai|neuroscience|engineering",
  "markdownPath": "./public/markdown/blog/post-name.md",
  "featured": true,
  "publishedAt": "2025-08-09",
  "image": "./public/images/blog/category/image.png"
}
```

### Categories
- `ai` - The Age of AI
- `neuroscience` - Neuroscience & Leadership  
- `engineering` - Software Engineering

## 🎨 Like System

The website features a persistent like system:
- **Anonymous tracking** via browser fingerprinting
- **Persistent storage** with Supabase
- **Real-time updates** with visual feedback
- **User-specific likes** (users can like/unlike)

### Configuration
Supabase credentials are in `public/js/config/supabase-config.js`

## 🖼️ Image Optimization

Images are automatically optimized for web performance:
```bash
npm run images:optimize
```

**Features:**
- Resizes to optimal dimensions
- Compresses file size (~67% reduction)
- Maintains quality
- Creates optimized versions

## 🧪 Validation & Quality

### Blog Validation
```bash
npm run blog:validate
```
**Checks:**
- Required fields present
- Markdown files exist
- Image files exist  
- Valid date formats
- No duplicate IDs
- Valid categories

### Blog Formatting
```bash
npm run lint:blog
```
**Actions:**
- Sorts posts by date (newest first)
- Consistent JSON formatting
- Shows recent posts summary

## 🌐 Development Server

The Python development server provides:
- **Clean URLs**: `/blog` instead of `/blog.html`
- **Static file serving**
- **CORS headers** for local development
- **Auto-restart** on file changes

```bash
# Start server
npm run dev

# Available at:
http://localhost:8000          # Home page
http://localhost:8000/blog     # Blog listing
http://localhost:8000/projects # Project showcase
http://localhost:8000/about    # About page
```

## 🚀 Deployment

### GitHub Pages
1. Push to `main` branch
2. GitHub Pages automatically deploys
3. Clean URLs handled by `url-router.js`

### Pre-deployment Checklist
```bash
npm run build:prepare    # Runs all optimizations and validations
```

## 🔧 Architecture

### Script Loading
Uses a centralized script loader (`public/js/shared/script-loader.js`) to:
- Eliminate code duplication
- Load dependencies in correct order
- Handle different page requirements
- Provide error handling

### Service Pattern
- **BlogService**: Manages blog data and operations
- **ProjectsService**: Handles project portfolio data  
- **CardRenderer**: Creates consistent UI components
- **LikeSystem**: Manages persistent like functionality
- **UIComponents**: Shared utilities and components

### Clean Architecture
- **Separation of concerns**: Each file has single responsibility
- **DRY principle**: Shared utilities eliminate duplication
- **Vanilla JavaScript**: No frameworks, fast loading
- **Modular design**: Easy to maintain and extend

## 🛠️ Troubleshooting

### Common Issues

**Blog posts not showing:**
```bash
npm run blog:validate    # Check for errors
npm run blog:update      # Update dates from Git
```

**Images not loading:**
```bash
npm run images:optimize  # Re-optimize images
```

**Like system not working:**
- Check browser console for errors
- Verify Supabase configuration
- Check network connectivity

**Scripts not working:**
- Ensure you're in project root directory
- Check if Node.js is installed: `node --version`
- Verify file permissions on scripts

### Performance Tips
- Run `npm run images:optimize` after adding new images
- Use `npm run lint:blog` to keep blog data organized
- Validate with `npm run blog:validate` before deployment

## 📊 Performance Features

- **Image optimization**: 67% file size reduction
- **Lazy loading**: Images load as needed
- **Caching**: Browser caching for static assets
- **Clean URLs**: SEO-friendly routing
- **Minimal dependencies**: Fast page loads

## 🤝 Contributing

1. Add new blog posts via `npm run blog:add`
2. Optimize images with `npm run images:optimize`
3. Validate changes with `npm run blog:validate`
4. Test locally with `npm run dev`
5. Deploy via Git push to main branch

---

Built with ❤️ using vanilla JavaScript and modern web standards.
