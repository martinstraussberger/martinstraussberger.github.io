const HomeBtn = `
<a href="./index.html">
<i class="homeBtn icon fa-solid fa-arrow-left"> Home</i>
</a>
`;

const PreviewTimeBoxing = `
<div class="flex">
<h4>Preview</h4>
  <a class="timeboxing-preview">
    <img src="../public/images/PreviewTimeBoxing.jpg" width="290px" height="490px" alt="Timeboxing Preview">
  </a>  
  <a target="_blank" href="./public/pdf/timeBoxingTemplate.pdf"><b>PDF</b></a>
</div>
`;

// Variables to store loaded content
let PersonalDevelopment;
let BiographyContent;

async function loadMarkdownContent() {
  // Check if SimpleMarkdownParser is available
  if (typeof SimpleMarkdownParser === 'undefined') {
    console.error('SimpleMarkdownParser is not defined. Using fallback content.');
    return;
  }

  try {
    // Load Personal Development content
    const personalDevMarkdown = await SimpleMarkdownParser.loadAndParse('./public/markdown/personal-development.md');
    if (personalDevMarkdown) {
      PersonalDevelopment = personalDevMarkdown;
      console.log('Personal Development content loaded from markdown');
    } else {
      console.log('Personal Development markdown failed, using fallback');
    }

    // Load Biography content
    const biographyMarkdown = await SimpleMarkdownParser.loadAndParse('./public/markdown/biography.md');
    if (biographyMarkdown) {
      BiographyContent = biographyMarkdown;
      console.log('Biography content loaded from markdown');
    } else {
      console.log('Biography markdown failed, using fallback');
    }
  } catch (error) {
    console.error('Markdown loading failed, using fallbacks:', error);
  }
}

function renderAboutPage() {
  const About = ` 
  <div class="_content flex biography">
      <h2>Bio</h2>
      <h4 class="contrast-darkMode">Martin Straussberger born in Nuremberg, Germany</h4>
      <div>
        ${BiographyContent}
      </div>
      ${PersonalDevelopment}
      ${PreviewTimeBoxing}
      <br>
      ${HomeBtn}
  </div>
  `;

  const aboutElement = document.getElementById('about');
  if (aboutElement) {
    aboutElement.innerHTML = About;
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  // Add a small delay to ensure all scripts are loaded
  setTimeout(async () => {
    await loadMarkdownContent();
    renderAboutPage();
  }, 100);
});