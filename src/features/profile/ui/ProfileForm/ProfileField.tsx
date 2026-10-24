import React from 'react';
import Text from 'shared/ui/Text';
import styles from './ProfileForm.module.scss';

type ProfileFieldProps = {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
};

const ProfileField: React.FC<ProfileFieldProps> = ({ id, label, helper, error, children }) => (
  <div className={styles.profile__field}>
    <Text tag="label" view="p-14" weight="medium" htmlFor={id}>
      {label}
    </Text>
    {children}
    {error ? (
      <Text view="p-14" color="accent" role="alert">
        {error}
      </Text>
    ) : (
      helper && (
        <Text view="p-14" className={styles.profile__helper}>
          {helper}
        </Text>
      )
    )}
  </div>
);

export default ProfileField;
