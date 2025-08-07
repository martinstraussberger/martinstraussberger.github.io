const profileData = {
  name: "Martin Straußberger",
  title: "Head of Web Development",
  company: {
    name: "calimoto",
    url: "https://www.calimoto.com/de/karriere"
  },
  tagline: "Empowering Teams Through Collaborative Leadership",
  image: {
    src: "./public/images/profile/profile-img.jpg",
    alt: "Martin Straußberger profile photo",
    width: 242,
    height: 242
  },
  social: {
    linkedin: "https://linkedin.com/in/martinstraussberger"
  }
};

const Profile = `
<div class="header">
    <div>${profileData.name}</div>
</div>
<div class="_content flex">
  <div class="avatar">
      <img
        class="_avatarImage"
        src="${profileData.image.src}"
        width="${profileData.image.width}"
        height="${profileData.image.height}"
        alt="${profileData.image.alt}"
        loading="lazy"
      />
  </div>
  <div class="bio-intro">
    <div class="contrast-darkMode">
      ${profileData.title} at <a href="${profileData.company.url}" target="_blank" rel="noopener">${profileData.company.name}</a>
    </div>
    <p>
      ${profileData.tagline}
    </p>
  </div>
  <button class="linkedIn-btn" type="button" aria-label="Visit LinkedIn profile">
    <a target="_blank" href="${profileData.social.linkedin}" rel="noopener">
      <img
        class="icon _linkedIn"
        src="/public/images/icons/linkedin.png"
        width="43"
        height="43"
        alt="LinkedIn"
        loading="lazy"
      />
    </a>
  </button>
</div>`;

window.addEventListener('DOMContentLoaded', function () {
  const profileElement = document.getElementById('profile');
  if (profileElement) {
    profileElement.innerHTML = Profile;
  } else {
    console.warn('Profile container element not found');
  }
});
