const Toggle = () => {
  const btn = document.querySelector('._themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const FifteenDaysOfDark = document.body.classList.toggle('dark-theme');
  const FifteenDaysOfLight = document.body.classList.toggle('light-theme');

  const currentTheme = localStorage.getItem('theme');
  currentTheme ? 'dark' : FifteenDaysOfDark;
  currentTheme ? 'light' : FifteenDaysOfLight;

  btn.addEventListener('click', function () {
    let theme;
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle('dark-theme');
      theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    } else {
      document.body.classList.toggle('light-theme');
      theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    }
    localStorage.setItem('theme', theme);
  });
};

export { Toggle };