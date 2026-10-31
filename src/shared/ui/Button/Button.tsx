import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import ActionButton, { ActionLink } from 'shared/ui/ActionButton';
import type { ActionButtonBaseProps } from 'shared/ui/ActionButton';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> &
  ActionButtonBaseProps & {
    children: ReactNode;
    href?: string;
    theme?: 'dark' | 'primary' | 'accent';
    variant?: 'primary' | 'secondary';
    noPadding?: boolean;
    target?: '_blank' | '_self';
  };

/** Compatibility entry point: existing forms now use the same Film component. */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    href,
    theme = 'primary',
    variant = theme === 'dark' ? 'secondary' : 'primary',
    noPadding: _noPadding,
    target,
    design = 'film',
    ...props
  },
  ref,
) {
  if (href) {
    return (
      <ActionLink
        design={design}
        variant={variant}
        href={href}
        target={target}
        className={props.className}
        title={props.title}
        disabled={props.disabled}
        loading={props.loading}
        loadingLabel={props.loadingLabel}
        size={props.size}
        startIcon={props.startIcon}
        endIcon={props.endIcon}
        fullWidth={props.fullWidth}
        tone={props.tone}
        aria-label={props['aria-label']}
      >
        {children}
      </ActionLink>
    );
  }
  return (
    <ActionButton {...props} ref={ref} design={design} variant={variant}>
      {children}
    </ActionButton>
  );
});

export default Button;
