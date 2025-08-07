// Footer data structure
const footerData = {
  markdown: {
    path: './public/markdown/footer.md'
  }
};

let Footer;

async function loadFooterContent() {
  // Check if SimpleMarkdownParser is available
  if (typeof SimpleMarkdownParser === 'undefined') {
    console.warn('SimpleMarkdownParser is not defined.');
  }

  try {
    const markdownContent = await SimpleMarkdownParser.loadAndParse(footerData.markdown.path);

    if (markdownContent && markdownContent.trim()) {
      Footer = markdownContent;
      console.log('Footer markdown loaded successfully');
    } else {
      console.log('Footer markdown returned null or empty.');
      Footer = FooterFallback;
    }
  } catch (error) {
    console.warn('Footer markdown loading failed:', error);
    Footer = FooterFallback;
  }

  renderFooter();
}

function renderFooter() {
  const footerElement = document.getElementById('footer');
  if (footerElement) {
    // Store existing classes before setting innerHTML
    const existingClasses = footerElement.className;
    footerElement.innerHTML = Footer;

    // Restore the original classes to ensure grid-item2 footer flex are maintained
    footerElement.className = existingClasses;
  } else {
    console.error('Footer element not found');
  }
}

window.addEventListener("DOMContentLoaded", loadFooterContent);