import React from 'react';
import styles from './AchievementCard.module.scss';
import classNames from 'classnames';
import { Achievement } from 'entities/Achievement/model/types';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import Badge, { ColorsBadgeT, IconsBadgeT } from 'shared/ui/Badge';
import { ImageWithFallback } from 'shared/ui/ImageWithFallback';

const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const formatAchievementDate = (date: { seconds: number }): string => {
  const d = new Date(date.seconds * 1000);
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`;
};

export type AchievementCardProps = {
  achievement: Achievement;
  className?: string;
  showDate?: boolean;
  fullDescription?: boolean;
};

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  className,
  showDate,
  fullDescription,
}) => {
  return (
    <div className={classNames(styles.achievementCard, className)}>
      <div className={styles.achievementCard__cover}>
        <ImageWithFallback
          src={`https://andkiv.com/assets/achievements/${achievement.cover}`}
          className={styles.achievementCard__image}
          alt={achievement.title}
          loading="lazy"
        />
      </div>
      {achievement.badges && (
        <div className={styles.achievementCard__badges}>
          {achievement.badges.map((badge) => (
            <Badge
              key={badge.id}
              icon={badge.icon as IconsBadgeT}
              title={badge.title}
              color={badge.color as ColorsBadgeT}
            />
          ))}
        </div>
      )}

      <div className={styles.achievementCard__info}>
        <Text view="p-16" maxLines={fullDescription ? undefined : 4} tag="h3" weight="medium">
          {achievement.title}
        </Text>
        <Text view="p-14" maxLines={fullDescription ? undefined : 4} color="secondary">
          {achievement.desc}
        </Text>
        {showDate && achievement.date && (
          <Text view="p-12" color="secondary" className={styles.achievementCard__date}>
            {formatAchievementDate(achievement.date)}
          </Text>
        )}
      </div>

      <div className={styles.achievementCard__actions}>
        {achievement.link && (
          <Button theme="accent" href={achievement.link} target="_blank">
            <Text view="p-16" weight="medium">
              Подробнее
            </Text>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
