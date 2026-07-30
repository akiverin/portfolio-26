import React, { useEffect, useState } from 'react';
import {
  IconArrowUpRight,
  IconCalendarEvent,
  IconCamera,
  IconShieldCheck,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
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
        <span className={styles.profile__avatarIcon} aria-hidden="true">
          <IconCamera size={16} stroke={1.6} />
        </span>
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
        <IconShieldCheck size={18} stroke={1.6} aria-hidden="true" />
        <Text tag="span" view="p-14" weight="medium">
          {roleLabel}
        </Text>
      </div>

      {createdDate && (
        <div className={styles.profile__metaRow}>
          <span className={styles.profile__metaIcon} aria-hidden="true">
            <IconCalendarEvent size={18} stroke={1.5} />
          </span>
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
        <Link to={ROUTES.ADMIN} className={styles.profile__adminLink}>
          <Text tag="span" view="p-14" weight="medium">
            Открыть админ-панель
          </Text>
          <IconArrowUpRight size={18} stroke={1.6} aria-hidden="true" />
        </Link>
      )}
    </aside>
  );
};

export default ProfileSummary;
