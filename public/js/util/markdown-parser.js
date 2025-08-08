/**
 * Simple markdown parser without external dependencies
 */
class SimpleMarkdownParser {
  static parse(markdown) {
    let html = markdown
      // Headers (process first to avoid line break issues)
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      
      // Images - ![alt text](image path) - process before links
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-image" />')
      
      // Links - [text](url) - process after images
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Lists (unordered) - handle both - and * bullets
      .replace(/^[\s]*[-\*]\s+(.*)$/gm, '<li>$1</li>')
      
      // Convert paragraph breaks - but preserve header spacing
      .replace(/(<\/h[1-6]>)\s*<br>\s*/g, '$1 ')  // Remove breaks after headers
      .replace(/\s*(<h[1-6]>)/g, ' $1')           // Clean spacing before headers
      .replace(/\n\n+/g, '<br>')                  // Multiple newlines become single break
      .replace(/\n/g, ' ');                       // Single newlines become spaces

    // Wrap consecutive <li> elements in <ul> tags
    html = html.replace(/(<li>.*?<\/li>)(\s*<br>\s*<li>.*?<\/li>)*/g, function(match) {
      return '<ul>' + match.replace(/<br>\s*/g, '') + '</ul>';
    });
    
    // Wrap everything in a single paragraph tag
    html = `<p class="p-biography">${html}</p>`;
    
    return html;
  }

  static async loadAndParse(filePath) {
    try {
      console.log(`Attempting to load: ${filePath}`);
      const response = await fetch(filePath);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
      }
      
      const markdown = await response.text();
      console.log(`Loaded markdown content length: ${markdown.length}`);
      
      const parsed = this.parse(markdown);
      console.log(`Parsed HTML length: ${parsed.length}`);
      
      return parsed;
    } catch (error) {
      console.error('Error loading markdown:', error);
      return null;
    }
  }
}

// Make available globally
window.SimpleMarkdownParser = SimpleMarkdownParser;
console.log('SimpleMarkdownParser loaded and available globally');