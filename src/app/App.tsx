import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppRouter } from './router';
import Header from 'widgets/Header/ui/Header';
import Footer from 'widgets/Footer/ui/Footer';
import { ScrollToTop } from 'shared/ui/ScrollToTop';
import styles from './App.module.scss';
import { ROUTES } from 'shared/configs/routes';

export const App: React.FC = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith(ROUTES.ADMIN);

  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        <AppRouter />
      </>
    );
  }

  return (
    <div className={styles.app}>
      <ScrollToTop />
      <Header />
      <div className={styles.app__content}>
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
};
