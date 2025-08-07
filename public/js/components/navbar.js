import { Toggle as ThemeMode } from '../toggle.js';

const RefGithub = `
  <a
      target="_blank"
      href="https://github.com/martinstraussberger?tab=repositories"
    >
      <img
        class="icon _github"
        style="color: #fff"
        src="/public/images/icons/github-logo.png"
        width="43px"
        alt="github"
      />
    </a>
`;

const Navbar = `
  <nav>
  <div class="navbar">
    ${RefGithub}
    <div>
      <i class="icon fa-solid fa-moon _themeToggle"></i>
    </div>
    <ul class="nav">
      <li style="padding: 0 0 0 0">
        <a class="nav-links upperCase" href="./about.html">About</a>
      </li>
      <li style="padding: 0 0 0 0">
        <a class="nav-links upperCase" href="./projects.html">Projects</a>
      </li>
      <li style="padding: 0 0 0 0">
        <a class="nav-links upperCase" href="./blog.html">Blog</a>
      </li>
    </ul>
  </div>
  </nav>
  `;

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('navbar').innerHTML = Navbar;
  ThemeMode();
});
