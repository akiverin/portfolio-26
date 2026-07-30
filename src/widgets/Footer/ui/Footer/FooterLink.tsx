import React from 'react';
import Text from 'shared/ui/Text';
import styles from './Footer.module.scss';

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  external?: boolean;
};

const FooterLink: React.FC<FooterLinkProps> = ({ href, children, icon, external }) => (
  <a
    href={href}
    className={styles.footer__action}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
  >
    {icon}
    <Text tag="span" view="p-20" weight="medium">
      {children}
    </Text>
  </a>
);

export default FooterLink;
