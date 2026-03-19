/* Handles cross-screen navigation with a short exit animation. */
function goTo(screen) {
  const page = document.querySelector('.page');
  if (page) {
    page.classList.add('page-leave');
  }
  window.setTimeout(function () {
    window.location.href = screen;
  }, 200);
}

/* Goes back safely in history, falling back to index when history is empty. */
function goBack(fallback) {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.href = fallback || 'index.html';
}

/* Initializes entry animation after page load. */
function initPageTransition() {
  const page = document.querySelector('.page');
  if (!page) {
    return;
  }
  page.style.opacity = '0';
  page.style.transform = 'translateY(8px)';
  window.requestAnimationFrame(function () {
    page.style.opacity = '1';
    page.style.transform = 'translateY(0)';
  });
}

document.addEventListener('DOMContentLoaded', initPageTransition);
