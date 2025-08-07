// About page data structure
const aboutData = {
  profile: {
    name: "Martin Straussberger",
    location: "born in Nuremberg, Germany"
  },
  navigation: {
    homeUrl: "./index.html",
    homeLabel: "Home"
  },
  timeboxing: {
    imageUrl: "../public/images/PreviewTimeBoxing.jpg",
    pdfUrl: "./public/pdf/timeBoxingTemplate.pdf",
    imageAlt: "Timeboxing Template Preview",
    width: "290",
    height: "490"
  },
  markdown: {
    personalDevPath: './public/markdown/personal-development.md',
    biographyPath: './public/markdown/biography.md'
  }
};


const HomeBtn = `
<a href="${aboutData.navigation.homeUrl}" aria-label="Go back to homepage">
<i class="homeBtn icon fa-solid fa-arrow-left"> ${aboutData.navigation.homeLabel}</i>
</a>
`;

const PreviewTimeBoxing = `
<div class="flex">
<h4>Preview</h4>
  <a class="timeboxing-preview" aria-label="View timeboxing template preview">
    <img src="${aboutData.timeboxing.imageUrl}" 
         width="${aboutData.timeboxing.width}" 
         height="${aboutData.timeboxing.height}" 
         alt="${aboutData.timeboxing.imageAlt}"
         loading="lazy">
  </a>  
  <a target="_blank" href="${aboutData.timeboxing.pdfUrl}" rel="noopener" aria-label="Download timeboxing template PDF">
    <strong>PDF</strong>
  </a>
</div>
`;

let PersonalDevelopment;
let BiographyContent;

async function loadMarkdownContent() {
  // Check if SimpleMarkdownParser is available
  if (typeof SimpleMarkdownParser === 'undefined') {
    console.warn('SimpleMarkdownParser is not defined.');
    return;
  }

  try {
    // Load Personal Development content
    const personalDevMarkdown = await SimpleMarkdownParser.loadAndParse(aboutData.markdown.personalDevPath);
    if (personalDevMarkdown && personalDevMarkdown.trim()) {
      PersonalDevelopment = personalDevMarkdown;
      console.log('Personal Development content loaded from markdown');
    } else {
      console.log('Personal Development markdown failed or empty.');
    }

    // Load Biography content
    const biographyMarkdown = await SimpleMarkdownParser.loadAndParse(aboutData.markdown.biographyPath);
    if (biographyMarkdown && biographyMarkdown.trim()) {
      BiographyContent = biographyMarkdown;
      console.log('Biography content loaded from markdown');
    } else {
      console.log('Biography markdown failed or empty.');
    }
  } catch (error) {
    console.warn('Markdown loading failed:', error);
  }
}

function renderAboutPage() {
  const About = ` 
  <div class="_content flex biography">
      <h2>Bio</h2>
      <h4 class="contrast-darkMode">${aboutData.profile.name} ${aboutData.profile.location}</h4>
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
  } else {
    console.error('About container element not found');
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  // Check if we're on the about page to avoid running on wrong pages
  if (!document.getElementById('about')) {
    return;
  }
  
  // Add a small delay to ensure all scripts are loaded
  setTimeout(async () => {
    await loadMarkdownContent();
    renderAboutPage();
  }, 50);
});