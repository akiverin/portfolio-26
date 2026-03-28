import React from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import Loader from 'shared/ui/Loader';
import { Link } from 'react-router-dom';

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
};

const isExternalLink = (href: string): boolean => {
  return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
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
    if (isExternalLink(href)) {
      return (
        <a
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className={buttonClasses}
        >
          {loading && <Loader className={styles.button__loader} size="s" />}
          {children}
        </a>
      );
    }

    return (
      <Link to={href} target={target} className={buttonClasses}>
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
