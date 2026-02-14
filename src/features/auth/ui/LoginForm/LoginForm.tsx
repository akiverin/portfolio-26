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
    <div className={styles.auth}>
      <div className={styles.auth__card}>
        {mode === 'reset' && (
          <button
            type="button"
            className={styles.auth__back}
            onClick={() => setMode('login')}
            aria-label="Назад"
          >
            <ArrowLeft color="primary" height={28} width={28} />
          </button>
        )}

        <form
          onSubmit={mode === 'login' ? handleLogin : handleReset}
          className={styles.auth__form}
        >
          <div className={styles.auth__header}>
            <Text view="p-24" tag="h1" weight="bold" color="primary">
              {mode === 'login' ? 'Вход в аккаунт' : 'Сброс пароля'}
            </Text>
            {mode === 'login' ? (
              <Text view="p-14" color="secondary">
                Нет аккаунта?{' '}
                <Link href={ROUTES.REGISTER} className={styles.auth__link}>
                  Зарегистрируйтесь
                </Link>
              </Text>
            ) : (
              <Text view="p-14" color="secondary">
                Введите email для получения ссылки на сброс пароля.
              </Text>
            )}
          </div>

          <div className={styles.auth__fields}>
            <div className={styles.auth__field}>
              <Text color="primary" tag="label" view="p-14" htmlFor="identifier">
                Email
              </Text>
              <Input
                id="identifier"
                type="text"
                value={form.identifier}
                onChange={(v) => form.setField('identifier', v)}
                placeholder="Введите email"
              />
              {form.errors.identifier && (
                <Text view="p-14" color="accent">
                  {form.errors.identifier}
                </Text>
              )}
            </div>

            {mode === 'login' && (
              <div className={styles.auth__field}>
                <Text color="primary" tag="label" view="p-14" htmlFor="password">
                  Пароль
                </Text>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(v) => form.setField('password', v)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                />
              </div>
            )}
          </div>

          {userStore.meta === Meta.error && userStore.error && (
            <Text view="p-14" color="accent">
              {userStore.error}
            </Text>
          )}

          <div className={styles.auth__actions}>
            <Button
              type="submit"
              theme="accent"
              loading={userStore.meta === Meta.loading}
            >
              <Text view="p-16" weight="medium">
                {mode === 'login' ? 'Войти' : 'Отправить ссылку'}
              </Text>
            </Button>

            {mode === 'login' && (
              <Button
                type="button"
                onClick={() => setMode('reset')}
                disabled={userStore.meta === Meta.loading}
              >
                <Text color="primary" view="p-14">
                  Забыли пароль?
                </Text>
              </Button>
            )}
          </div>

          {mode === 'login' && (
            <>
              <div className={styles.auth__divider}>
                <span />
                <Text view="p-12" color="secondary">
                  или
                </Text>
                <span />
              </div>
              <Button type="button" onClick={handleGoogle}>
                <Google width={16} height={16} />
                <Text color="primary" view="p-16">
                  Войти через Google
                </Text>
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
});

export default LoginForm;
