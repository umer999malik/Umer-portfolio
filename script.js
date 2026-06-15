const glow = document.querySelector('.cursor-glow');

window.addEventListener('mousemove', (e) => {
  if (!glow) return;
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeLightbox');

document.querySelectorAll('.thumb img').forEach((img) => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('active');
  });
});

closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});

document.querySelectorAll(".thumb").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "rotateX(0deg) rotateY(0deg) scale(1)";
  });
});

function switchThumb(btn, imageSrc) {
  const card = btn.closest('.ab-thumb');
  const img = card.querySelector('img');
  img.src = imageSrc;
}
const filterBtns = document.querySelectorAll('.filter-btn');
const thumbs = document.querySelectorAll('.thumb');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    thumbs.forEach(thumb => {

      if(filter === 'all'){
        thumb.style.display = 'block';
      } else {
        thumb.style.display =
          thumb.dataset.category === filter
          ? 'block'
          : 'none';
      }

    });

  });
});
const viewMoreBtn = document.getElementById("viewMoreBtn");
const portfolioGallery = document.getElementById("portfolioGallery");
const galleryFade = document.getElementById("galleryFade");

if (viewMoreBtn && portfolioGallery && galleryFade) {
  viewMoreBtn.addEventListener("click", () => {
    portfolioGallery.classList.toggle("expanded");

    if (portfolioGallery.classList.contains("expanded")) {
      viewMoreBtn.textContent = "Show Less";
      galleryFade.style.display = "none";
    } else {
      viewMoreBtn.textContent = "View More";
      galleryFade.style.display = "block";
    }
  });
}
