const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

window.addEventListener("scroll", () => {
  const heroImg = document.querySelector(".hero-visual img");
  if (!heroImg) return;
  const y = window.scrollY;
  heroImg.style.transform = `scale(1.03) translateY(${y * 0.035}px)`;
});
