async function loadSection(id, file) {
  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error("Failed to load " + file);
    }

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

    updateYear();

  } catch (error) {
    console.error(error);
  }
}

function loadAllSections() {
  loadSection("hero", "sections/hero.html");
  loadSection("research", "sections/research.html");
  loadSection("concepts", "sections/concepts.html");
  loadSection("manuscripts", "sections/manuscripts.html");
  loadSection("preprints", "sections/preprints.html");
  loadSection("cv", "sections/cv.html");
  loadSection("profiles", "sections/profiles.html");
  loadSection("footer", "sections/footer.html");
}

function toggleLang() {

  const html = document.documentElement;

  const current =
    html.getAttribute("data-lang") || "en";

  const next =
    current === "en" ? "tr" : "en";

  html.setAttribute("data-lang", next);
  html.setAttribute("lang", next);

  const button =
    document.getElementById("langToggle");

  if (button) {
    button.textContent =
      next === "en" ? "TR" : "EN";
  }
}

function toggleAbs(button) {

  const body =
    button.nextElementSibling;

  if (!body) return;

  button.classList.toggle("open");
  body.classList.toggle("open");
}

function updateYear() {

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadAllSections();

  }
);
