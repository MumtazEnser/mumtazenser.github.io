function toggleTheme() {

  const html =
    document.documentElement;

  const current =
    html.getAttribute("data-theme") || "dark";

  const next =
    current === "dark"
      ? "light"
      : "dark";

  html.setAttribute("data-theme", next);

  const button =
    document.getElementById("themeToggle");

  if (button) {
    button.textContent =
      next === "dark"
        ? "Light"
        : "Dark";
  }
}
