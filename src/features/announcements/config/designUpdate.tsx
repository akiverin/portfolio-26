import Text from '@/shared/ui/Text';

export const DESIGN_UPDATE_ANNOUNCEMENT = {
  id: 'design-update-2026',
  message: (
    <span>
      Дизайн сайта был обновлен. <span style={{ opacity: 0.5 }}>v.2.1</span>
    </span>
  ),
  // Midnight in the visitor's timezone: the full day of December 31 is included.
  expiresAt: new Date(2027, 0, 1).getTime(),
} as const;
