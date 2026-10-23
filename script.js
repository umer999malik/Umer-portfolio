'use strict';

document.documentElement.classList.add('js');

// Graceful scroll reveals. When unsupported, all content stays visible.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const cards = [...document.querySelectorAll('.project-card')];
const filters = [...document.querySelectorAll('.filter-button')];
const showMoreButton = document.getElementById('showMore');
const galleryCount = document.getElementById('galleryCount');
const INITIAL_VISIBLE = 9;
let activeCategory = 'all';
let expanded = false;

function renderGallery() {
  const filtered = cards.filter(card => activeCategory === 'all' || card.dataset.category === activeCategory);
  cards.forEach(card => { card.hidden = true; });
  filtered.forEach((card, index) => { card.hidden = !expanded && index >= INITIAL_VISIBLE; });
  galleryCount.textContent = `${filtered.length} project${filtered.length === 1 ? '' : 's'}`;
  const needsMore = filtered.length > INITIAL_VISIBLE;
  showMoreButton.hidden = !needsMore;
  showMoreButton.textContent = expanded ? 'Show less ↑' : 'View all projects ↓';
  showMoreButton.setAttribute('aria-expanded', String(expanded));
}

filters.forEach(button => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    expanded = false;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    renderGallery();
  });
});

showMoreButton.addEventListener('click', () => {
  expanded = !expanded;
  renderGallery();
});

// Toggle concept A / concept B on gallery cards.
document.querySelectorAll('.variant-switch').forEach(control => {
  const card = control.closest('.project-card');
  const image = card.querySelector('.project-open img');
  control.querySelectorAll('.variant-button').forEach(button => {
    button.addEventListener('click', () => {
      image.src = button.dataset.src;
      image.alt = `Thumbnail design, variation ${button.textContent.trim()}`;
      control.querySelectorAll('.variant-button').forEach(option =>
        option.setAttribute('aria-pressed', String(option === button))
      );
    });
  });
});

// Native dialog: focus management, Escape-to-close, and backdrop click built in.
const dialog = document.getElementById('previewDialog');
const dialogImage = document.getElementById('previewImage');
const dialogTitle = document.getElementById('previewTitle');
const previewCounter = document.getElementById('previewCounter');
const previewButtons = [...document.querySelectorAll('.project-open')];
let currentIndex = 0;
let lastTrigger = null;

function showPreview(index) {
  const button = previewButtons[index];
  if (!button) return;
  const image = button.querySelector('img');
  dialogImage.src = image.src;
  dialogImage.alt = image.alt;
  dialogTitle.textContent = button.closest('.project-card').querySelector('.project-title').textContent;
  const visibleButtons = previewButtons.filter(btn => !btn.closest('.project-card').hidden);
  previewCounter.textContent = `${visibleButtons.indexOf(button) + 1} / ${visibleButtons.length}`;
  currentIndex = index;
}

function stepPreview(direction) {
  const visible = previewButtons.filter(btn => !btn.closest('.project-card').hidden);
  const currentButton = previewButtons[currentIndex];
  let currentVisible = visible.indexOf(currentButton);
  currentVisible = (currentVisible + direction + visible.length) % visible.length;
  showPreview(previewButtons.indexOf(visible[currentVisible]));
}

previewButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    lastTrigger = button;
    showPreview(index);
    dialog.showModal();
  });
});

document.getElementById('previewClose').addEventListener('click', () => dialog.close());
document.getElementById('previewPrevious').addEventListener('click', () => stepPreview(-1));
document.getElementById('previewNext').addEventListener('click', () => stepPreview(1));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => { if (lastTrigger && !lastTrigger.closest('.project-card').hidden) lastTrigger.focus(); });
document.addEventListener('keydown', event => {
  if (!dialog.open) return;
  if (event.key === 'ArrowLeft') stepPreview(-1);
  if (event.key === 'ArrowRight') stepPreview(1);
});

renderGallery();
