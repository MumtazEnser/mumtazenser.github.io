
async function loadSection(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

loadSection("hero", "sections/hero.html");
loadSection("research", "sections/research.html");
loadSection("concepts", "sections/concepts.html");
loadSection("manuscripts", "sections/manuscripts.html");
loadSection("preprints", "sections/preprints.html");
loadSection("cv", "sections/cv.html");
loadSection("profiles", "sections/profiles.html");
loadSection("footer", "sections/footer.html");
