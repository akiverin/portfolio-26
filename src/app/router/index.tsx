import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from 'shared/configs/routes';
import { HomePage } from 'pages/Home';
import Loader from 'shared/ui/Loader';
import styles from '../App.module.scss';

const AuthPage = lazy(() =>
  import('pages/Auth').then((m) => ({ default: m.AuthPage })),
);
const RegisterPage = lazy(() =>
  import('pages/Register').then((m) => ({ default: m.RegisterPage })),
);
const ProfilePage = lazy(() =>
  import('pages/Profile').then((m) => ({ default: m.ProfilePage })),
);
const AdminPage = lazy(() =>
  import('pages/Admin').then((m) => ({ default: m.AdminPage })),
);
const TermsPage = lazy(() =>
  import('pages/Terms').then((m) => ({ default: m.TermsPage })),
);
const PrivacyPage = lazy(() =>
  import('pages/Privacy').then((m) => ({ default: m.PrivacyPage })),
);
const AchievementsPage = lazy(() =>
  import('pages/Achievements').then((m) => ({ default: m.AchievementsPage })),
);
const ProjectsPage = lazy(() =>
  import('pages/Projects').then((m) => ({ default: m.ProjectsPage })),
);
const NotFoundPage = lazy(() =>
  import('pages/NotFound').then((m) => ({ default: m.NotFoundPage })),
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.app__routeLoader} role="status" aria-label="Загрузка страницы">
          <Loader size="m" />
        </div>
      }
    >
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.AUTH} element={<AuthPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.ADMIN} element={<AdminPage />} />
        <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
        <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
