import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import styles from '../AuthLayout/AuthForm.module.scss';
import Input from 'shared/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterFormStore } from 'features/auth/model/RegisterFormStore';
import Google from 'shared/ui/icons/Google';
import { useUserStore } from 'shared/stores/StoreContext';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';
import { useNotification } from 'shared/ui/Notifications';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import AuthLayout from '../AuthLayout';

const RegisterForm: React.FC = observer(() => {
  const form = useLocalStore(() => new RegisterFormStore());
  const navigate = useNavigate();
  const userStore = useUserStore();
  const notify = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    try {
      await userStore.signUp(form.email, form.password, form.displayName);
      notify('Аккаунт успешно создан', 'success');
      navigate(ROUTES.PROFILE, { replace: true });
    } catch {
      notify('Ошибка при регистрации', 'error');
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

  return (
    <AuthLayout mode="register">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <Text view="p-28" tag="h1" weight="medium" className={styles.title}>
            Создать аккаунт
          </Text>
          <Text view="p-14" color="secondary">
            Уже есть аккаунт?{' '}
            <Link to={ROUTES.AUTH} className={styles.link}>
              Войдите
            </Link>
          </Text>
        </div>

        <div className={styles.fields}>
          <div className={styles.field}>
            <Text tag="label" view="p-14" weight="medium" color="secondary" htmlFor="displayName">
              Имя
            </Text>
            <Input
              id="displayName"
              type="text"
              value={form.displayName}
              onChange={(v) => form.setField('displayName', v)}
              placeholder="Введите имя"
              autoComplete="name"
              autoFocus
              aria-invalid={Boolean(form.errors.displayName)}
              aria-describedby={form.errors.displayName ? 'display-name-error' : undefined}
            />
            {form.errors.displayName && (
              <Text id="display-name-error" view="p-14" color="accent" role="alert">
                {form.errors.displayName}
              </Text>
            )}
          </div>

          <div className={styles.field}>
            <Text tag="label" view="p-14" weight="medium" color="secondary" htmlFor="email">
              Email
            </Text>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(v) => form.setField('email', v)}
              placeholder="Введите email"
              autoComplete="email"
              aria-invalid={Boolean(form.errors.email)}
              aria-describedby={form.errors.email ? 'register-email-error' : undefined}
            />
            {form.errors.email && (
              <Text id="register-email-error" view="p-14" color="accent" role="alert">
                {form.errors.email}
              </Text>
            )}
          </div>

          <div className={styles.field}>
            <Text tag="label" view="p-14" weight="medium" color="secondary" htmlFor="password">
              Пароль
            </Text>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(v) => form.setField('password', v)}
              placeholder="Минимум 6 символов"
              autoComplete="new-password"
              aria-invalid={Boolean(form.errors.password)}
              aria-describedby={form.errors.password ? 'register-password-error' : undefined}
              afterSlot={
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              }
            />
            {form.errors.password && (
              <Text id="register-password-error" view="p-14" color="accent" role="alert">
                {form.errors.password}
              </Text>
            )}
          </div>
        </div>

        <label className={styles.terms}>
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(e) => form.setTermsAccepted(e.target.checked)}
            className={styles.checkbox}
            aria-invalid={Boolean(form.errors.terms)}
            aria-describedby={form.errors.terms ? 'terms-error' : undefined}
          />
          <Text view="p-14" color="secondary">
            Я принимаю{' '}
            <Link to={ROUTES.TERMS} className={styles.link} target="_blank">
              пользовательское соглашение
            </Link>{' '}
            и даю согласие на{' '}
            <Link to={ROUTES.PRIVACY} className={styles.link} target="_blank">
              обработку персональных данных
            </Link>
          </Text>
        </label>
        {form.errors.terms && (
          <Text id="terms-error" view="p-14" color="accent" role="alert">
            {form.errors.terms}
          </Text>
        )}

        {userStore.meta === Meta.error && (
          <Text view="p-14" color="accent">
            {userStore.error}
          </Text>
        )}

        <Button type="submit" theme="accent" loading={userStore.meta === Meta.loading}>
          <Text view="p-16" weight="medium">
            Зарегистрироваться
          </Text>
        </Button>

        <div className={styles.divider}>
          <span />
          <Text view="p-14" color="secondary">
            или
          </Text>
          <span />
        </div>

        <Button
          type="button"
          onClick={handleGoogle}
          loading={userStore.meta === Meta.loading}
          className={styles.providerButton}
        >
          <Google width={16} height={16} />
          <Text view="p-14">Войти через Google</Text>
        </Button>
      </form>
    </AuthLayout>
  );
});

export default RegisterForm;
