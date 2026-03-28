import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import styles from './Header.module.scss';
import Text from 'shared/ui/Text';
import { ANCHORS, ROUTES } from 'shared/configs/routes';
import { useUserStore } from 'shared/stores/StoreContext';

const NAV_LINKS = [
  { to: ANCHORS.PROJECTS, label: 'Проекты' },
  { to: ANCHORS.ABOUT, label: 'Обо мне' },
  { to: ANCHORS.ACHIEVEMENTS, label: 'Достижения' },
  { to: ANCHORS.CONTACT, label: 'Связаться' },
];

const AUTH_PATHS = [ROUTES.AUTH, ROUTES.PROFILE] as readonly string[];

const Header: React.FC = observer(() => {
  const location = useLocation();
  const userStore = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentPath = location.pathname + location.hash;

  const authLink = userStore.isAuth
    ? { to: ROUTES.PROFILE, label: 'Профиль' }
    : { to: ROUTES.AUTH, label: 'Войти' };

  const isAuthActive = AUTH_PATHS.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(globalThis.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
      const hash = to.split('#')[1];
      if (hash && location.pathname === '/') {
        e.preventDefault();
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          globalThis.history.replaceState(null, '', to);
        }
      }
      setIsMenuOpen(false);
    },
    [location.pathname],
  );

  return (
    <header className={classNames(styles.header, scrolled && styles['header--scrolled'])}>
      <div className={styles.header__wrapper}>
        <nav className={styles.header__nav}>
          <ul className={styles.header__navList}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to} className={styles.header__navItem}>
                <Link
                  className={classNames(
                    styles.header__link,
                    currentPath === to && styles['header__link--active'],
                  )}
                  to={to}
                  onClick={(e) => handleLinkClick(e, to)}
                >
                  <Text view="p-14" weight="medium">
                    {label}
                  </Text>
                </Link>
              </li>
            ))}
            <li className={styles.header__navItem}>
              <Link
                className={classNames(
                  styles.header__link,
                  isAuthActive && styles['header__link--active'],
                )}
                to={authLink.to}
              >
                <Text view="p-14" weight="medium">
                  {authLink.label}
                </Text>
              </Link>
            </li>
          </ul>

          <button
            className={classNames(
              styles.header__burger,
              isMenuOpen && styles['header__burger--open'],
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            type="button"
          >
            <span />
            <span />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.header__mobileMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                className={classNames(
                  styles.header__mobileLink,
                  currentPath === to && styles['header__mobileLink--active'],
                )}
                to={to}
                onClick={(e) => handleLinkClick(e, to)}
              >
                <Text view="p-18" weight="medium">
                  {label}
                </Text>
              </Link>
            ))}
            <Link
              className={classNames(
                styles.header__mobileLink,
                isAuthActive && styles['header__mobileLink--active'],
              )}
              to={authLink.to}
              onClick={() => setIsMenuOpen(false)}
            >
              <Text view="p-18" weight="medium">
                {authLink.label}
              </Text>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
