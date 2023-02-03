const Profile = `<h1>Fullstack | Frontend Engineer</h1>
</div>
<div class="_content flex">
  <div class="avatar">
      <img
        class="_avatarImage"
        src="./public/images/profile/profile2.jpg"
        alt="profile"
      />
  </div>
  <div class="bio-intro">
    <p>
      B. Eng | B. Sc | Martin Straussberger
    </p>
  </div>
  <h5>Get in Touch</h5>
  <button class="qr-btn">
    <img
      class="icon _qr"
      src="/public/images/qr/profileQr.png"
      width="76px"
      alt="github"
    />
  </button>
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
  </div>`;

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('profile').innerHTML = Profile;
});
