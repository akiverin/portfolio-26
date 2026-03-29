import React from 'react';
import { motion } from 'framer-motion';
import {
  IconUsers,
  IconFolder,
  IconTrophy,
  IconWallet,
  IconStack2,
  IconMail,
  IconAward,
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconHome,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import classNames from 'classnames';
import styles from './AdminSidebar.module.scss';
import { Link } from 'react-router-dom';
import { ROUTES } from 'shared/configs/routes';

const ICONS: Record<string, React.FC<{ size?: number; stroke?: number }>> = {
  users: IconUsers,
  folder: IconFolder,
  trophy: IconTrophy,
  wallet: IconWallet,
  stack: IconStack2,
  mail: IconMail,
  badge: IconAward,
};

type SidebarItem = {
  key: string;
  label: string;
  icon: string;
};

type AdminSidebarProps = {
  items: SidebarItem[];
  active: string;
  collapsed: boolean;
  onSelect: (key: string) => void;
  onToggle: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  items,
  active,
  collapsed,
  onSelect,
  onToggle,
  onLogout,
  darkMode,
  onToggleTheme,
}) => {
  const themeToggleLabel = darkMode ? 'Светлая тема' : 'Тёмная тема';

  return (
    <motion.aside
      className={classNames(styles.sidebar, collapsed && styles['sidebar--collapsed'])}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className={styles.sidebar__header}>
        {!collapsed && (
          <motion.span
            className={styles.sidebar__logo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Админ
          </motion.span>
        )}
        <button
          type="button"
          className={styles.sidebar__toggle}
          onClick={onToggle}
          aria-label={collapsed ? 'Развернуть' : 'Свернуть'}
        >
          {collapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
        </button>
      </div>

      <nav className={styles.sidebar__nav}>
        {items.map((item) => {
          const Icon = ICONS[item.icon] || IconFolder;
          return (
            <button
              key={item.key}
              type="button"
              className={classNames(
                styles.sidebar__item,
                active === item.key && styles['sidebar__item--active'],
              )}
              onClick={() => onSelect(item.key)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} stroke={1.5} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  transition={{ delay: 0.05 }}
                  className={styles.sidebar__label}
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      <div className={styles.sidebar__footer}>
        <button
          type="button"
          className={styles.sidebar__item}
          onClick={onToggleTheme}
          title={collapsed ? themeToggleLabel : undefined}
          aria-label={themeToggleLabel}
        >
          {darkMode ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
          {!collapsed && <span className={styles.sidebar__label}>{themeToggleLabel}</span>}
        </button>
        <Link
          to={ROUTES.HOME}
          className={styles.sidebar__item}
          title={collapsed ? 'На сайт' : undefined}
        >
          <IconHome size={20} stroke={1.5} />
          {!collapsed && <span className={styles.sidebar__label}>На сайт</span>}
        </Link>
        <button
          type="button"
          className={classNames(styles.sidebar__item, styles['sidebar__item--danger'])}
          onClick={onLogout}
          title={collapsed ? 'Выйти' : undefined}
        >
          <IconLogout size={20} stroke={1.5} />
          {!collapsed && <span className={styles.sidebar__label}>Выйти</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
