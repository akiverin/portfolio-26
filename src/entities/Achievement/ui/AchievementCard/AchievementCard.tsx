import ActionButton, { ActionLink } from 'shared/ui/ActionButton';
import React, { useEffect, useState } from 'react';
import styles from './AchievementCard.module.scss';
import classNames from 'classnames';
import { Achievement } from 'entities/Achievement/model/types';
import Text from 'shared/ui/Text';
import { ImageWithFallback } from 'shared/ui/ImageWithFallback';
import { IconZoomIn } from '@tabler/icons-react';
import { VideoWithFallback } from 'shared/ui/VideoWithFallback';
import { getImageFit, getMediaUrl, ImageFit, isVideoMedia } from 'shared/lib/media';
import MediaLightbox from 'shared/ui/MediaLightbox';

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
  const [imageFit, setImageFit] = useState<ImageFit>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setImageFit(null);
  }, [mediaUrl]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalHeight, naturalWidth } = event.currentTarget;
    setImageFit(getImageFit(naturalWidth, naturalHeight));
  };

  return (
    <article className={classNames(styles.achievementCard, className)}>
      <div
        className={classNames(styles.achievementCard__cover, {
          [styles['achievementCard__cover--framed']]: !isVideo && imageFit,
          [styles['achievementCard__cover--portrait']]: !isVideo && imageFit === 'portrait',
          [styles['achievementCard__cover--landscape']]: !isVideo && imageFit === 'landscape',
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
            <ImageWithFallback
              src={mediaUrl}
              className={styles.achievementCard__image}
              alt={achievement.title}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={() => setImageFit(null)}
            />
            <ActionButton
              variant="icon"
              surface="dark"
              size="sm"
              type="button"
              className={styles.achievementCard__inspect}
              onClick={() => setIsLightboxOpen(true)}
              aria-label={`Открыть изображение достижения «${achievement.title}»`}
            >
              <IconZoomIn size={22} stroke={1.6} />
            </ActionButton>
          </>
        )}
      </div>
      {!isVideo && (
        <MediaLightbox
          isOpen={isLightboxOpen}
          src={mediaUrl}
          alt={achievement.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
      <div className={styles.achievementCard__info}>
        {achievement.badges && achievement.badges.length > 0 && (
          <div className={styles.achievementCard__badges}>
            {achievement.badges.map((badge) => (
              <span key={badge.id}>{badge.title}</span>
            ))}
          </div>
        )}
        <Text view="p-24" maxLines={fullDescription ? undefined : 3} tag="h3" weight="bold">
          {achievement.title}
        </Text>
        <Text view="p-14" maxLines={fullDescription ? undefined : 3} color="secondary">
          {achievement.desc}
        </Text>
        {showDate && achievement.date && (
          <Text tag="span" view="p-12" className={styles.achievementCard__date}>
            {formatAchievementDate(achievement.date)}
          </Text>
        )}
      </div>

      <div className={styles.achievementCard__actions}>
        {achievement.link && (
          <ActionLink href={achievement.link} variant="text" size="sm" chevron target="_blank">
            Подробнее
          </ActionLink>
        )}
      </div>
    </article>
  );
};

export default AchievementCard;
