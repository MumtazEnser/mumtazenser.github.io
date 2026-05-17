const glow=document.querySelector('.cursor-glow');
window.addEventListener('mousemove',e=>{ if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';}});
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const sections=[...document.querySelectorAll('#foundations,#authority,#ethics,#ontology,#synthesis')];
const rails=[...document.querySelectorAll('.rail-item')];
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.documentElement.style.setProperty('--scroll',y);
  const heroImg=document.querySelector('.hero-image img');
  if(heroImg) heroImg.style.transform=`translateY(${Math.min(y*.06,38)}px) scale(${1+Math.min(y*.00005,.035)})`;
  let idx=0;
  sections.forEach((s,i)=>{if(s.getBoundingClientRect().top < innerHeight*.55) idx=i});
  rails.forEach((r,i)=>r.classList.toggle('active',i===idx));
},{passive:true});
