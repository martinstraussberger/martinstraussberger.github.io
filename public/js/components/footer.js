let Footer;

async function loadFooterContent() {
  try {
    const markdownContent = await SimpleMarkdownParser.loadAndParse('./public/markdown/footer.md');

    if (markdownContent) {
      Footer = markdownContent;
      console.log('Footer markdown loaded successfully');
    } else {
      console.log('Footer markdown returned null, using fallback');
      Footer = FooterFallback;
    }
  } catch (error) {
    console.error('Footer markdown loading failed, using fallback:', error);
    Footer = FooterFallback;
  }

  // Render the footer
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