import React from 'react';
import styles from './AchievementCard.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import { Achievement } from 'entities/Achievement/model/types';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import Badge, { ColorsBadgeT, IconsBadgeT } from 'shared/ui/Badge';

export type AchievementCardProps = {
  achievement: Achievement;
  className?: string;
};

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, className }) => {
  return (
    <div className={classNames(styles.achievementCard, className)}>
      <div className={styles.achievementCard__cover}>
        <Image
          src={achievement.cover}
          className={styles.achievementCard__image}
          alt={`Achievement Cover for ${achievement.title}`}
          width={1600}
          height={900}
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
        <Text view="p-16" maxLines={4} tag="h3" weight="medium">
          {achievement.title}
        </Text>
        <Text view="p-14" maxLines={4} color="secondary">
          {achievement.desc}
        </Text>
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
