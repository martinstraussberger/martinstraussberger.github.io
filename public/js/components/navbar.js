import { Toggle as ThemeMode } from '../toggle.js';

const dropdownItems = {
  react: 'React',
  typescript: 'TypeScript & Co',
  dataScience: 'R&D - Data Science',
  flutter: 'Flutter',
};

const HomeBtn = `
<a href="./index.html">
<i class="homeBtn icon fa-solid fa-arrow-left"></i>
</a>
`;

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

const Dropdown = `
<li class="dropdown">
  <button class="nav-links _dropdownButton upperCase">Projects</button>
  <div class="dropdown-content">
    <span>
      <h4 class="_dropdownTitle">Without Frameworks</h4>
      <a
        target="_blank"
        href="https://martinstraussberger.dev/nereus-diving-2018"
        >Nereus Diving</a
      >
    </span>
    <span>
      <h4 class="_dropdownTitle">${dropdownItems.react}</h4>
      <h4 class="_dropdownTitle">${dropdownItems.typescript}</h4>
      <a href="#">Dashboard</a>
    </span>
    <span>
      <h4 class="_dropdownTitle">${dropdownItems.dataScience}</h4>
      <a
        target="_blank"
        href="https://martinstraussberger.dev/eegbrainwavebook"
        >Analyzing Brain Waves</a
      >
    </span>
    <span>
      <h4 class="_dropdownTitle">${dropdownItems.flutter}</h4>
      <a
        target="_blank"
        href="https://martinstraussberger.dev/health-calculator-app/"
        >Health Calculation App</a
      >
      <a target="_blank" href="https://martinstraussberger.dev/expansewallet"
        >Expanse Wallet</a
      >
    </span>
  </div>
</li>
`;

const Navbar = `
  <nav>
  <div class="navbar">
    ${RefGithub}
    <div>
    ${HomeBtn}
    </div>
    <div>
      <i class="icon fa-solid fa-moon _themeToggle"></i>
    </div>
    <ul class="nav">
      <li style="padding: 0 0 0 0">
        <a class="nav-links upperCase" href="../about.html">About</a>
      </li>
        ${Dropdown}
    </ul>
  </div>
  </nav>
  `;

window.addEventListener('DOMContentLoaded', async function () {
  document.getElementById('navbar').innerHTML = Navbar;
  ThemeMode();
    console.log(document.location === 'index.html')
  if(document.location == './index.html') {
    await document.querySelectorAll('#homeBtn').setAttribute('display', 'none')
  }
});

