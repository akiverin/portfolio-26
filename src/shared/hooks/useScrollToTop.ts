import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Restores the active page scroller, including anchors inside the signed-in frame. */
export const useScrollToTop = (): void => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previousValue = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousValue;
    };
  }, []);

  useLayoutEffect(() => {
    if (hash) {
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        id = hash.slice(1);
      }
      const scrollToAnchor = () => {
        const target = document.getElementById(id);
        target?.scrollIntoView({ block: 'start', behavior: 'auto' });
        return Boolean(target);
      };
      if (scrollToAnchor()) return;

      // A lazy route may render its anchor after the initial layout effect.
      const observer = new MutationObserver(() => {
        if (scrollToAnchor()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }

    const scrollToTop = () => {
      document.querySelector<HTMLElement>('[data-page-scroll]')?.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    scrollToTop();
    let secondFrame: number | undefined;
    const firstFrame = requestAnimationFrame(() => {
      scrollToTop();
      secondFrame = requestAnimationFrame(scrollToTop);
    });
    const afterRouteLoad = window.setTimeout(scrollToTop, 120);

    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
      window.clearTimeout(afterRouteLoad);
    };
  }, [pathname, hash]);
};
