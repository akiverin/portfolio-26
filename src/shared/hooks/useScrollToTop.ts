import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Restores the top of the viewport when the user opens another route. */
export const useScrollToTop = (): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;

    const previousValue = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      window.history.scrollRestoration = previousValue;
    };
  }, []);

  useLayoutEffect(() => {
    const scrollToTop = () => {
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
  }, [pathname]);
};
