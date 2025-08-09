![AI Architect](./public/images/blog/ai/gemini_art_ai_architect.png)

I'll explain each of the attached files and their role in your website architecture.

### 🎯 Core Like System

**`like-system.js` - Production Like System with Supabase**

* **Purpose:** Handles all like functionality for blog posts and projects.
* **Key Features:**
  * Supabase integration for persistent data storage.
  * User fingerprinting for anonymous like tracking.
  * `PATCH`-based updates to avoid conflicts.
  * Real-time UI updates with animations.
  * Caching system for performance.
* **Architecture:** Uses a `LikeSystem` class that auto-initializes on page load.
* **Database:** Connects to your Supabase instance with proper API keys.

---

### 🛣️ Navigation & Routing

**`url-router.js` - Clean URL Handler**

* **Purpose:** Enables clean URLs (e.g., `/blog`, `/projects`) on GitHub Pages.
* **How it works:**
  * Maps clean URLs to actual HTML files (e.g., `/blog` → `blog.html`).
  * Only activates on GitHub Pages domains.
  * Handles both direct navigation and click events.
* **GitHub Pages Compatible:** Works around GitHub Pages' static hosting limitations.

**`cache-config.js` - Cache Management**

* **Purpose:** Version control for CSS, JS, and image assets.
* **Features:**
  * Cache busting with version parameters.
  * Centralized version management.
  * Utility functions for adding versions to URLs.

---

### 🔧 Data Services

**`blog-service.js` - Blog Data Management**

* **Purpose:** Handles all blog-related data operations.
* **Key Functions:**
  * Loads blog posts from `blog-index.json`.
  * Calculates read times from markdown content.
  * Filters by categories (neuroscience, engineering, AI).
  * Formats dates and enhances posts.
* **Architecture:** Functional approach with module-level caching.

**`projects-service.js` - Project Data Management**

* **Purpose:** Manages project portfolio data.
* **Key Functions:**
  * Loads projects from `projects-index.json`.
  * Handles project categories (web, react, data-science, flutter).
  * Sorts by featured status and alphabetically.
* **Similar Pattern:** Mirrors blog service architecture for consistency.

---

### 🎨 UI Components & Rendering

**`card-renderer.js` - Universal Card System**

* **Purpose:** Creates consistent card components for both blogs and projects.
* **Architecture:**
  * Universal card template with data mapping.
  * Separate mappers for blog posts vs projects.
  * Consistent structure across all cards.
  * Built-in like button container integration.
* **Clean Design:** Follows clean architecture with clear separation of concerns.

---

## 🏗️ Overall Architecture Pattern

Your codebase follows a clean, modular architecture:

* **Service Layer:** `blog-service.js` and `projects-service.js` handle data.
* **Rendering Layer:** `card-renderer.js` handles UI presentation.
* **Utility Layer:** `ui-components.js` provides shared utilities.
* **Feature Layer:** `like-system.js` handles specific functionality.
* **Infrastructure:** `url-router.js` and `cache-config.js` handle technical concerns.

---

## 🔄 Data Flow

From:

```
JSON Data → Services → Card Renderer → UI Components → Like System
    ↓           ↓           ↓              ↓            ↓
blog-index  BlogService  CardRenderer  UIComponents  LikeSystem
projects-   ProjectsService    ↓              ↓            ↓
index.json      ↓         Universal     Shared      Supabase
                ↓         Card HTML    Utilities    Database
            Enhanced         ↓              ↓            ↓
            Post Data    Consistent    initializeLike  Persistent
                         UI/UX        waitForServices   Likes
```

to:
![data-flow](./public/images/blog/ai/ai-perception-of-architecture.png)

---

## ✨ Key Design Principles

* **DRY:** Shared utilities eliminate code duplication.
* **Separation of Concerns:** Each file has a single responsibility.
* **Consistency:** Similar patterns across blog and project systems.
* **Performance:** Caching, lazy loading, and optimized rendering.
* **User Experience:** Real-time updates, clean URLs, and persistent likes.
* **Maintainability:** Clear APIs and modular structure.

This architecture makes your website highly maintainable, performant, and feature-rich while keeping the vanilla JavaScript approach you wanted!
