import { ActionLink } from 'shared/ui/ActionButton';
import React, { useEffect, useState } from 'react';
import { ROUTES } from 'shared/configs/routes';
import Text from 'shared/ui/Text';
import styles from './ProfileForm.module.scss';

type ProfileSummaryProps = {
  displayName: string;
  email: string;
  photoURL: string;
  role?: string | null;
  createdDate?: string | null;
};

const getInitials = (displayName: string, email: string) =>
  (displayName || email || '?')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  displayName,
  email,
  photoURL,
  role,
  createdDate,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [photoURL]);

  const roleLabel = role === 'admin' ? 'Администратор' : 'Пользователь';
  const showImage = Boolean(photoURL) && !imageFailed;

  return (
    <aside className={styles.profile__summary} aria-label="Информация о пользователе">
      <div className={styles.profile__summaryGlow} aria-hidden="true" />

      <div className={styles.profile__avatarWrap}>
        {showImage ? (
          <img
            src={photoURL}
            alt={displayName || 'Фотография пользователя'}
            className={styles.profile__avatar}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Text tag="span" view="p-28" weight="medium" className={styles.profile__avatarFallback}>
            {getInitials(displayName, email)}
          </Text>
        )}
      </div>

      <div className={styles.profile__identity}>
        <Text tag="h2" view="p-24" weight="medium" className={styles.profile__name}>
          {displayName || 'Без имени'}
        </Text>
        <Text view="p-14" className={styles.profile__email}>
          {email}
        </Text>
      </div>

      <div className={styles.profile__role}>
        <Text tag="span" view="p-14" weight="medium">
          {roleLabel}
        </Text>
      </div>

      {createdDate && (
        <div className={styles.profile__metaRow}>
          <div>
            <Text view="p-14" className={styles.profile__metaLabel}>
              Аккаунт создан
            </Text>
            <Text view="p-16" weight="medium">
              {createdDate}
            </Text>
          </div>
        </div>
      )}

      {role === 'admin' && (
        <ActionLink
          variant="text"
          chevron
          href={ROUTES.ADMIN}
          className={styles.profile__adminLink}
        >
          <Text tag="span" view="p-14" weight="medium">
            Открыть админ-панель
          </Text>
        </ActionLink>
      )}
    </aside>
  );
};

export default ProfileSummary;
