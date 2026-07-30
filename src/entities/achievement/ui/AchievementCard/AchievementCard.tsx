import React, { useEffect, useState } from 'react';
import styles from './AchievementCard.module.scss';
import classNames from 'classnames';
import { Achievement } from 'entities/Achievement/model/types';
import Text from 'shared/ui/Text';
import Badge, { ColorsBadgeT, IconsBadgeT } from 'shared/ui/Badge';
import { ImageWithFallback } from 'shared/ui/ImageWithFallback';
import { IconArrowUpRight, IconCalendarEvent } from '@tabler/icons-react';
import { VideoWithFallback } from 'shared/ui/VideoWithFallback';
import { getMediaUrl, isVideoMedia } from 'shared/lib/media';

const MONTHS_RU = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
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
  const mediaUrl = getMediaUrl(achievement.cover, 'achievements');
  const isVideo = isVideoMedia(achievement.cover, achievement.coverType);
  const [isPortraitImage, setIsPortraitImage] = useState(false);

  useEffect(() => {
    setIsPortraitImage(false);
  }, [mediaUrl]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalHeight, naturalWidth } = event.currentTarget;
    setIsPortraitImage(naturalHeight > naturalWidth);
  };

  return (
    <article className={classNames(styles.achievementCard, className)}>
      <div
        className={classNames(styles.achievementCard__cover, {
          [styles['achievementCard__cover--portrait']]: !isVideo && isPortraitImage,
        })}
      >
        {isVideo ? (
          <VideoWithFallback
            src={mediaUrl}
            className={styles.achievementCard__image}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <>
            {isPortraitImage && (
              <img
                src={mediaUrl}
                className={styles.achievementCard__backdrop}
                alt=""
                aria-hidden="true"
              />
            )}
            <ImageWithFallback
              src={mediaUrl}
              className={styles.achievementCard__image}
              alt={achievement.title}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={() => setIsPortraitImage(false)}
            />
          </>
        )}
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
        <Text view="p-18" maxLines={fullDescription ? undefined : 3} tag="h3" weight="medium">
          {achievement.title}
        </Text>
        <Text view="p-14" maxLines={fullDescription ? undefined : 3} color="secondary">
          {achievement.desc}
        </Text>
        {showDate && achievement.date && (
          <Text tag="span" view="p-12" className={styles.achievementCard__date}>
            <IconCalendarEvent size={14} stroke={1.5} />
            {formatAchievementDate(achievement.date)}
          </Text>
        )}
      </div>

      <div className={styles.achievementCard__actions}>
        {achievement.link && (
          <a href={achievement.link} target="_blank" rel="noopener noreferrer">
            <Text tag="span" view="p-12" weight="medium">
              О достижении
            </Text>
            <IconArrowUpRight size={17} stroke={1.6} />
          </a>
        )}
      </div>
    </article>
  );
};

export default AchievementCard;
