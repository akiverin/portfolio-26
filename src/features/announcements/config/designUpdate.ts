export const DESIGN_UPDATE_ANNOUNCEMENT = {
  id: 'design-update-2026',
  message: 'Дизайн сайта был обновлен.',
  // Midnight in the visitor's timezone: the full day of December 31 is included.
  expiresAt: new Date(2027, 0, 1).getTime(),
} as const;
