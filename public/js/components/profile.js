const Profile = `<h1>Fullstack | Frontend Engineer</h1>
</div>
<div class="_content flex">
  <div class="avatar">
    <a target="_blank" href="https://linkedin.com/in/martinstraussberger">
      <img
        class="_avatarImage"
        src="./public/images/profile/profile.jpg"
        alt="profile"
      />
    </a>
  </div>
  <h4>Martin Straussberger</h4>
  <p>Get in touch</p>
  <div>
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

  window.addEventListener("DOMContentLoaded", function() {
    document.getElementById('profile').innerHTML = Profile;
  });