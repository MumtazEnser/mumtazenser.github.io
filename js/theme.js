function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const button = document.getElementById("themeToggle");

  if (button) {
    button.textContent = theme === "dark" ? "Light" : "Dark";
  }
}

function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === "dark" ? "light" : "dark";

  setTheme(next);
}

document.addEventListener("DOMContentLoaded", function () {
  setTheme(getCurrentTheme());
});
