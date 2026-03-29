import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import styles from './LoginForm.module.scss';
import Input from 'shared/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'reset'>('login');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    try {
      await userStore.signIn(form.identifier, form.password);
      navigate(ROUTES.PROFILE, { replace: true });
    } catch {
      /* handled by store */
    }
  };

  const handleGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userStore.signInWithGoogle();
      navigate(ROUTES.PROFILE, { replace: true });
    } catch {
      /* handled by store */
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userStore.resetPassword(form.identifier);
      setMode('login');
    } catch {
      /* handled by store */
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
            <ArrowLeft height={20} width={20} />
          </button>
        )}

        <form
          onSubmit={mode === 'login' ? handleLogin : handleReset}
          className={styles.auth__form}
        >
          <div className={styles.auth__header}>
            <Text view="p-28" tag="h1" weight="bold">
              {mode === 'login' ? 'Добро пожаловать' : 'Сброс пароля'}
            </Text>
            {mode === 'login' ? (
              <Text view="p-14" color="secondary">
                Нет аккаунта?{' '}
                <Link to={ROUTES.REGISTER} className={styles.auth__link}>
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
              <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="identifier">
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
                <Text view="p-12" color="accent">
                  {form.errors.identifier}
                </Text>
              )}
            </div>

            {mode === 'login' && (
              <div className={styles.auth__field}>
                <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="password">
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
            <Text view="p-12" color="accent">
              {userStore.error}
            </Text>
          )}

          <div className={styles.auth__actions}>
            <Button type="submit" theme="accent" loading={userStore.meta === Meta.loading}>
              <Text view="p-16" weight="medium">
                {mode === 'login' ? 'Войти' : 'Отправить ссылку'}
              </Text>
            </Button>

            {mode === 'login' && (
              <button
                type="button"
                className={styles.auth__textBtn}
                onClick={() => setMode('reset')}
                disabled={userStore.meta === Meta.loading}
              >
                <Text view="p-12" color="secondary">
                  Забыли пароль?
                </Text>
              </button>
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
                <Text view="p-14">Войти через Google</Text>
              </Button>
            </>
          )}

          <div className={styles.auth__legal}>
            <Link to={ROUTES.PRIVACY} className={styles.auth__link}>
              <Text view="p-10" color="secondary">
                Политика конфиденциальности
              </Text>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
});

export default LoginForm;
