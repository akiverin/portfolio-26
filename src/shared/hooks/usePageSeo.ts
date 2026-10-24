import { useEffect } from 'react';
import { ROUTES } from 'shared/configs/routes';
import { getPageSeo, SITE_NAME, SITE_URL } from 'shared/configs/seo';

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
};

const setCanonical = (href: string) => {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }

  canonical.href = href;
};

const setStructuredData = (pathname: string) => {
  const existing = document.getElementById('portfolio-structured-data');

  if (pathname !== ROUTES.HOME) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement('script');
  script.id = 'portfolio-structured-data';
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: 'ru-RU',
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: 'Андрей Киверин',
        url: `${SITE_URL}/`,
        jobTitle: 'Веб-разработчик',
        sameAs: ['https://github.com/akiverin', 'https://www.behance.net/kiverin03fb9c'],
      },
    ],
  });

  if (!existing) document.head.appendChild(script);
};

export const usePageSeo = (pathname: string) => {
  useEffect(() => {
    const seo = getPageSeo(pathname);
    const canonicalUrl = new URL(pathname, SITE_URL).toString();
    const robots = seo.index ? 'index, follow' : 'noindex, nofollow';

    document.title = seo.title;
    setCanonical(canonicalUrl);
    setMeta('name', 'description', seo.description);
    setMeta('name', 'robots', robots);
    setMeta('name', 'googlebot', robots);
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:locale', 'ru_RU');
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setStructuredData(pathname);
  }, [pathname]);
};
