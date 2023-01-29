const Profile = `<h1>Fullstack | Frontend Engineer</h1>
</div>
<div class="_content flex">
  <div class="avatar">
    <a target="_blank" href="https://linkedin.com/in/martinstraussberger">
      <img
        class="_avatarImage"
        src="./public/images/profile/profile2.jpg"
        alt="profile"
      />
    </a>
  </div>
  <div class="bio-intro">
    <p>
      Martin Straussberger | B. Eng
    </br>
      Web-Developer with deep focus on Frontend Engineering
    </p>
  </div>
  <p>Get in touch</p>
  <div class="flex">
    <a target="_blank" href="https://linkedin.com/in/martinstraussberger">
      <img
        class="icon _linkedIn"
        style="color: #fff"
        src="/public/images/icons/linkedin.png"
        width="43px"
        alt="github"
      />
    </a>
    <button class="qr-btn">
      <img
        class="icon _qr"
        src="/public/images/qr-codes/profile-qr.png"
        width="76px"
        alt="github"
      />
    </button>
  </div>`;

  window.addEventListener("DOMContentLoaded", function() {
    document.getElementById('profile').innerHTML = Profile;
  });