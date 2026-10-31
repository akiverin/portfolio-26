import React from 'react';
import styles from './Footer.module.scss';

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, external }) => (
  <a
    href={href}
    className={styles.footer__action}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
  >
    {children}
  </a>
);

export default FooterLink;
