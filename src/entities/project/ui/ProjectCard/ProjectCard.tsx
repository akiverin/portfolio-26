import React from 'react';
import styles from './ProjectCard.module.scss';
import classNames from 'classnames';
import Image from 'next/image';
import { Project } from 'entities/Project/model/types';
import Text from 'shared/ui/Text';
import Button from 'shared/ui/Button';
import Github from 'shared/ui/icons/Github';
import Behance from 'shared/ui/icons/Behance';

export type ProjectCardProps = {
  project: Project;
  className?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  return (
    <div className={classNames(styles.projectCard, className)}>
      <div className={styles.projectCard__cover}>
        {project.coverType === 'image' ? (
          <Image
            src={project.cover}
            className={styles.projectCard__media}
            alt={`Project Cover for ${project.title}`}
            width={1600}
            height={900}
          />
        ) : (
          <video src={project.cover} className={styles.projectCard__media} autoPlay loop />
        )}
      </div>
      <div className={styles.projectCard__info}>
        <Text view="p-24" tag="h3" weight="medium">
          {project.title}
        </Text>
        <Text view="p-16" maxLines={2} color="secondary">
          {project.desc}
        </Text>
      </div>

      <div className={styles.projectCard__actions}>
        {project.behance && (
          <Button theme="dark" href={project.behance} target="_blank">
            <Behance height={20} width={20} />
            <Text view="p-16" weight="medium">
              Behance
            </Text>
          </Button>
        )}
        {project.github && (
          <Button
            theme="dark"
            className={styles.projectCard__github}
            href={project.github}
            target="_blank"
          >
            <Github width={20} height={20} />
            <Text view="p-16" weight="medium">
              Репозиторий
            </Text>
          </Button>
        )}
        {project.link && (
          <Button theme="accent" href={project.link} target="_blank">
            <Text view="p-16" weight="medium">
              Перейти
            </Text>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
