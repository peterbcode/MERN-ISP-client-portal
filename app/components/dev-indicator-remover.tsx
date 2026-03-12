'use client';

import { useEffect } from 'react';

export default function DevIndicatorRemover() {
  useEffect(() => {
    // Function to hide dev indicators
    const hideDevIndicators = () => {
      // Hide various dev elements
      const devElements = [
        '.next-dev-overlay',
        '.next-dev-tools',
        '.__next-dev-container',
        '[data-nextjs-dev-indicator]',
        '[style*="position: fixed"][style*="z-index: 9999"]',
        '#__react-devtools'
      ];

      devElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const element = el as HTMLElement;
          element.style.display = 'none';
        });
      });

      // Hide any element with high z-index that might be a dev indicator
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        const element = el as HTMLElement;
        const style = window.getComputedStyle(element);
        const zIndex = parseInt(style.zIndex);
        
        if (zIndex > 9998 && style.position === 'fixed') {
          element.style.display = 'none';
        }
      });
    };

    // Run immediately and periodically
    hideDevIndicators();
    const interval = setInterval(hideDevIndicators, 1000);

    // Also run when DOM changes
    const observer = new MutationObserver(hideDevIndicators);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return null;
}
