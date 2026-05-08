const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {

    const html = document.documentElement;

    if (html.dataset.theme === "dark") {
      html.dataset.theme = "light";
      themeToggle.textContent = "Dark";
    }
    else {
      html.dataset.theme = "dark";
      themeToggle.textContent = "Light";
    }

  });
}
