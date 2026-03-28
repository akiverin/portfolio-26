import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from 'shared/configs/routes';
import { HomePage } from 'pages/Home';

const AuthPage = lazy(() =>
  import('pages/Auth').then((m) => ({ default: m.AuthPage })),
);
const RegisterPage = lazy(() =>
  import('pages/Register').then((m) => ({ default: m.RegisterPage })),
);
const ProfilePage = lazy(() =>
  import('pages/Profile').then((m) => ({ default: m.ProfilePage })),
);
const TermsPage = lazy(() =>
  import('pages/Terms').then((m) => ({ default: m.TermsPage })),
);
const PrivacyPage = lazy(() =>
  import('pages/Privacy').then((m) => ({ default: m.PrivacyPage })),
);
const NotFoundPage = lazy(() =>
  import('pages/NotFound').then((m) => ({ default: m.NotFoundPage })),
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.AUTH} element={<AuthPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
