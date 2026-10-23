// Keep the project images in this repository's root folder.
const projects = [
  {image:'thumb1-a.jpg',alternate:'thumb1-b.jpg',category:'challenge'},
  {image:'thumb2.jpg',category:'challenge'},
  {image:'thumb3-a.jpg',alternate:'thumb3-b.jpg',category:'challenge'},
  {image:'thumb4.jpg',category:'finance'},
  {image:'thumb5.png',category:'education'},
  {image:'thumb7.jpg',category:'finance'},
  {image:'thumb9.png',category:'finance'},
  {image:'thumb10.png',category:'challenge'},
  {image:'thumb11.png',category:'education'},
  {image:'thumb12.jpg',category:'challenge'},
  {image:'thumb13.png',category:'finance'},
  {image:'thumb14.jpg',category:'challenge'},
  {image:'thumb15.jpg',category:'education'},
  {image:'thumb16.jpg',category:'challenge'},
  {image:'thumb17.jpg',category:'education'},
  {image:'thumb18.jpg',category:'challenge'},
  {image:'thumb19-a.jpg',alternate:'thumb19-b.jpg',category:'challenge'},
  {image:'thumb20.jpg',category:'challenge'}
];

// The image path prefix is empty when the site lives inside the GitHub repo.
// The standalone preview sets it to the existing published image directory.
const assetRoot = window.PORTFOLIO_ASSET_ROOT || '';
const asset = file => assetRoot + file;
const gallery = document.getElementById('portfolio-grid');
const filters = Array.from(document.querySelectorAll('.filter'));
const moreButton = document.getElementById('show-more');
const actionContainer = document.querySelector('.gallery-actions');
let currentFilter = 'all';
let showAll = false;
let activePreview = 0;

function makeCard(project, i) {
  const card = document.createElement('article');
  card.className = 'work-card';
  card.dataset.category = project.category;
  card.dataset.index = i;
  const number = String(i + 1).padStart(2, '0');
  const categoryLabel = project.category[0].toUpperCase() + project.category.slice(1);
  card.innerHTML = `
    <button class="work-image" type="button" aria-label="Preview thumbnail ${number}">
      <img src="${asset(project.image)}" alt="Thumbnail design ${number} — ${categoryLabel}" loading="lazy">
    </button>
    ${project.alternate ? `<div class="ab-switch" role="group" aria-label="Thumbnail variation">
      <button type="button" data-variant="a" aria-pressed="true" aria-label="Show variation A">A</button>
      <button type="button" data-variant="b" aria-pressed="false" aria-label="Show variation B">B</button>
    </div>` : ''}
    <div class="work-card-foot"><div><div class="work-card-title">Thumbnail ${number}</div><div class="work-card-category">${categoryLabel} / Visual design</div></div><span class="work-index">${number} / 18</span></div>`;
  return card;
}

projects.forEach((project, i) => gallery.appendChild(makeCard(project, i)));
const cards = Array.from(gallery.querySelectorAll('.work-card'));

function renderGallery() {
  const matched = cards.filter(card => currentFilter === 'all' || card.dataset.category === currentFilter);
  cards.forEach(card => {
    const i = matched.indexOf(card);
    card.hidden = i < 0 || (!showAll && i >= 9);
  });
  actionContainer.hidden = matched.length <= 9;
  moreButton.innerHTML = showAll ? 'Show less <span aria-hidden="true">↑</span>' : 'View all thumbnails <span aria-hidden="true">↓</span>';
}
filters.forEach(button => button.addEventListener('click', () => {
  currentFilter = button.dataset.filter;
  showAll = false;
  filters.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  renderGallery();
}));
moreButton.addEventListener('click', () => {
  showAll = !showAll;
  renderGallery();
  if(!showAll) document.getElementById('work').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
});
renderGallery();

gallery.addEventListener('click', e => {
  const variant = e.target.closest('[data-variant]');
  if (variant) {
    const card = variant.closest('.work-card');
    const project = projects[Number(card.dataset.index)];
    card.querySelector('img').src = asset(variant.dataset.variant === 'b' ? project.alternate : project.image);
    card.querySelectorAll('[data-variant]').forEach(btn => btn.setAttribute('aria-pressed', String(btn === variant)));
    return;
  }
  const imageButton = e.target.closest('.work-image');
  if (imageButton) {
    const card = imageButton.closest('.work-card');
    openPreview(Number(card.dataset.index));
  }
});

