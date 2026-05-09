```js
let currentLang = document.documentElement.dataset.lang || "en";

function applyLanguage(lang) {
  currentLang = lang;

  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;

  const langToggle = document.getElementById("langToggle");

  if (langToggle) {
    langToggle.textContent =
      lang === "en" ? "TR" : "EN";
  }

  document.querySelectorAll("[lang]").forEach(el => {

    if (
      el.tagName.toLowerCase() === "html"
    ) return;

    if (el.getAttribute("lang") === lang) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }

  });
}

async function loadSection(id, file) {

  try {

    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Failed to load ${file}`);
    }

    const html = await response.text();

    const target =
      document.getElementById(id);

    if (target) {
      target.innerHTML = html;
    }

    applyLanguage(currentLang);

    setFooterYear();

  } catch (error) {

    console.error(error);

  }
}

function toggleAbs(button) {

  const body =
    button.nextElementSibling;

  if (!body) return;

  button.classList.toggle("open");
  body.classList.toggle("open");
}

function setFooterYear() {

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const langToggle =
      document.getElementById("langToggle");

    if (langToggle) {

      langToggle.addEventListener(
        "click",
        () => {

          const nextLang =
            currentLang === "en"
              ? "tr"
              : "en";

          applyLanguage(nextLang);

        }
      );
    }

    loadSection(
      "hero",
      "sections/hero.html"
    );

    loadSection(
      "research",
      "sections/research.html"
    );

    loadSection(
      "concepts",
      "sections/concepts.html"
    );

    loadSection(
      "manuscripts",
      "sections/manuscripts.html"
    );

    loadSection(
      "preprints",
      "sections/preprints.html"
    );

    loadSection(
      "cv",
      "sections/cv.html"
    );

    loadSection(
      "profiles",
      "sections/profiles.html"
    );

    loadSection(
      "footer",
      "sections/footer.html"
    );

    applyLanguage(currentLang);

  }
);
```
