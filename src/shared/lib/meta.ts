export const Meta = {
  initial: 'initial',
  loading: 'loading',
  error: 'error',
  success: 'success',
} as const;

export type Meta = (typeof Meta)[keyof typeof Meta];
