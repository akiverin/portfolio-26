import React, { useEffect, useState } from 'react';
import styles from './ProjectCard.module.scss';
import classNames from 'classnames';
import { Project } from 'entities/Project/model/types';
import Text from 'shared/ui/Text';
import Github from 'shared/ui/icons/Github';
import Behance from 'shared/ui/icons/Behance';
import { ImageWithFallback } from 'shared/ui/ImageWithFallback';
import { VideoWithFallback } from 'shared/ui/VideoWithFallback';
import { IconArrowUpRight, IconExternalLink } from '@tabler/icons-react';
import { getMediaUrl, isVideoMedia } from 'shared/lib/media';

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const year = project.date?.seconds
    ? new Date(project.date.seconds * 1000).getFullYear()
    : '—';
  const mediaUrl = getMediaUrl(project.cover, 'projects');
  const isVideo = isVideoMedia(project.cover, project.coverType);
  const [isPortraitImage, setIsPortraitImage] = useState(false);

  useEffect(() => {
    setIsPortraitImage(false);
  }, [mediaUrl]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalHeight, naturalWidth } = event.currentTarget;
    setIsPortraitImage(naturalHeight > naturalWidth);
  };

  return (
    <article className={classNames(styles.projectCard, className)}>
      <div
        className={classNames(styles.projectCard__cover, {
          [styles['projectCard__cover--portrait']]: !isVideo && isPortraitImage,
        })}
      >
        {!isVideo ? (
          <>
            {isPortraitImage && (
              <img
                src={mediaUrl}
                className={styles.projectCard__backdrop}
                alt=""
                aria-hidden="true"
              />
            )}
            <ImageWithFallback
              src={mediaUrl}
              className={styles.projectCard__media}
              alt={project.title}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={() => setIsPortraitImage(false)}
            />
          </>
        ) : (
          <VideoWithFallback
            src={mediaUrl}
            className={styles.projectCard__media}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        <div className={styles.projectCard__coverMeta}>
          <Text tag="span" view="p-12" weight="medium">
            {!isVideo ? 'Case study' : 'Motion project'}
          </Text>
        </div>
      </div>
      <div className={styles.projectCard__info}>
        <div className={styles.projectCard__heading}>
          <Text view="p-24" tag="h3" weight="medium">
            {project.title}
          </Text>
          <Text tag="span" view="p-12" className={styles.projectCard__year}>{year}</Text>
        </div>
        <Text view="p-14" maxLines={2} color="secondary">
          {project.desc}
        </Text>
      </div>

      <div className={styles.projectCard__actions}>
        {project.behance && (
          <a href={project.behance} target="_blank" rel="noopener noreferrer">
            <Behance height={16} width={16} />
            <Text tag="span" view="p-14" weight="medium">
              Behance
            </Text>
            <IconArrowUpRight size={15} stroke={1.6} />
          </a>
        )}
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github width={16} height={16} />
            <Text tag="span" view="p-14" weight="medium">
              GitHub
            </Text>
            <IconArrowUpRight size={15} stroke={1.6} />
          </a>
        )}
        {project.link && !project.disabled && (
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            <IconExternalLink size={16} stroke={1.6} />
            <Text tag="span" view="p-14" weight="medium">
              Открыть
            </Text>
            <IconArrowUpRight size={15} stroke={1.6} />
          </a>
        )}
        {project.disabled && (
          <Text tag="span" view="p-12" className={styles.projectCard__soon}>
            Скоро
          </Text>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
