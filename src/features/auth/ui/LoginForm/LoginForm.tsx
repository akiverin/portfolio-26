'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import styles from './LoginForm.module.scss';
import Input from 'shared/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoginFormStore } from 'features/auth/model/LoginFormStore';
import Google from 'shared/ui/icons/Google';
import ArrowLeft from 'shared/ui/icons/ArrowLeft';
import { useUserStore } from 'shared/stores/StoreContext';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';

const LoginForm: React.FC = observer(() => {
  const form = useLocalStore(() => new LoginFormStore());
  const userStore = useUserStore();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'reset'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;

    try {
      await userStore.signIn(form.identifier, form.password);
      router.replace(ROUTES.HOME);
    } catch {
      // Error handled by store
    }
  };

  const handleGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userStore.signInWithGoogle();
      router.replace(ROUTES.HOME);
    } catch {
      // Error handled by store
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userStore.resetPassword(form.identifier);
      setMode('login');
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className={styles['auth-page']}>
      <div className={styles['auth-page__wrapper']}>
        {mode === 'reset' && (
          <button
            type="button"
            className={styles['auth-page__back']}
            onClick={() => setMode('login')}
            aria-label="Back to login"
          >
            <ArrowLeft color="primary" height={32} width={32} />
          </button>
        )}

        <form
          onSubmit={mode === 'login' ? handleLogin : handleReset}
          className={styles['auth-page__form']}
        >
          <div className={styles['auth-page__titles']}>
            <Text view="p-24" tag="h1" color="primary">
              {mode === 'login' ? 'Log in account' : 'Reset password'}
            </Text>
            {mode === 'login' ? (
              <Text view="p-14" color="secondary">
                If you don&apos;t have an account, please{' '}
                <Link href={ROUTES.REGISTER} className={styles['auth-page__link']}>
                  register
                </Link>
                .
              </Text>
            ) : (
              <Text view="p-14" color="secondary">
                Enter your email to receive a reset link.
              </Text>
            )}
          </div>

          <div className={styles['auth-page__form-group']}>
            <Text color="primary" tag="label" view="p-14" htmlFor="identifier">
              Email
            </Text>
            <Input
              id="identifier"
              type="text"
              value={form.identifier}
              onChange={(v) => form.setField('identifier', v)}
              placeholder="Enter your email"
            />
            {form.errors.identifier && (
              <Text view="p-14" color="accent">
                {form.errors.identifier}
              </Text>
            )}
          </div>

          {mode === 'login' && (
            <div className={styles['auth-page__form-group']}>
              <Text color="primary" tag="label" view="p-14" htmlFor="password">
                Password
              </Text>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(v) => form.setField('password', v)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          )}

          {userStore.meta === Meta.error && userStore.error && (
            <Text view="p-14" color="accent">
              {userStore.error}
            </Text>
          )}

          <div className={styles['auth-page__actions']}>
            {mode === 'login' && (
              <Button
                type="button"
                onClick={() => setMode('reset')}
                disabled={userStore.meta === Meta.loading}
              >
                <Text color="primary" view="p-16">
                  Reset password
                </Text>
              </Button>
            )}

            <Button
              type="submit"
              loading={userStore.meta === Meta.loading}
              className={styles['auth-page__submit']}
            >
              <Text color="primary" view="p-16">
                {mode === 'login' ? 'Log in' : 'Send reset link'}
              </Text>
            </Button>
          </div>

          {mode === 'login' && (
            <Button type="button" onClick={handleGoogle} className={styles['auth-page__google']}>
              <Google width={16} height={16} />
              <Text color="primary" view="p-16">
                Sign in with Google
              </Text>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
});

export default LoginForm;
