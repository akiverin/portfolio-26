import React from 'react';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { ROUTES } from 'shared/configs/routes';
import Text from 'shared/ui/Text';
import styles from './LegalPageLayout.module.scss';

type LegalPageLayoutProps = {
  title: string;
  date: string;
  children: React.ReactNode;
};

type LegalSectionProps = {
  title: string;
  children: React.ReactNode;
};

export const LegalSection: React.FC<LegalSectionProps> = ({ title, children }) => (
  <section className={styles.legal__section}>
    <Text tag="h2" view="p-20" weight="medium">
      {title}
    </Text>
    {children}
  </section>
);

export const LegalList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className={styles.legal__list}>{children}</ul>
);

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, date, children }) => (
  <main className={styles.legal}>
    <article className={styles.legal__container}>
      <header className={styles.legal__header}>
        <Link to={ROUTES.HOME} className={styles.legal__back}>
          <IconArrowLeft size={18} stroke={1.6} aria-hidden="true" />
          <Text tag="span" view="p-14" weight="medium">
            На главную
          </Text>
        </Link>
        <Text tag="h1" view="p-32" weight="medium" className={styles.legal__title}>
          {title}
        </Text>
        <Text view="p-14" className={styles.legal__date}>
          {date}
        </Text>
      </header>

      <div className={styles.legal__content}>{children}</div>
    </article>
  </main>
);

export default LegalPageLayout;
