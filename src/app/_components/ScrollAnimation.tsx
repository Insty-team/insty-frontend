'use client';

import { useEffect } from 'react';

export default function ScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      {
        //30% 보이면 애니 시작
        threshold: 0.3,
        rootMargin: '-10% 0px',
      },
    );

    const ctaObserver = new IntersectionObserver(
      (entries) => {
        const loginButton = document.querySelector('.fixed-login-button') as HTMLElement;
        const guestButton = document.querySelector('.fixed-guest-button') as HTMLElement;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (loginButton) {
              loginButton.classList.add('opacity-0', 'pointer-events-none');
              guestButton.classList.add('opacity-0', 'pointer-events-none');
            }
          } else {
            if (loginButton) {
              loginButton.classList.remove('opacity-0', 'pointer-events-none');
              guestButton.classList.remove('opacity-0', 'pointer-events-none');
            }
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    // CTA 섹션 감지
    const ctaSection = document.querySelector('#cta');
    if (ctaSection) {
      ctaObserver.observe(ctaSection);
    }

    return () => {
      observer.disconnect();
      ctaObserver.disconnect();
    };
  }, []);
  return null;
}
