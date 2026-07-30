import { ROUTES } from './routes';

export const SITE_URL = 'https://andkiv.com';
export const SITE_NAME = 'Андрей Киверин — портфолио';

export type PageSeo = {
  title: string;
  description: string;
  index: boolean;
};

const DEFAULT_SEO: PageSeo = {
  title: 'Андрей Киверин — веб-разработчик',
  description:
    'Портфолио Андрея Киверина: веб-разработка, интерфейсы, проекты, профессиональные достижения и гранты.',
  index: true,
};

const ROUTE_SEO: Record<string, PageSeo> = {
  [ROUTES.HOME]: DEFAULT_SEO,
  [ROUTES.PROJECTS]: {
    title: 'Проекты — Андрей Киверин',
    description:
      'Избранные проекты Андрея Киверина: разработка веб-приложений, интерфейсов и цифровых продуктов.',
    index: true,
  },
  [ROUTES.ACHIEVEMENTS]: {
    title: 'Достижения — Андрей Киверин',
    description:
      'Профессиональные и образовательные достижения Андрея Киверина, награды и подтверждённые результаты.',
    index: true,
  },
  [ROUTES.TERMS]: {
    title: 'Пользовательское соглашение — Андрей Киверин',
    description: 'Условия использования персонального сайта-портфолио Андрея Киверина.',
    index: true,
  },
  [ROUTES.PRIVACY]: {
    title: 'Политика конфиденциальности — Андрей Киверин',
    description: 'Порядок обработки и защиты персональных данных на сайте andkiv.com.',
    index: true,
  },
  [ROUTES.AUTH]: {
    title: 'Вход — Андрей Киверин',
    description: 'Вход в личный кабинет.',
    index: false,
  },
  [ROUTES.REGISTER]: {
    title: 'Регистрация — Андрей Киверин',
    description: 'Создание учётной записи.',
    index: false,
  },
  [ROUTES.PROFILE]: {
    title: 'Профиль — Андрей Киверин',
    description: 'Личный профиль пользователя.',
    index: false,
  },
  [ROUTES.ADMIN]: {
    title: 'Управление сайтом — Андрей Киверин',
    description: 'Административная панель.',
    index: false,
  },
};

export const getPageSeo = (pathname: string): PageSeo => {
  if (pathname.startsWith(ROUTES.ADMIN)) return ROUTE_SEO[ROUTES.ADMIN];

  return (
    ROUTE_SEO[pathname] ?? {
      title: 'Страница не найдена — Андрей Киверин',
      description: 'Запрошенная страница не найдена.',
      index: false,
    }
  );
};
