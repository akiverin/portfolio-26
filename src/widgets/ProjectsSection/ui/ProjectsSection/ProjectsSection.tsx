'use client';

import { observer } from 'mobx-react-lite';
import styles from './ProjectsSection.module.scss';
import Text from 'shared/ui/Text';
import { ProjectListStore } from 'entities/Project/stores/ProjectListStore';
import { useEffect } from 'react';
import ProjectCard from 'entities/Project/ui/ProjectCard';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';
import Skeleton from 'shared/ui/Skeleton';

const SKELETON_COUNT = 4;

const ProjectCardSkeleton: React.FC = () => (
  <div className={styles.projects__skeletonCard}>
    <Skeleton light borderRadius={12} className={styles.projects__skeletonCover} />
    <div className={styles.projects__skeletonInfo}>
      <Skeleton light width="55%" height={24} />
      <Skeleton light width="80%" height={16} />
    </div>
  </div>
);

const ProjectsSection: React.FC = observer(() => {
  const store = useLocalStore(() => new ProjectListStore());

  useEffect(() => {
    store.fetchAllProjects();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;

  return (
    <section className={styles.projects} id="projects">
      <div className={styles.projects__info}>
        <Text
          font="caveat"
          view="p-24"
          weight="medium"
          color="secondary"
          className={styles.projects__desc}
        >
          с 2021 по сей день
        </Text>
        <Text tag="h2" view="title" weight="black" uppercase>
          Последние <br />
          проекты
        </Text>
        <DotLottieReact
          className={styles.projects__decorate}
          src="https://lottie.host/c9b6b0f9-6f25-4988-bf22-68c0dd970e57/BEvlo1T9Ft.lottie"
          autoplay
        />
      </div>
      <div className={styles.projects__list}>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => <ProjectCardSkeleton key={i} />)
          : store.projects.map((project) => <ProjectCard project={project} key={project.id} />)}
      </div>
    </section>
  );
});

export default ProjectsSection;
