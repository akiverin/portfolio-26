import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import Input from 'shared/ui/Input';
import { useUserStore } from 'shared/stores/StoreContext';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';
import { ProfileFormStore } from 'features/profile/model/ProfileFormStore';
import ConfirmModal from 'features/admin/ui/ConfirmModal';
import styles from './ProfileForm.module.scss';

const ProfileForm: React.FC = observer(() => {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const form = useLocalStore(() => new ProfileFormStore());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (userStore.isInitialized && !userStore.isAuth) {
      navigate(ROUTES.AUTH, { replace: true });
    }
  }, [userStore.isInitialized, userStore.isAuth, navigate]);

  useEffect(() => {
    if (userStore.currentUser) {
      form.populateFromUser(userStore.currentUser);
    }
  }, [userStore.currentUser, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateAll()) return;

    const patch = form.getPatch();
    if (Object.keys(patch).length === 0) return;

    form.setMeta(Meta.loading);
    try {
      await userStore.updateProfile(patch);
      form.setSuccessMessage('Данные успешно обновлены');
      form.setMeta(Meta.success);
    } catch {
      form.setMeta(Meta.error);
    }
  };

  const handleSignOut = async () => {
    await userStore.signOut();
    navigate(ROUTES.HOME, { replace: true });
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await userStore.deleteAccount();
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (!userStore.isInitialized) {
    return (
      <div className={styles.profile}>
        <div className={styles.profile__card}>
          <Text view="p-16" color="secondary">
            Загрузка...
          </Text>
        </div>
      </div>
    );
  }

  const user = userStore.currentUser;
  if (!user) return null;

  const initials = (user.displayName || user.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  const createdDate = user.createdAt
    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className={styles.profile}>
      <div className={styles.profile__card}>
        <form onSubmit={handleSubmit} className={styles.profile__form}>
          <div className={styles.profile__header}>
            <Text view="p-32" tag="h1" weight="bold">
              Профиль
            </Text>
            <Text view="p-16" color="secondary">
              Управляйте своими данными
            </Text>
          </div>

          <div className={styles.profile__avatarSection}>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className={styles.profile__avatar}
              />
            ) : (
              <div className={styles.profile__avatarPlaceholder}>{initials}</div>
            )}
            <div className={styles.profile__avatarInfo}>
              <Text view="p-16" weight="bold">
                {user.displayName}
              </Text>
              <Text view="p-14" color="secondary">
                {user.email}
              </Text>
            </div>
          </div>

          <div className={styles.profile__divider} />

          <div className={styles.profile__fields}>
            <div className={styles.profile__field}>
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

            <div className={styles.profile__field}>
              <Text tag="label" view="p-14" weight="medium" htmlFor="email">
                Email
              </Text>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(v) => form.setField('email', v)}
                placeholder="Введите email"
                disabled
              />
              <Text view="p-12" color="secondary">
                Email нельзя изменить
              </Text>
            </div>

            <div className={styles.profile__field}>
              <Text tag="label" view="p-14" weight="medium" htmlFor="photoURL">
                Ссылка на фото
              </Text>
              <Input
                id="photoURL"
                type="url"
                value={form.photoURL}
                onChange={(v) => form.setField('photoURL', v)}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          {form.successMessage && (
            <div className={styles.profile__success}>
              <Text view="p-14" weight="medium">
                {form.successMessage}
              </Text>
            </div>
          )}

          {userStore.meta === Meta.error && userStore.error && (
            <Text view="p-14" color="accent">
              {userStore.error}
            </Text>
          )}

          <div className={styles.profile__actions}>
            <Button
              type="submit"
              theme="accent"
              loading={form.meta === Meta.loading}
              disabled={!form.isDirty}
            >
              <Text view="p-16" weight="medium">
                Сохранить
              </Text>
            </Button>
          </div>

          <div className={styles.profile__divider} />

          {createdDate && (
            <div className={styles.profile__meta}>
              <Text view="p-12" color="secondary">
                Аккаунт создан: {createdDate}
              </Text>
              {user.role && (
                <Text view="p-12" color="secondary">
                  Роль: {user.role}
                </Text>
              )}
            </div>
          )}

          <div className={styles.profile__dangerZone}>
            <Button type="button" onClick={handleSignOut}>
              <Text view="p-16" weight="medium">
                Выйти из аккаунта
              </Text>
            </Button>
            <button
              type="button"
              className={styles.profile__deleteBtn}
              onClick={() => setDeleteModalOpen(true)}
            >
              <IconTrash size={16} stroke={1.5} />
              Удалить аккаунт
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Удаление аккаунта"
        message="Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо — все данные будут безвозвратно утеряны."
        confirmLabel="Удалить аккаунт"
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
});

export default ProfileForm;
