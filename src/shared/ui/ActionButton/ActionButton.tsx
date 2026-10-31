import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './ActionButton.module.scss';

export const BUTTON_DESIGNS = ['studio', 'cobalt', 'press', 'circuit', 'film'] as const;
export type ButtonDesign = (typeof BUTTON_DESIGNS)[number];
export type ActionButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type ActionButtonBaseProps = {
  design?: ButtonDesign;
  size?: ActionButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  tone?: 'default' | 'danger';
  /** Retain structural markup such as a two-line menu toggle. */
  nativeContent?: boolean;
};

type BaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & ActionButtonBaseProps;

export type ActionButtonProps = BaseProps &
  (
    | { variant?: 'primary' | 'secondary'; children: ReactNode }
    | { variant: 'icon'; children: ReactNode; 'aria-label': string }
  );

/** Native button semantics shared by every visual direction in the button lab. */
const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  {
    design = 'film',
    variant = 'primary',
    size = 'md',
    startIcon,
    endIcon,
    loading = false,
    loadingLabel = 'Загрузка',
    fullWidth = false,
    tone = 'default',
    nativeContent = false,
    disabled = false,
    type = 'button',
    className,
    children,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading && variant === 'icon' ? `${ariaLabel}: ${loadingLabel}` : ariaLabel}
      className={classNames(styles.button, className)}
      data-design={design}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      data-tone={tone === 'danger' ? tone : undefined}
    >
      {nativeContent ? (
        children
      ) : (
        <span
          className={styles.button__content}
          aria-hidden={loading || variant === 'icon' || undefined}
        >
          {startIcon && (
            <span className={styles.button__icon} aria-hidden="true">
              {startIcon}
            </span>
          )}
          <span className={styles.button__label}>{children}</span>
          {endIcon && (
            <span className={styles.button__icon} aria-hidden="true">
              {endIcon}
            </span>
          )}
        </span>
      )}
      {loading && (
        <span className={styles.button__progress}>
          <span className={styles.button__spinner} aria-hidden="true" />
          {variant !== 'icon' && <span className={styles.button__srOnly}>{loadingLabel}</span>}
        </span>
      )}
    </button>
  );
});

export default ActionButton;
