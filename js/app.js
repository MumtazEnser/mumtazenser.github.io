```js
let currentLang = "en";

function applyLanguage(lang) {

  currentLang = lang;

  document.querySelectorAll("[lang]").forEach(el => {

    if (el.getAttribute("lang") === lang) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }

  });
}

async function loadSection(id, file) {

  const response = await fetch(file);
  const html = await response.text();

  document.getElementById(id).innerHTML = html;

  applyLanguage(currentLang);
}

const langToggle = document.getElementById("langToggle");

if (langToggle) {

  langToggle.addEventListener("click", () => {

    const newLang =
      currentLang === "en" ? "tr" : "en";

    applyLanguage(newLang);

    langToggle.textContent =
      newLang === "en" ? "TR" : "EN";

  });
}

loadSection("hero", "sections/hero.html");
loadSection("research", "sections/research.html");
loadSection("concepts", "sections/concepts.html");
loadSection("manuscripts", "sections/manuscripts.html");
loadSection("preprints", "sections/preprints.html");
loadSection("cv", "sections/cv.html");
loadSection("profiles", "sections/profiles.html");
loadSection("footer", "sections/footer.html");

applyLanguage("en");
```


