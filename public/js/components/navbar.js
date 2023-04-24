import { Toggle as ThemeMode } from '../toggle.js';

const dropdownItems = {
  react: 'React, TypeScript & Co.',
  dataScience: 'R&D - Data Science',
  flutter: 'Flutter',
};

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
<li class='dropdown'>
  <button class='nav-links _dropdownButton upperCase'>Projects</button>
  <ul class='dropdown-content'>
    <li>
      <h4 class='_dropdownTitle'>Without Frameworks</h4>
      <a target='_blank' href='https://martinstraussberger.dev/nereus-diving-2018'>
        Nereus Diving
      </a>
    </li>
    <li>
      <h4 class='_dropdownTitle'>${dropdownItems.react}</h4>
      <a target='_blank' href='https://martinstraussberger.dev/diary-app/'>
        Diary App
      </a>
      <a target='_blank' href='https://ms-mern.herokuapp.com'>
        MERN - Fullstack App
      </a>
      <a target='_blank' href='https://martinstraussberger.dev/reduxdashboard'>
        Redux - Dashboard
      </a>
      <a
        target='_blank'
        href='https://martinstraussberger.dev/prototype-react-d3js-chart'
      >
        React & D3.js - Chart
      </a>
    </li>
    <li>
      <h4 class='_dropdownTitle'>${dropdownItems.dataScience}</h4>
      <a target='_blank' href='https://martinstraussberger.dev/eegbrainwavebook'>
        Analyzing Brain Waves
      </a>
    </li>
    <li>
      <h4 class='_dropdownTitle'>${dropdownItems.flutter}</h4>
      <a target='_blank' href='https://martinstraussberger.dev/health-calculator-app/'>
        Health Calculation App
      </a>
      <a target='_blank' href='https://martinstraussberger.dev/expansewallet'>
        Expanse Wallet
      </a>
    </li>
  </ul>
</li>
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
        <a class="nav-links upperCase" href="../about.html">About</a>
      </li>
        ${Dropdown}
    </ul>
  </div>
  </nav>
  `;

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('navbar').innerHTML = Navbar;
  ThemeMode();
});
