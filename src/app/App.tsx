import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { AppRouter } from './router';
import Header from 'widgets/Header/ui/Header';
import Footer from 'widgets/Footer/ui/Footer';
import AccountShell from 'widgets/AccountShell';
import { ScrollToTop } from 'shared/ui/ScrollToTop';
import styles from './App.module.scss';
import { ROUTES } from 'shared/configs/routes';
import { usePageSeo } from 'shared/hooks/usePageSeo';
import { useUserStore } from 'shared/stores/StoreContext';
import StartupLoader from 'shared/ui/StartupLoader';

export const App: React.FC = observer(() => {
  const userStore = useUserStore();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith(ROUTES.ADMIN);
  const isAuth = pathname === ROUTES.AUTH || pathname === ROUTES.REGISTER;
  usePageSeo(pathname);

  if (userStore.isRestoringSession) return <StartupLoader />;
  if (pathname === ROUTES.BUTTON_LAB) {
    return (
      <>
        <ScrollToTop />
        <AppRouter />
      </>
    );
  }
  if (userStore.isAuth && isAuth) return <Navigate to={ROUTES.PROFILE} replace />;

  if (userStore.isAuth && !isAuth) {
    return (
      <AccountShell>
        <ScrollToTop />
        <div className={styles.app__content}>
          <AppRouter />
        </div>
        {!isAdmin && <Footer />}
      </AccountShell>
    );
  }

  if (isAdmin || isAuth) {
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
});
