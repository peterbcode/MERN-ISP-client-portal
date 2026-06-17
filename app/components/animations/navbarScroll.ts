export function initNavbarScroll(navEl: HTMLElement) {
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;

    // Hide on scroll down, show on scroll up
    // We only hide when scrolled down a bit (y > 200)
    if (y > lastY && y > 200) {
      navEl.style.transform = 'translateY(-100%)';
    } else {
      // CRITICAL: Using 'none' instead of 'translateY(0)' is essential.
      // A transform value other than 'none' creates a new containing block,
      // which causes any 'fixed' children to be positioned relative to this 
      // element instead of the viewport.
      navEl.style.transform = 'none';
    }

    lastY = y;
  };

  navEl.style.transition = 'transform 0.3s ease';

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
