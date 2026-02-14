import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import Loader from 'shared/ui/Loader';
import Link, { LinkProps } from 'next/link';

export type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  theme?: 'dark' | 'primary' | 'accent';
  loading?: boolean;
  noPadding?: boolean;
  className?: string;
  target?: '_blank' | '_self';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  linkProps?: Omit<LinkProps, 'href' | 'children'>;
};

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  theme = 'primary',
  loading = false,
  className,
  target,
  onClick,
  type = 'button',
  disabled,
  linkProps = {},
  noPadding,
}) => {
  const buttonClasses = classNames(
    styles.button,
    className,
    loading && styles['button--loading'],
    noPadding && styles['button--noPadding'],
    theme === 'accent' && styles['button--accent'],
    theme === 'dark' && styles['button--dark'],
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={buttonClasses}
        {...linkProps}
      >
        {loading && <Loader className={styles.button__loader} size="s" />}
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick} type={type} disabled={disabled || loading}>
      {loading && <Loader className={styles.button__loader} size="s" />}
      {children}
    </button>
  );
};

export default Button;
