import React, { useEffect, useState } from 'react';
import styles from './ProjectCard.module.scss';
import classNames from 'classnames';
import { Project } from 'entities/Project/model/types';
import Text from 'shared/ui/Text';
import Github from 'shared/ui/icons/Github';
import Behance from 'shared/ui/icons/Behance';
import { ImageWithFallback } from 'shared/ui/ImageWithFallback';
import { VideoWithFallback } from 'shared/ui/VideoWithFallback';
import { IconArrowUpRight, IconExternalLink, IconZoomIn } from '@tabler/icons-react';
import { getImageFit, getMediaUrl, ImageFit, isVideoMedia } from 'shared/lib/media';
import MediaLightbox from 'shared/ui/MediaLightbox';

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
            {imageFit && (
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
              onError={() => setImageFit(null)}
            />
            <button
              type="button"
              className={styles.projectCard__inspect}
              onClick={() => setIsLightboxOpen(true)}
              aria-label={`Открыть изображение проекта «${project.title}»`}
            >
              <IconZoomIn size={22} stroke={1.6} />
            </button>
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
