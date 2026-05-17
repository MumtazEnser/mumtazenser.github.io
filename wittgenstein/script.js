const toast = document.getElementById("toast");
let timer;

document.querySelectorAll(".layer").forEach(layer => {
  layer.addEventListener("click", () => {
    const name = layer.dataset.title || "Section";
    toast.textContent = `${name} — Coming Soon`;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 1800);
  });
});
