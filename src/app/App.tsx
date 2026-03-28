import React from 'react';
import { AppRouter } from './router';
import Header from 'widgets/Header/ui/Header';
import Footer from 'widgets/Footer/ui/Footer';
import styles from './App.module.scss';

export const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.app__content}>
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
};
