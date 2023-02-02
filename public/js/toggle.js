const Toggle = () => {
  const btn = document.querySelector('._themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme');
  const AddFifteenDaysOfDarkness = document.body.classList.add('dark-theme');
  const AddFifteenDaysOfLight = document.body.classList.add('light-theme');

  if (currentTheme === 'dark') {
    console.log('index if:', localStorage.getItem('theme'));
    document.body.classList.remove('light-theme');
    AddFifteenDaysOfDarkness;
  } else {
    console.log('index else if:', localStorage.getItem('theme'));
    document.body.classList.remove('dark-theme');
    AddFifteenDaysOfLight;
  }

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
