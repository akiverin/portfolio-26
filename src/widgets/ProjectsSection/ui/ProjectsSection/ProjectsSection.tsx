import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IconArrowUpRight, IconCode, IconSparkles } from '@tabler/icons-react';
import styles from './ProjectsSection.module.scss';
import Text from 'shared/ui/Text';
import { ProjectListStore } from 'entities/Project/stores/ProjectListStore';
import ProjectCard from 'entities/Project/ui/ProjectCard';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';
import Skeleton from 'shared/ui/Skeleton';
import { ROUTES } from 'shared/configs/routes';

const DISPLAY_COUNT = 6;

const ProjectCardSkeleton: React.FC = () => (
  <div className={styles.projects__skeletonCard}>
    <Skeleton light borderRadius={16} className={styles.projects__skeletonCover} />
    <div className={styles.projects__skeletonInfo}>
      <Skeleton light width="58%" height={24} />
      <Skeleton light width="88%" height={14} />
    </div>
  </div>
);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.97, filter: 'blur(7px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      damping: 24,
      stiffness: 105,
    },
  },
};

const ProjectsSection: React.FC = observer(() => {
  const store = useLocalStore(() => new ProjectListStore());

  useEffect(() => {
    store.fetchAllProjects();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;
  const latestProjects = useMemo(() => store.projects.slice(0, DISPLAY_COUNT), [store.projects]);

  return (
    <section className={styles.projects} id="projects">
      <div className={styles.projects__shell}>
        <div className={styles.projects__background} aria-hidden="true">
          <div className={styles.projects__glow} />
          <div className={styles.projects__gridPattern} />
        </div>

        <motion.header
          className={styles.projects__header}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className={styles.projects__heading}>
            <Text tag="span" view="p-14" className={styles.projects__eyebrow}>
              <IconSparkles size={14} stroke={1.6} /> 02 · Selected work
            </Text>
            <Text tag="h2" view="title" weight="black" uppercase>
              Проекты
            </Text>
          </div>
          <div className={styles.projects__intro}>
            <Text tag="p" view="p-16">
              От продуктовой логики до последнего пикселя — проекты, где дизайн работает вместе с
              кодом.
            </Text>
          </div>
        </motion.header>

        <motion.div
          className={styles.projects__list}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {store.meta === Meta.error && (
            <div className={styles.projects__empty} role="alert">
              <IconCode size={28} stroke={1.3} />
              <Text view="p-14">Не удалось загрузить проекты</Text>
            </div>
          )}

          {isLoading &&
            Array.from({ length: DISPLAY_COUNT }, (_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}

          {!isLoading &&
            latestProjects.map((project) => (
              <motion.div key={project.id} variants={cardVariants}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
        </motion.div>

        {!isLoading && store.meta !== Meta.error && (
          <motion.div
            className={styles.projects__footer}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Text tag="span" view="p-12">
              {store.projects.length} работ в коллекции
            </Text>
            <Link to={ROUTES.PROJECTS} className={styles.projects__allLink}>
              Все проекты
              <IconArrowUpRight size={18} stroke={1.7} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
});

export default ProjectsSection;
