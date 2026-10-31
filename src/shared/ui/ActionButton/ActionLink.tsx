import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import type { ActionButtonBaseProps, ActionVariant } from './ActionButton';
import styles from './ActionButton.module.scss';

type ActionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  ActionButtonBaseProps & {
    href: string;
    variant?: ActionVariant;
    children: ReactNode;
    disabled?: boolean;
  };

/** Button appearance with native link semantics: open in new tab, copy URL, etc. */
const ActionLink = forwardRef<HTMLAnchorElement, ActionLinkProps>(function ActionLink(
  {
    href,
    variant = 'primary',
    design = 'mono',
    surface,
    chevron = false,
    size = 'md',
    startIcon,
    endIcon,
    loading = false,
    loadingLabel = 'Загрузка',
    fullWidth = false,
    tone = 'default',
    disabled = false,
    nativeContent: _nativeContent,
    className,
    children,
    onClick,
    onAuxClick,
    target,
    rel,
    tabIndex,
    ...props
  },
  ref,
) {
  const blocked = disabled || loading;
  const shared = {
    ...props,
    ref,
    target,
    rel: rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined),
    className: classNames(styles.button, className),
    'data-design': design,
    'data-surface': surface,
    'data-chevron': chevron || undefined,
    'data-variant': variant,
    'data-size': size,
    'data-loading': loading || undefined,
    'data-full-width': fullWidth || undefined,
    'data-tone': tone === 'danger' ? tone : undefined,
    'aria-disabled': blocked || undefined,
    'aria-busy': loading || undefined,
    tabIndex: blocked ? -1 : tabIndex,
    onClick: ((event) => {
      if (blocked) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    }) as React.MouseEventHandler<HTMLAnchorElement>,
    onAuxClick: ((event) => {
      if (blocked) {
        event.preventDefault();
        return;
      }
      onAuxClick?.(event);
    }) as React.MouseEventHandler<HTMLAnchorElement>,
  };
  const content = (
    <>
      <span className={styles.button__content} aria-hidden={loading || undefined}>
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
      {loading && (
        <span className={styles.button__progress}>
          <span className={styles.button__spinner} aria-hidden="true" />
          <span className={styles.button__srOnly}>{loadingLabel}</span>
        </span>
      )}
    </>
  );
  const external = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
  return external || blocked ? (
    <a {...shared} href={blocked ? undefined : href}>
      {content}
    </a>
  ) : (
    <Link {...shared} to={href}>
      {content}
    </Link>
  );
});

export default ActionLink;
