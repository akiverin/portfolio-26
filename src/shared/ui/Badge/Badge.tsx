import type { FC } from 'react';
import classNames from 'classnames';
import styles from './Badge.module.scss';

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
  | 'code'
  | 'medal'
  | 'star'
  | 'flame'
  | 'lightning'
  | 'diamond'
  | 'heart'
  | 'crown'
  | 'govScience'
  | 'polytech'
  | 'moscow'
  | 'alfa';

export type BadgeProps = {
  className?: string;
  title: string;
  color?: ColorsBadgeT | null;
  icon?: IconsBadgeT | null;
};

/** Category text carries the meaning without decorative symbols. */
const Badge: FC<BadgeProps> = ({ title, className }) => (
  <span className={classNames(styles.badge, className)}>{title}</span>
);
export default Badge;
