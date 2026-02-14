'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import styles from './RegisterForm.module.scss';
import Input from 'shared/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RegisterFormStore } from 'features/auth/model/RegisterFormStore';
import Google from 'shared/ui/icons/Google';
import { useUserStore } from 'shared/stores/StoreContext';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';

const RegisterForm: React.FC = observer(() => {
  const form = useLocalStore(() => new RegisterFormStore());
  const router = useRouter();
  const userStore = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;
    try {
      await userStore.signUp(form.email, form.password, form.displayName);
      router.replace(ROUTES.HOME);
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className={styles['registration-page']}>
      <div className={styles['registration-page__wrapper']}>
        <form onSubmit={handleSubmit} className={styles['registration-page__form']}>
          <div className={styles['registration-page__titles']}>
            <Text view="p-24" tag="h1" color="primary">
              Registration account
            </Text>
            <Text view="p-14" color="secondary">
              If you have an account, please{' '}
              <Link href={ROUTES.AUTH} className={styles['registration-page__link']}>
                login
              </Link>
              .
            </Text>
          </div>

          <div className={styles['registration-page__form-group']}>
            <Text color="primary" tag="label" view="p-14" htmlFor="displayName">
              Name
            </Text>
            <Input
              id="displayName"
              type="text"
              value={form.displayName}
              onChange={(v) => form.setField('displayName', v)}
              placeholder="Enter your name"
            />
            {form.errors.displayName && (
              <Text view="p-14" color="accent">
                {form.errors.displayName}
              </Text>
            )}
          </div>
          <div className={styles['registration-page__form-group']}>
            <Text color="primary" tag="label" view="p-14" htmlFor="email">
              Email
            </Text>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(v) => form.setField('email', v)}
              placeholder="Enter your email"
            />
            {form.errors.email && (
              <Text view="p-14" color="accent">
                {form.errors.email}
              </Text>
            )}
          </div>
          <div className={styles['registration-page__form-group']}>
            <Text color="primary" tag="label" view="p-14" htmlFor="password">
              Password
            </Text>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(v) => form.setField('password', v)}
              placeholder="Enter your password"
            />
            {form.errors.password && (
              <Text view="p-14" color="accent">
                {form.errors.password}
              </Text>
            )}
          </div>
          {userStore.meta === Meta.error && (
            <Text view="p-14" color="accent">
              {userStore.error}
            </Text>
          )}
          <Button type="submit" loading={userStore.meta === Meta.loading}>
            <Text color="primary" view="p-16">
              Register
            </Text>
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              userStore.signInWithGoogle();
            }}
            loading={userStore.meta === Meta.loading}
          >
            <Google width={16} height={16} />
            <Text color="primary" view="p-16">
              Sign up with Google
            </Text>
          </Button>
        </form>
      </div>
    </div>
  );
});

export default RegisterForm;
