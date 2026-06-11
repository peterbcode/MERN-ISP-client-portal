export function initNavbarScroll(navEl: HTMLElement) {
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;

    if (y > 80) {
      navEl.style.background = 'rgba(8,8,7,0.92)';
      navEl.style.backdropFilter = 'blur(12px)';
      (navEl.style as any).webkitBackdropFilter = 'blur(12px)';
    } else {
      navEl.style.background = 'transparent';
      navEl.style.backdropFilter = 'none';
      (navEl.style as any).webkitBackdropFilter = 'none';
    }

    // Hide on scroll down, show on scroll up
    if (y > lastY && y > 200) {
      navEl.style.transform = 'translateY(-100%)';
    } else {
      navEl.style.transform = 'translateY(0)';
    }

    lastY = y;
  };

  navEl.style.transition = 'background 0.3s ease, backdrop-filter 0.3s ease, transform 0.3s ease';

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
