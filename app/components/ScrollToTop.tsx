'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Give the page a tick to render, then scroll to the anchor
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);
  return null;
}
