import React from 'react';
import { IconLogout, IconShieldLock, IconTrash } from '@tabler/icons-react';
import Text from 'shared/ui/Text';
import styles from './ProfileForm.module.scss';

type AccountActionsProps = {
  onSignOut: () => void;
  onDelete: () => void;
};

const AccountActions: React.FC<AccountActionsProps> = ({ onSignOut, onDelete }) => (
  <section className={styles.profile__accountCard} aria-labelledby="account-actions-title">
    <div className={styles.profile__cardHeader}>
      <span className={styles.profile__cardIcon} aria-hidden="true">
        <IconShieldLock size={20} stroke={1.6} />
      </span>
      <div>
        <Text id="account-actions-title" tag="h2" view="p-20" weight="medium">
          Управление аккаунтом
        </Text>
        <Text view="p-14" className={styles.profile__cardDescription}>
          Управление текущим сеансом и данными аккаунта.
        </Text>
      </div>
    </div>

    <div className={styles.profile__accountActions}>
      <button type="button" className={styles.profile__logoutButton} onClick={onSignOut}>
        <IconLogout size={18} stroke={1.6} aria-hidden="true" />
        <Text tag="span" view="p-14" weight="medium">
          Выйти
        </Text>
      </button>
      <button type="button" className={styles.profile__deleteButton} onClick={onDelete}>
        <IconTrash size={18} stroke={1.6} aria-hidden="true" />
        <Text tag="span" view="p-14" weight="medium">
          Удалить аккаунт
        </Text>
      </button>
    </div>
  </section>
);

export default AccountActions;
