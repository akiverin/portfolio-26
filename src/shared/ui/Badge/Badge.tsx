import React from 'react';
import styles from './Badge.module.scss';
import classNames from 'classnames';
import Text from 'shared/ui/Text';
import Article from 'shared/ui/icons/Article';
import Conference from 'shared/ui/icons/Conference';
import Citation from 'shared/ui/icons/Citation';
import Design from 'shared/ui/icons/Design';
import Team from 'shared/ui/icons/Team';
import Code from 'shared/ui/icons/Code';
import Trophy from 'shared/ui/icons/Trophy';
import Student from 'shared/ui/icons/Student';

export type ColorsBadgeT =
  | 'black'
  | 'purple'
  | 'green'
  | 'orange'
  | 'red'
  | 'blue'
  | 'yellow'
  | 'sky'
  | 'pink';

export type IconsBadgeT =
  | 'article'
  | 'conference'
  | 'citation'
  | 'design'
  | 'team'
  | 'trophy'
  | 'student'
  | 'code';

const ICONS: Record<IconsBadgeT, React.ReactNode> = {
  article: <Article height={14} width={14} className={styles.badge__icon} />,
  conference: <Conference height={14} width={14} className={styles.badge__icon} />,
  citation: <Citation height={14} width={14} className={styles.badge__icon} />,
  design: <Design height={14} width={14} className={styles.badge__icon} />,
  team: <Team height={14} width={14} className={styles.badge__icon} />,
  trophy: <Trophy height={14} width={14} className={styles.badge__icon} />,
  student: <Student height={14} width={14} className={styles.badge__icon} />,
  code: <Code height={14} width={14} className={styles.badge__icon} />,
};

export type BadgeProps = {
  className?: string;
  title: string;
  color?: ColorsBadgeT | null;
  icon?: IconsBadgeT | null;
};

const Badge: React.FC<BadgeProps> = ({ title, color = 'black', icon, className }) => {
  const badgeClasses = classNames(styles.badge, className, styles[`badge--c-${color}`]);

  return (
    <div className={badgeClasses}>
      {icon && ICONS[icon]}
      <Text weight="medium" view="p-14" noWrap className={styles.badge__title}>
        {title}
      </Text>
    </div>
  );
};

export default Badge;
