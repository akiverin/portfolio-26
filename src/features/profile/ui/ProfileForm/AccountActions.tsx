import ActionButton from 'shared/ui/ActionButton';
import React from 'react';
import Text from 'shared/ui/Text';
import styles from './ProfileForm.module.scss';

type AccountActionsProps = {
  onSignOut: () => void;
  onDelete: () => void;
};

const AccountActions: React.FC<AccountActionsProps> = ({ onSignOut, onDelete }) => (
  <section className={styles.profile__accountCard} aria-labelledby="account-actions-title">
    <div className={styles.profile__cardHeader}>
      <div>
        <Text id="account-actions-title" tag="h2" view="p-20" weight="medium">
          Управление аккаунтом
        </Text>
      </div>
    </div>

    <div className={styles.profile__accountActions}>
      <ActionButton
        variant="secondary"
        size="sm"
        type="button"
        className={styles.profile__logoutButton}
        onClick={onSignOut}
      >
        <Text tag="span" view="p-14" weight="medium">
          Выйти
        </Text>
      </ActionButton>
      <ActionButton
        variant="secondary"
        size="sm"
        tone="danger"
        type="button"
        className={styles.profile__deleteButton}
        onClick={onDelete}
      >
        <Text tag="span" view="p-14" weight="medium">
          Удалить аккаунт
        </Text>
      </ActionButton>
    </div>
  </section>
);

export default AccountActions;
