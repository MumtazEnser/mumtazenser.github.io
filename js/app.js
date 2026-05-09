async function loadSection(id, file) {
  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error("Failed to load " + file);
    }

    const html = await response.text();
    const target = document.getElementById(id);

    if (target) {
      target.innerHTML = html;
    }

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

function getCurrentLang() {
  return document.documentElement.getAttribute("data-lang") || "en";
}

function setLang(lang) {
  document.documentElement.setAttribute("data-lang", lang);
  document.documentElement.setAttribute("lang", lang);

  const button = document.getElementById("langToggle");

  if (button) {
    button.textContent = lang === "en" ? "TR" : "EN";
  }
}

function toggleLang() {
  const current = getCurrentLang();
  const next = current === "en" ? "tr" : "en";

  setLang(next);
}

function toggleAbs(button) {
  const body = button.nextElementSibling;

  if (!body) return;

  button.classList.toggle("open");
  body.classList.toggle("open");
}

function updateYear() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setLang(getCurrentLang());
  loadAllSections();
});
