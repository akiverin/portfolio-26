'use client';

import styles from './Header.module.scss';
import Text from 'shared/ui/Text';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ROUTES, ANCHORS } from 'shared/configs/routes';

const NAV_LINKS = [
  { to: ANCHORS.PROJECTS, label: 'Проекты' },
  { to: ANCHORS.ABOUT, label: 'Обо мне' },
  { to: ANCHORS.ACHIEVEMENTS, label: 'Достижения' },
  { to: ANCHORS.CONTACT, label: 'Связаться' },
  { to: ROUTES.AUTH, label: 'Войти' },
];

const Header: React.FC = () => {
  const location = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.header__bg}>
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
        <div className={styles.header__blurLayer} />
      </div>
      <div className={styles.header__wrapper}>
        <div className={styles.header__content}>
          <nav className={`${styles.header__navigate} ${isMenuOpen ? styles.active : ''}`}>
            <ul className={styles.header__navList}>
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to} className={styles.header__navItem}>
                  <Link className={styles.header__link} href={to} onClick={closeMenu}>
                    <Text view="p-16" color={location === to ? undefined : 'primary'}>
                      {label}
                    </Text>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
