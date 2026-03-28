import React from 'react';
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

const RegisterForm: React.FC = observer(() => {
  const form = useLocalStore(() => new RegisterFormStore());
  const navigate = useNavigate();
  const userStore = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    try {
      await userStore.signUp(form.email, form.password, form.displayName);
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className={styles.register}>
      <div className={styles.register__card}>
        <form onSubmit={handleSubmit} className={styles.register__form}>
          <div className={styles.register__header}>
            <Text view="title" tag="h1" weight="black" uppercase>
              Регистрация
            </Text>
            <Text view="p-16" color="secondary">
              Уже есть аккаунт?{' '}
              <Link to={ROUTES.AUTH} className={styles.register__link}>
                Войдите
              </Link>
            </Text>
          </div>

          <div className={styles.register__fields}>
            <div className={styles.register__field}>
              <Text tag="label" view="p-14" weight="medium" htmlFor="displayName">
                Имя
              </Text>
              <Input
                id="displayName"
                type="text"
                value={form.displayName}
                onChange={(v) => form.setField('displayName', v)}
                placeholder="Введите имя"
              />
              {form.errors.displayName && (
                <Text view="p-14" color="accent">
                  {form.errors.displayName}
                </Text>
              )}
            </div>

            <div className={styles.register__field}>
              <Text tag="label" view="p-14" weight="medium" htmlFor="email">
                Email
              </Text>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(v) => form.setField('email', v)}
                placeholder="Введите email"
              />
              {form.errors.email && (
                <Text view="p-14" color="accent">
                  {form.errors.email}
                </Text>
              )}
            </div>

            <div className={styles.register__field}>
              <Text tag="label" view="p-14" weight="medium" htmlFor="password">
                Пароль
              </Text>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(v) => form.setField('password', v)}
                placeholder="Введите пароль"
              />
              {form.errors.password && (
                <Text view="p-14" color="accent">
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
            <Text view="p-14" color="accent">
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

          <div className={styles.register__divider}>
            <span />
            <Text view="p-12" color="secondary">
              или
            </Text>
            <span />
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              userStore.signInWithGoogle();
            }}
            loading={userStore.meta === Meta.loading}
          >
            <Google width={16} height={16} />
            <Text view="p-16">Войти через Google</Text>
          </Button>
        </form>
      </div>
    </div>
  );
});

export default RegisterForm;
