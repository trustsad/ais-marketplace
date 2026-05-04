'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Defer slightly so Next.js finishes hydration before scrolling
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);
  return null;
}
