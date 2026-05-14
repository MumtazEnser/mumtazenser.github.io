
async function loadSection(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

function loadAllSections() {
  loadSection("hero", "sections/hero.html");
  loadSection("research", "sections/research.html");
  loadSection("concepts", "sections/concepts.html");
  loadSection("under-review", "sections/under-review.html");
  loadSection("projects", "sections/projects.html");
  loadSection("preprints", "sections/preprints.html");
  loadSection("profiles", "sections/profiles.html");
  loadSection("footer", "sections/footer.html");
}

document.addEventListener("DOMContentLoaded", loadAllSections);
