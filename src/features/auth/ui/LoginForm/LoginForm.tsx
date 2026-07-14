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
import { useNotification } from 'shared/ui/Notifications';
import { IconCheck, IconEye, IconEyeOff, IconSparkles } from '@tabler/icons-react';

const LoginForm: React.FC = observer(() => {
  const form = useLocalStore(() => new LoginFormStore());
  const userStore = useUserStore();
  const navigate = useNavigate();
  const notify = useNotification();
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    try {
      await userStore.signIn(form.identifier, form.password);
      notify('Вы успешно вошли в аккаунт', 'success');
      navigate(ROUTES.PROFILE, { replace: true });
    } catch {
      notify('Ошибка авторизации. Проверьте данные.', 'error');
    }
  };

  const handleGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await userStore.signInWithGoogle();
      if (!user) return;
      notify('Вы успешно вошли через Google', 'success');
      navigate(ROUTES.PROFILE, { replace: true });
    } catch {
      notify('Ошибка входа через Google', 'error');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateIdentifier()) return;
    try {
      await userStore.resetPassword(form.identifier);
      notify('Ссылка для сброса пароля отправлена на email', 'success');
      setMode('login');
    } catch {
      notify('Ошибка при сбросе пароля', 'error');
    }
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__card}>
        <aside className={styles.auth__intro} aria-label="О портфолио">
          <div className={styles.auth__brand}>
            <span className={styles.auth__monogram}>AK</span>
            <Text view="p-14" weight="bold">
              Андрей Киверин
            </Text>
          </div>
          <div className={styles.auth__introContent}>
            <span className={styles.auth__eyebrow}>
              <IconSparkles size={15} aria-hidden="true" />
              Персональное пространство
            </span>
            <Text tag="h2" view="p-28" weight="bold" className={styles.auth__introTitle}>
              Проекты, достижения и профиль — в одном месте.
            </Text>
            <Text view="p-14" className={styles.auth__introText}>
              Войдите, чтобы управлять данными профиля и получить доступ к персональным функциям.
            </Text>
          </div>
          <ul className={styles.auth__benefits}>
            <li>
              <IconCheck size={16} aria-hidden="true" /> Безопасный вход через Firebase
            </li>
            <li>
              <IconCheck size={16} aria-hidden="true" /> Быстрый доступ через Google
            </li>
          </ul>
        </aside>

        <div className={styles.auth__panel}>
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
                type="email"
                value={form.identifier}
                onChange={(v) => form.setField('identifier', v)}
                placeholder="Введите email"
                autoComplete="email"
                autoFocus
                aria-invalid={Boolean(form.errors.identifier)}
                aria-describedby={form.errors.identifier ? 'identifier-error' : undefined}
              />
              {form.errors.identifier && (
                <Text id="identifier-error" view="p-12" color="accent" role="alert">
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
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(v) => form.setField('password', v)}
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                  aria-invalid={Boolean(form.errors.password)}
                  aria-describedby={form.errors.password ? 'password-error' : undefined}
                  afterSlot={
                    <button
                      type="button"
                      className={styles.auth__passwordToggle}
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                      {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  }
                />
                {form.errors.password && (
                  <Text id="password-error" view="p-12" color="accent" role="alert">
                    {form.errors.password}
                  </Text>
                )}
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
              <Button
                type="button"
                onClick={handleGoogle}
                loading={userStore.meta === Meta.loading}
              >
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
    </div>
  );
});

export default LoginForm;
