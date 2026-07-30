import React from 'react';
import { IconLock } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'shared/configs/routes';
import Text from 'shared/ui/Text';
import styles from './AuthLayout.module.scss';

type AuthLayoutProps = {
  mode: 'login' | 'register';
  children: React.ReactNode;
};

const AUTH_COPY = {
  login: {
    title: 'Личный кабинет',
    description: 'Доступ к профилю и инструментам управления портфолио.',
  },
  register: {
    title: 'Новый аккаунт',
    description: 'Создайте учётную запись для персонального доступа.',
  },
} as const;

const AuthLayout: React.FC<AuthLayoutProps> = ({ mode, children }) => {
  const copy = AUTH_COPY[mode];

  return (
    <div className={styles.layout}>
      <section className={styles.layout__shell} aria-label={copy.title}>
        <aside className={styles.layout__sidebar}>
          <Link to={ROUTES.HOME} className={styles.layout__brand} aria-label="На главную">
            <span className={styles.layout__monogram} aria-hidden="true">
              AK
            </span>
            <Text view="p-16" weight="medium">
              Андрей Киверин
            </Text>
          </Link>

          <div className={styles.layout__intro}>
            <span className={styles.layout__status}>
              <span aria-hidden="true" />
              Защищённый доступ
            </span>
            <Text tag="h2" view="p-32" weight="medium" className={styles.layout__title}>
              {copy.title}
            </Text>
            <Text view="p-16" className={styles.layout__description}>
              {copy.description}
            </Text>
          </div>

          <div className={styles.layout__footer}>
            <nav className={styles.layout__switcher} aria-label="Авторизация">
              <Link
                to={ROUTES.AUTH}
                className={mode === 'login' ? styles['layout__switcherLink--active'] : undefined}
                aria-current={mode === 'login' ? 'page' : undefined}
              >
                <Text tag="span" view="p-14" weight="medium">
                  Вход
                </Text>
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className={mode === 'register' ? styles['layout__switcherLink--active'] : undefined}
                aria-current={mode === 'register' ? 'page' : undefined}
              >
                <Text tag="span" view="p-14" weight="medium">
                  Регистрация
                </Text>
              </Link>
            </nav>
            <Text tag="span" view="p-14" className={styles.layout__security}>
              <IconLock size={16} stroke={1.6} aria-hidden="true" />
              Данные защищены
            </Text>
          </div>
        </aside>

        <div className={styles.layout__panel}>{children}</div>
      </section>
    </div>
  );
};

export default AuthLayout;
