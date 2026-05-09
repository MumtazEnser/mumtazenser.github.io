```js id="g2rm4o"
async function loadSection(id, file) {
  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Failed to load ${file}`);
    }

    const html = await response.text();

    document.getElementById(id).innerHTML = html;

  } catch (error) {

    console.error(error);

  }
}

loadSection("hero", "sections/hero.html");
loadSection("research", "sections/research.html");
loadSection("concepts", "sections/concepts.html");
loadSection("manuscripts", "sections/manuscripts.html");
loadSection("preprints", "sections/preprints.html");
loadSection("cv", "sections/cv.html");
loadSection("profiles", "sections/profiles.html");
loadSection("footer", "sections/footer.html");
```
