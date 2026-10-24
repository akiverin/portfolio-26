import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Tooltip } from '@mantine/core';
import { HouseSimpleIcon } from '@phosphor-icons/react/dist/csr/HouseSimple';
import { IdentificationCardIcon } from '@phosphor-icons/react/dist/csr/IdentificationCard';
import { StackSimpleIcon } from '@phosphor-icons/react/dist/csr/StackSimple';
import { MedalIcon } from '@phosphor-icons/react/dist/csr/Medal';
import { ChatCircleDotsIcon } from '@phosphor-icons/react/dist/csr/ChatCircleDots';
import { SquaresFourIcon } from '@phosphor-icons/react/dist/csr/SquaresFour';
import { BookOpenIcon } from '@phosphor-icons/react/dist/csr/BookOpen';
import { ShieldCheckIcon } from '@phosphor-icons/react/dist/csr/ShieldCheck';
import { UserIcon } from '@phosphor-icons/react/dist/csr/User';
import classNames from 'classnames';
import { ANCHORS, ROUTES } from 'shared/configs/routes';
import { useUserStore } from 'shared/stores/StoreContext';
import mascot from 'assets/brand/mascot.svg';
import styles from './AccountShell.module.scss';

type NavigationItem = {
  to: string;
  label: string;
  icon: typeof HouseSimpleIcon;
  hash?: string;
};

const NAV_ITEMS: NavigationItem[] = [
  { to: ROUTES.HOME, label: 'Главная', icon: HouseSimpleIcon },
  { to: ANCHORS.ABOUT, label: 'Обо мне', icon: IdentificationCardIcon },
  { to: ROUTES.PROJECTS, label: 'Проекты', icon: StackSimpleIcon, hash: '#projects' },
  { to: ROUTES.ACHIEVEMENTS, label: 'Достижения', icon: MedalIcon, hash: '#achievements' },
  { to: ANCHORS.CONTACT, label: 'Связаться', icon: ChatCircleDotsIcon },
];

const LEGAL_ITEMS: NavigationItem[] = [
  { to: ROUTES.TERMS, label: 'Условия использования', icon: BookOpenIcon },
  { to: ROUTES.PRIVACY, label: 'Конфиденциальность', icon: ShieldCheckIcon },
];

type AccountShellProps = {
  children: ReactNode;
};

const AccountShell = observer(({ children }: AccountShellProps) => {
  const userStore = useUserStore();
  const { pathname, hash } = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const photoURL = userStore.currentUser?.photoURL;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const isActive = (to: string, sectionHash?: string) => {
    if (to.includes('#')) return pathname + hash === to;
    if (sectionHash && pathname === ROUTES.HOME && hash === sectionHash) return true;
    return pathname === to && (to !== ROUTES.HOME || !hash);
  };

  // Clicking the current destination should work even when the URL is unchanged.
  const handleCurrentLink = (event: MouseEvent<HTMLAnchorElement>, to: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (pathname + hash !== to) return;

    event.preventDefault();
    const id = to.split('#')[1];
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
    } else {
      contentRef.current?.scrollTo({ top: 0, left: 0, behavior });
    }
  };

  const navLink = (item: NavigationItem) => {
    const { to, label, icon: Icon } = item;
    const active = isActive(to, item.hash);
    return (
      <Tooltip
        key={to}
        label={label}
        position="right"
        offset={12}
        openDelay={180}
        withinPortal
        events={{ hover: true, focus: true, touch: false }}
        classNames={{ tooltip: styles.shell__tooltip }}
      >
        <Link
          to={to}
          aria-label={label}
          aria-current={active ? (to.includes('#') ? 'location' : 'page') : undefined}
          className={classNames(styles.shell__link, active && styles['shell__link--active'])}
          onClick={(event) => handleCurrentLink(event, to)}
        >
          <Icon size={19} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
        </Link>
      </Tooltip>
    );
  };

  return (
    <div className={styles.shell}>
      <div className={styles.shell__frame}>
        <aside className={styles.shell__sidebar} aria-label="Боковая панель">
          <Tooltip
            label="andkiv — на главную"
            position="right"
            offset={12}
            withinPortal
            events={{ hover: true, focus: true, touch: false }}
            classNames={{ tooltip: styles.shell__tooltip }}
          >
            <Link
              to={ROUTES.HOME}
              aria-label="andkiv — на главную"
              className={classNames(styles.shell__link, styles.shell__brand)}
              onClick={(event) => handleCurrentLink(event, ROUTES.HOME)}
            >
              <img src={mascot} width={25} height={25} alt="" />
            </Link>
          </Tooltip>

          <nav className={styles.shell__navigation} aria-label="Основная навигация">
            {NAV_ITEMS.map(navLink)}
            {userStore.isAdmin &&
              navLink({ to: ROUTES.ADMIN, label: 'Админ-панель', icon: SquaresFourIcon })}
          </nav>

          <div className={styles.shell__bottom}>
            <nav className={styles.shell__legal} aria-label="Правовая информация">
              {LEGAL_ITEMS.map(navLink)}
            </nav>
            <Tooltip
              label={userStore.currentUser?.displayName || 'Личный кабинет'}
              position="right"
              offset={12}
              withinPortal
              events={{ hover: true, focus: true, touch: false }}
              classNames={{ tooltip: styles.shell__tooltip }}
            >
              <Link
                to={ROUTES.PROFILE}
                aria-label="Аккаунт"
                aria-current={pathname === ROUTES.PROFILE ? 'page' : undefined}
                className={classNames(
                  styles.shell__link,
                  styles.shell__account,
                  pathname === ROUTES.PROFILE && styles['shell__link--active'],
                )}
                onClick={(event) => handleCurrentLink(event, ROUTES.PROFILE)}
              >
                <span className={styles.shell__avatar}>
                  {photoURL && photoURL !== failedAvatar ? (
                    <img
                      src={photoURL}
                      width={26}
                      height={26}
                      alt=""
                      referrerPolicy="no-referrer"
                      onError={() => setFailedAvatar(photoURL)}
                    />
                  ) : (
                    <UserIcon size={16} weight="bold" aria-hidden="true" />
                  )}
                </span>
              </Link>
            </Tooltip>
          </div>
        </aside>

        <div ref={contentRef} className={styles.shell__viewport} data-page-scroll tabIndex={-1}>
          {children}
        </div>
      </div>
    </div>
  );
});

export default AccountShell;
