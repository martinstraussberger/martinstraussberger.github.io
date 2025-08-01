/**
 * Simple markdown parser without external dependencies
 */
class SimpleMarkdownParser {
  static parse(markdown) {
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Convert paragraph breaks to <br><br> instead of separate <p> tags
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    
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