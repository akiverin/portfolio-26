import ActionButton, { ActionLink } from 'shared/ui/ActionButton';
import React, { useEffect, useState } from 'react';
import styles from './ProjectCard.module.scss';
import classNames from 'classnames';
import { Project } from 'entities/Project/model/types';
import Text from 'shared/ui/Text';
import { ImageWithFallback } from 'shared/ui/ImageWithFallback';
import { VideoWithFallback } from 'shared/ui/VideoWithFallback';
import { IconZoomIn } from '@tabler/icons-react';
import { getImageFit, getMediaUrl, ImageFit, isVideoMedia } from 'shared/lib/media';
import MediaLightbox from 'shared/ui/MediaLightbox';

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const year = project.date?.seconds ? new Date(project.date.seconds * 1000).getFullYear() : '—';
  const mediaUrl = getMediaUrl(project.cover, 'projects');
  const isVideo = isVideoMedia(project.cover, project.coverType);
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
    <article className={classNames(styles.projectCard, className)}>
      <div
        className={classNames(styles.projectCard__cover, {
          [styles['projectCard__cover--framed']]: !isVideo && imageFit,
          [styles['projectCard__cover--portrait']]: !isVideo && imageFit === 'portrait',
          [styles['projectCard__cover--landscape']]: !isVideo && imageFit === 'landscape',
        })}
      >
        {!isVideo ? (
          <>
            <ImageWithFallback
              src={mediaUrl}
              className={styles.projectCard__media}
              alt={project.title}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={() => setImageFit(null)}
            />
            <ActionButton
              variant="icon"
              surface="dark"
              size="sm"
              type="button"
              className={styles.projectCard__inspect}
              onClick={() => setIsLightboxOpen(true)}
              aria-label={`Открыть изображение проекта «${project.title}»`}
            >
              <IconZoomIn size={22} stroke={1.6} />
            </ActionButton>
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
      </div>
      {!isVideo && (
        <MediaLightbox
          isOpen={isLightboxOpen}
          src={mediaUrl}
          alt={project.title}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
      <div className={styles.projectCard__info}>
        <div className={styles.projectCard__heading}>
          <Text view="p-24" tag="h3" weight="bold" maxLines={2}>
            {project.title}
          </Text>
          <Text tag="span" view="p-12" className={styles.projectCard__year}>
            {year}
          </Text>
        </div>
        <Text view="p-14" maxLines={2} color="secondary">
          {project.desc}
        </Text>
      </div>

      <div className={styles.projectCard__actions}>
        {project.link && !project.disabled && (
          <ActionLink href={project.link} variant="primary" size="sm" target="_blank">
            Смотреть проект
          </ActionLink>
        )}
        {project.github && (
          <ActionLink href={project.github} variant="text" size="sm" chevron target="_blank">
            GitHub
          </ActionLink>
        )}
        {project.behance && (
          <ActionLink href={project.behance} variant="text" size="sm" chevron target="_blank">
            Behance
          </ActionLink>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
