
function toggleTheme(){
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') || 'dark';
  root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}
