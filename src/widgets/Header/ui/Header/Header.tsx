import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { IconUser } from '@tabler/icons-react';
import styles from './Header.module.scss';
import Text from 'shared/ui/Text';
import { ANCHORS, ROUTES } from 'shared/configs/routes';
import { useUserStore } from 'shared/stores/StoreContext';

const NAV_LINKS = [
  { to: ANCHORS.ABOUT, label: 'Обо мне' },
  { to: ANCHORS.PROJECTS, label: 'Проекты' },
  { to: ANCHORS.ACHIEVEMENTS, label: 'Достижения' },
  { to: ANCHORS.CONTACT, label: 'Связаться' },
];

const AUTH_PATHS = [ROUTES.AUTH, ROUTES.PROFILE, ROUTES.ADMIN] as readonly string[];

const Header: React.FC = observer(() => {
  const location = useLocation();
  const userStore = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  const currentPath = location.pathname + location.hash;

  const isLinkActive = (to: string) => {
    const hash = to.split('#')[1];
    if (hash && location.pathname === '/') {
      return activeHash === `#${hash}`;
    }
    return currentPath === to;
  };

  const isAdmin = userStore.currentUser?.role === 'admin';
  const isProfileActive = location.pathname === ROUTES.PROFILE;
  const isAdminActive = location.pathname === ROUTES.ADMIN;
  const isLoginActive =
    location.pathname === ROUTES.AUTH || location.pathname === ROUTES.REGISTER;

  useEffect(() => {
    const handleScroll = () => setScrolled(globalThis.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveHash('');
      return;
    }

    const sectionIds = ['projects', 'about', 'achievements', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    const timeout = setTimeout(() => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    const hash = location.hash;
    if (hash && location.pathname === '/') {
      const timeout = setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [location.hash, location.pathname]);

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

  const photoURL = userStore.currentUser?.photoURL ?? null;

  return (
    <header
      className={classNames(styles.header, scrolled && styles['header--scrolled'])}
      data-auth-route={AUTH_PATHS.includes(location.pathname) ? 'true' : undefined}
    >
      <div className={styles.header__wrapper}>
        <nav className={styles.header__nav} aria-label="Основная навигация">
          <ul className={styles.header__navList}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to} className={styles.header__navItem}>
                <Link
                  className={classNames(
                    styles.header__link,
                    isLinkActive(to) && styles['header__link--active'],
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
            {userStore.isAuth ? (
              <>
                {isAdmin && (
                  <li className={styles.header__navItem}>
                    <Link
                      className={classNames(
                        styles.header__link,
                        isAdminActive && styles['header__link--active'],
                      )}
                      to={ROUTES.ADMIN}
                    >
                      <Text view="p-14" weight="medium">
                        Панель
                      </Text>
                    </Link>
                  </li>
                )}
                <li className={styles.header__navItem}>
                  <Link
                    className={classNames(
                      styles.header__profileLink,
                      isProfileActive && styles['header__profileLink--active'],
                    )}
                    to={ROUTES.PROFILE}
                    aria-label="Профиль"
                  >
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt=""
                        className={styles.header__avatar}
                        width={28}
                        height={28}
                      />
                    ) : (
                      <span className={styles.header__userIcon}>
                        <IconUser size={16} stroke={1.5} />
                      </span>
                    )}
                  </Link>
                </li>
              </>
            ) : (
              <li className={styles.header__navItem}>
                <Link
                  className={classNames(
                    styles.header__link,
                    isLoginActive && styles['header__link--active'],
                  )}
                  to={ROUTES.AUTH}
                >
                  <Text view="p-14" weight="medium">
                    Войти
                  </Text>
                </Link>
              </li>
            )}
          </ul>

          <button
            className={classNames(
              styles.header__burger,
              isMenuOpen && styles['header__burger--open'],
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
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
            id="mobile-navigation"
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
                  isLinkActive(to) && styles['header__mobileLink--active'],
                )}
                to={to}
                onClick={(e) => handleLinkClick(e, to)}
              >
                <Text view="p-18" weight="medium">
                  {label}
                </Text>
              </Link>
            ))}
            {userStore.isAuth ? (
              <>
                {isAdmin && (
                  <Link
                    className={classNames(
                      styles.header__mobileLink,
                      isAdminActive && styles['header__mobileLink--active'],
                    )}
                    to={ROUTES.ADMIN}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Text view="p-18" weight="medium">
                      Панель
                    </Text>
                  </Link>
                )}
                <Link
                  className={classNames(
                    styles.header__mobileLink,
                    styles.header__mobileProfileLink,
                    isProfileActive && styles['header__mobileLink--active'],
                  )}
                  to={ROUTES.PROFILE}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt=""
                      className={styles.header__avatar}
                      width={28}
                      height={28}
                    />
                  ) : (
                    <span className={styles.header__userIcon}>
                      <IconUser size={18} stroke={1.5} />
                    </span>
                  )}
                  <Text view="p-18" weight="medium">
                    Профиль
                  </Text>
                </Link>
              </>
            ) : (
              <Link
                className={classNames(
                  styles.header__mobileLink,
                  isLoginActive && styles['header__mobileLink--active'],
                )}
                to={ROUTES.AUTH}
                onClick={() => setIsMenuOpen(false)}
              >
                <Text view="p-18" weight="medium">
                  Войти
                </Text>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
