const Profile = `
<div class="header">
    <div>Head of Web Engineering - Calimoto GmbH</div>
</div>
</div>
<div class="_content flex">
  <div class="avatar">
      <img
        class="_avatarImage"
        src="./public/images/profile/profile-img.jpg"
        width="242px" 
        height="242px
        alt="profile"
      />
  </div>
  <div class="bio-intro">
    <p>
      Driving Impact Through Neuroscience for Leadership & Teams 🚀 
    </p>
    <p>
      Vision-Driven Product Engineering
    </p>
  </div>
    <button class="linkedIn-btn">
    <a target="_blank" href="https://linkedin.com/in/martinstraussberger">
      <img
        class="icon _linkedIn"
        style="color: #fff"
        src="/public/images/icons/linkedin.png"
        width="43px"
        height=43px"
        alt="github"
      />
    </a>
    />
  </button>
  </div>`;

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('profile').innerHTML = Profile;
});
