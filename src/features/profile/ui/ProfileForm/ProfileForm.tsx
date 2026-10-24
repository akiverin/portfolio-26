import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { IconCheck, IconRefresh, IconUserEdit } from '@tabler/icons-react';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import Input from 'shared/ui/Input';
import { useUserStore } from 'shared/stores/StoreContext';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';
import { ProfileFormStore } from 'features/profile/model/ProfileFormStore';
import ConfirmModal from 'features/admin/ui/ConfirmModal';
import { useNotification } from 'shared/ui/Notifications';
import AccountActions from './AccountActions';
import ProfileField from './ProfileField';
import ProfileSummary from './ProfileSummary';
import styles from './ProfileForm.module.scss';

const ProfileForm: React.FC = observer(() => {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const notify = useNotification();
  const form = useLocalStore(() => new ProfileFormStore());
  const populatedUserId = useRef<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const user = userStore.currentUser;

  useEffect(() => {
    if (userStore.isInitialized && !userStore.isAuth) {
      navigate(ROUTES.AUTH, { replace: true });
    }
  }, [userStore.isInitialized, userStore.isAuth, navigate]);

  useEffect(() => {
    if (user && populatedUserId.current !== user.id) {
      form.populateFromUser(user);
      populatedUserId.current = user.id;
    }
  }, [user, form]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.validateAll()) return;

    const patch = form.getPatch();
    if (Object.keys(patch).length === 0) return;

    form.setMeta(Meta.loading);
    try {
      await userStore.updateProfile(patch);
      form.commitChanges('Изменения сохранены');
      notify('Профиль обновлён', 'success');
    } catch {
      form.setMeta(Meta.error);
      notify('Не удалось обновить профиль', 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      await userStore.signOut();
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      notify('Не удалось завершить сеанс', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await userStore.deleteAccount();
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      setDeleting(false);
      setDeleteModalOpen(false);
      notify('Не удалось удалить аккаунт', 'error');
    }
  };

  if (!userStore.isInitialized) {
    return (
      <section className={styles.profile}>
        <div className={styles.profile__loading} role="status">
          <span className={styles.profile__spinner} aria-hidden="true" />
          <Text view="p-16" className={styles.profile__loadingText}>
            Загружаем профиль
          </Text>
        </div>
      </section>
    );
  }

  if (!user) return null;

  const createdDate = user.createdAt
    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <section className={styles.profile} aria-labelledby="profile-title">
      <div className={styles.profile__grid} aria-hidden="true" />
      <div className={styles.profile__container}>
        <header className={styles.profile__pageHeader}>
          <div>
            <Text tag="span" view="p-14" className={styles.profile__eyebrow}>
              Личный кабинет
            </Text>
            <Text id="profile-title" tag="h1" view="p-32" weight="medium">
              Профиль
            </Text>
          </div>
          <Text view="p-16" className={styles.profile__pageDescription}>
            Настройки личных данных и аккаунта.
          </Text>
        </header>

        <div className={styles.profile__layout}>
          <ProfileSummary
            displayName={form.displayName}
            email={form.email || user.email}
            photoURL={form.photoURL}
            role={user.role}
            createdDate={createdDate}
          />

          <div className={styles.profile__main}>
            <form onSubmit={handleSubmit} className={styles.profile__settingsCard}>
              <div className={styles.profile__cardHeader}>
                <span className={styles.profile__cardIcon} aria-hidden="true">
                  <IconUserEdit size={20} stroke={1.6} />
                </span>
                <div>
                  <Text tag="h2" view="p-20" weight="medium">
                    Данные профиля
                  </Text>
                  <Text view="p-14" className={styles.profile__cardDescription}>
                    Имя и фотография, видимые в аккаунте.
                  </Text>
                </div>
              </div>

              <div className={styles.profile__fields}>
                <ProfileField id="displayName" label="Имя" error={form.errors.displayName}>
                  <Input
                    id="displayName"
                    type="text"
                    value={form.displayName}
                    onChange={(value) => form.setField('displayName', value)}
                    placeholder="Введите имя"
                    autoComplete="name"
                  />
                </ProfileField>

                <ProfileField id="email" label="Email" helper="Email используется для входа">
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(value) => form.setField('email', value)}
                    placeholder="Введите email"
                    autoComplete="email"
                    disabled
                  />
                </ProfileField>

                <ProfileField
                  id="photoURL"
                  label="Ссылка на фотографию"
                  error={form.errors.photoURL}
                >
                  <Input
                    id="photoURL"
                    type="url"
                    value={form.photoURL}
                    onChange={(value) => form.setField('photoURL', value)}
                    placeholder="https://example.com/photo.jpg"
                    autoComplete="url"
                  />
                </ProfileField>
              </div>

              {form.successMessage && (
                <div className={styles.profile__success} role="status">
                  <IconCheck size={18} stroke={1.8} aria-hidden="true" />
                  <Text view="p-14" weight="medium">
                    {form.successMessage}
                  </Text>
                </div>
              )}

              {form.meta === Meta.error && userStore.error && (
                <Text view="p-14" color="accent" role="alert">
                  {userStore.error}
                </Text>
              )}

              <div className={styles.profile__formActions}>
                {form.isDirty && (
                  <button
                    type="button"
                    className={styles.profile__resetButton}
                    onClick={() => form.resetChanges()}
                  >
                    <IconRefresh size={17} stroke={1.6} aria-hidden="true" />
                    <Text tag="span" view="p-14" weight="medium">
                      Отменить изменения
                    </Text>
                  </button>
                )}
                <Button
                  type="submit"
                  theme="accent"
                  loading={form.meta === Meta.loading}
                  disabled={!form.isDirty}
                  className={styles.profile__saveButton}
                >
                  <Text view="p-14" weight="medium">
                    Сохранить
                  </Text>
                </Button>
              </div>
            </form>

            <AccountActions
              onSignOut={() => void handleSignOut()}
              onDelete={() => setDeleteModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Удаление аккаунта"
        message="Удалить аккаунт и связанные с ним данные? Это действие нельзя отменить."
        confirmLabel="Удалить аккаунт"
        loading={deleting}
        onConfirm={() => void handleDeleteAccount()}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </section>
  );
});

export default ProfileForm;