const modal = document.getElementById('lightbox');
const modalImage = modal.querySelector('img');
const modalCaption = modal.querySelector('.lightbox-caption');
let lastFocused = null;
function openPreview(i) {
  if (!modal.open) lastFocused = document.activeElement;
  activePreview = i;
  const card = cards[activePreview];
  modalImage.src = card.querySelector('.work-image img').src;
  modalImage.alt = card.querySelector('.work-image img').alt;
  modalCaption.textContent = `Thumbnail ${String(activePreview + 1).padStart(2,'0')} / ${projects.length}`;
  if (!modal.open) modal.showModal();
  modal.querySelector('.lightbox-close').focus();
}
function stepPreview(direction) {
  const visible = cards.filter(c => !c.hidden);
  if (!visible.length) return;
  const index = visible.findIndex(c => Number(c.dataset.index) === activePreview);
  const next = visible[(index + direction + visible.length) % visible.length];
  openPreview(Number(next.dataset.index));
}
modal.querySelector('.lightbox-close').addEventListener('click', () => modal.close());
modal.querySelector('.lightbox-arrow.left').addEventListener('click', () => stepPreview(-1));
modal.querySelector('.lightbox-arrow.right').addEventListener('click', () => stepPreview(1));
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
modal.addEventListener('close', () => { if(lastFocused?.focus) lastFocused.focus(); });
modal.addEventListener('keydown', e => {
  if (!redesignPreviewOpen && e.key === 'ArrowLeft') { e.preventDefault(); stepPreview(-1); }
  if (!redesignPreviewOpen && e.key === 'ArrowRight') { e.preventDefault(); stepPreview(1); }
});

// Marquee rows are duplicated to create a seamless, infinite scroll.
const walls = [
  ['thumb1-a.jpg','thumb2.jpg','thumb3-a.jpg','thumb4.jpg','thumb5.png','thumb7.jpg','thumb9.png','thumb10.png'],
  ['thumb11.png','thumb12.jpg','thumb13.png','thumb14.jpg','thumb15.jpg','thumb16.jpg','thumb17.jpg','thumb18.jpg'],
  ['thumb19-b.jpg','thumb20.jpg','thumb5.png','thumb3-b.jpg','thumb9.png','thumb1-b.jpg','thumb16.jpg','thumb4.jpg']
];
walls.forEach((items, row) => {
  const track = document.querySelector(`[data-wall="${row + 1}"]`);
  track.innerHTML = [...items, ...items].map((file, i) => `<div class="wall-thumb" aria-hidden="true"><img src="${asset(file)}" loading="${i < 4 ? 'eager' : 'lazy'}" alt=""></div>`).join('');
});

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu.addEventListener('click', () => {
  const next = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded',String(next));
  menu.setAttribute('aria-label',next ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open',next);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
window.addEventListener('resize',() => {if(innerWidth > 650) closeMenu();});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {entry.target.classList.add('visible');reveal.unobserve(entry.target);}
  }),{threshold:.12});
  document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
} else document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
document.getElementById('year').textContent = new Date().getFullYear();


// Added redesign comparison preview handler; original gallery and controls untouched.
let redesignPreviewOpen = false;
const redesignSection = document.getElementById('redesigns');
redesignSection.addEventListener('click', event => {
  const button = event.target.closest('[data-redesign-image]');
  if (!button) return;
  redesignPreviewOpen = true;
  modalImage.src = button.dataset.redesignImage;
  modalImage.alt = button.dataset.redesignCaption;
  modalCaption.textContent = button.dataset.redesignCaption;
  modal.querySelectorAll('.lightbox-arrow').forEach(arrow => arrow.hidden = true);
  lastFocused = document.activeElement;
  if (!modal.open) modal.showModal();
  modal.querySelector('.lightbox-close').focus();
});
// Re-enable the original gallery's next/previous controls after viewing a redesign.
const originalGalleryOpenPreview = openPreview;
openPreview = function(i) {
  redesignPreviewOpen = false;
  modal.querySelectorAll('.lightbox-arrow').forEach(arrow => arrow.hidden = false);
  originalGalleryOpenPreview(i);
};
