import { SITE_VERSION } from 'shared/configs/version';

export const DESIGN_UPDATE_ANNOUNCEMENT = {
  id: 'design-update-2026',
  title: 'andkiv',
  badge: SITE_VERSION,
  message: 'Дизайн сайта был обновлен.',
  // The full day of December 31 is included in the visitor's timezone.
  expiresAt: new Date(2027, 0, 1).getTime(),
} as const;
