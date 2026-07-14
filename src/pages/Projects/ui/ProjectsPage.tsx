import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import styles from './ProjectsPage.module.scss';
import Text from 'shared/ui/Text';
import Select from 'shared/ui/Select';
import Input from 'shared/ui/Input';
import Skeleton from 'shared/ui/Skeleton';
import ProjectCard from 'entities/Project/ui/ProjectCard';
import { ProjectListStore } from 'entities/Project/stores/ProjectListStore';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { useDebounce } from 'shared/hooks/useDebounce';
import { Meta } from 'shared/lib/meta';
import FadeIn from 'shared/ui/FadeIn';
import { IconSearch } from '@tabler/icons-react';

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'title-asc', label: 'По названию А–Я' },
  { value: 'title-desc', label: 'По названию Я–А' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const ProjectCardSkeleton: React.FC = () => (
  <div className={styles.page__skeletonCard}>
    <Skeleton light borderRadius={12} className={styles.page__skeletonCover} />
    <div className={styles.page__skeletonInfo}>
      <Skeleton light width="55%" height={24} />
      <Skeleton light width="80%" height={16} />
    </div>
  </div>
);

export const ProjectsPage: React.FC = observer(() => {
  const store = useLocalStore(() => new ProjectListStore());
  const [sort, setSort] = useState('date-desc');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    store.fetchAllProjects();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;

  const filteredAndSorted = useMemo(() => {
    let items = [...store.projects];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q),
      );
    }

    const [field, direction] = sort.split('-');
    items.sort((a, b) => {
      if (field === 'title') {
        const cmp = a.title.localeCompare(b.title, 'ru');
        return direction === 'asc' ? cmp : -cmp;
      }
      const aTime = a.date?.seconds ?? 0;
      const bTime = b.date?.seconds ?? 0;
      return direction === 'asc' ? aTime - bTime : bTime - aTime;
    });

    return items;
  }, [store.projects, debouncedSearch, sort]);

  return (
    <main className={styles.page}>
      <FadeIn>
        <div className={styles.page__header}>
          <Text tag="h1" view="title" weight="black" uppercase>
            Проекты
          </Text>
          <Text view="p-16" color="secondary">
            Все мои проекты и работы
          </Text>
        </div>
      </FadeIn>

      <div className={styles.page__content}>
        <div className={styles.page__controls}>
          <div className={styles.page__search}>
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Поиск проектов..."
              aria-label="Поиск проектов"
              afterSlot={<IconSearch size={18} stroke={1.5} />}
            />
          </div>
          <Select
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
            className={styles.page__sort}
          />
        </div>

        <div className={styles.page__grid}>
          {store.meta === Meta.error && (
            <div className={styles.page__empty} role="alert">
              <Text view="p-16" color="accent">
                Не удалось загрузить проекты. Попробуйте обновить страницу.
              </Text>
            </div>
          )}
          {isLoading &&
            Array.from({ length: 4 }, (_, i) => <ProjectCardSkeleton key={i} />)}

          {!isLoading &&
            filteredAndSorted.length > 0 &&
            filteredAndSorted.map((project, i) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i % 3}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}

          {!isLoading && store.meta !== Meta.error && filteredAndSorted.length === 0 && (
            <div className={styles.page__empty}>
              <Text view="p-16" color="secondary">
                {search ? 'Ничего не найдено' : 'Проекты отсутствуют'}
              </Text>
            </div>
          )}
        </div>
      </div>
    </main>
  );
});
