import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import styles from './RegisterForm.module.scss';
import Input from 'shared/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterFormStore } from 'features/auth/model/RegisterFormStore';
import Google from 'shared/ui/icons/Google';
import { useUserStore } from 'shared/stores/StoreContext';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';
import { useNotification } from 'shared/ui/Notifications';
import { IconCheck, IconEye, IconEyeOff, IconSparkles } from '@tabler/icons-react';

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
    <div className={styles.register}>
      <div className={styles.register__card}>
        <aside className={styles.register__intro} aria-label="О регистрации">
          <div className={styles.register__brand}>
            <span className={styles.register__monogram}>AK</span>
            <Text view="p-14" weight="bold">
              Андрей Киверин
            </Text>
          </div>
          <div className={styles.register__introContent}>
            <span className={styles.register__eyebrow}>
              <IconSparkles size={15} aria-hidden="true" />
              Начните за минуту
            </span>
            <Text tag="h2" view="p-28" weight="bold" className={styles.register__introTitle}>
              Создайте своё персональное пространство.
            </Text>
            <Text view="p-14" className={styles.register__introText}>
              Один аккаунт для управления профилем и доступа к новым возможностям портфолио.
            </Text>
          </div>
          <ul className={styles.register__benefits}>
            <li>
              <IconCheck size={16} aria-hidden="true" /> Простая регистрация
            </li>
            <li>
              <IconCheck size={16} aria-hidden="true" /> Защита персональных данных
            </li>
          </ul>
        </aside>

        <div className={styles.register__panel}>
          <form onSubmit={handleSubmit} className={styles.register__form}>
          <div className={styles.register__header}>
            <Text view="p-28" tag="h1" weight="bold">
              Создать аккаунт
            </Text>
            <Text view="p-14" color="secondary">
              Уже есть аккаунт?{' '}
              <Link to={ROUTES.AUTH} className={styles.register__link}>
                Войдите
              </Link>
            </Text>
          </div>

          <div className={styles.register__fields}>
            <div className={styles.register__field}>
              <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="displayName">
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
                <Text id="display-name-error" view="p-12" color="accent" role="alert">
                  {form.errors.displayName}
                </Text>
              )}
            </div>

            <div className={styles.register__field}>
              <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="email">
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
                <Text id="register-email-error" view="p-12" color="accent" role="alert">
                  {form.errors.email}
                </Text>
              )}
            </div>

            <div className={styles.register__field}>
              <Text tag="label" view="p-12" weight="medium" color="secondary" htmlFor="password">
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
                    className={styles.register__passwordToggle}
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                }
              />
              {form.errors.password && (
                <Text id="register-password-error" view="p-12" color="accent" role="alert">
                  {form.errors.password}
                </Text>
              )}
            </div>
          </div>

          <label className={styles.register__terms}>
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => form.setTermsAccepted(e.target.checked)}
              className={styles.register__checkbox}
              aria-invalid={Boolean(form.errors.terms)}
              aria-describedby={form.errors.terms ? 'terms-error' : undefined}
            />
            <Text view="p-12" color="secondary">
              Я принимаю{' '}
              <Link to={ROUTES.TERMS} className={styles.register__link} target="_blank">
                пользовательское соглашение
              </Link>{' '}
              и даю согласие на{' '}
              <Link to={ROUTES.PRIVACY} className={styles.register__link} target="_blank">
                обработку персональных данных
              </Link>
            </Text>
          </label>
          {form.errors.terms && (
            <Text id="terms-error" view="p-12" color="accent" role="alert">
              {form.errors.terms}
            </Text>
          )}

          {userStore.meta === Meta.error && (
            <Text view="p-12" color="accent">
              {userStore.error}
            </Text>
          )}

          <Button type="submit" theme="accent" loading={userStore.meta === Meta.loading}>
            <Text view="p-16" weight="medium">
              Зарегистрироваться
            </Text>
          </Button>

          <div className={styles.register__divider}>
            <span />
            <Text view="p-12" color="secondary">
              или
            </Text>
            <span />
          </div>

          <Button type="button" onClick={handleGoogle} loading={userStore.meta === Meta.loading}>
            <Google width={16} height={16} />
            <Text view="p-14">Войти через Google</Text>
          </Button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default RegisterForm;
