/**
 * Font face declarations are now handled via CSS @font-face in _fonts.scss.
 * This file exports CSS variable names for consistency.
 */
export const FONT_FAMILY = {
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
  pretendard: 'var(--font-pretendard)',
  caveat: 'var(--font-caveat)',
} as const;
