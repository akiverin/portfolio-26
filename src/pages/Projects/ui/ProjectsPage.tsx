import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import Pagination from 'shared/ui/Pagination';
import { IconFolder, IconSearch, IconSparkles } from '@tabler/icons-react';

const PAGE_SIZE = 6;

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
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
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

  const pageCount = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const visibleProjects = useMemo(
    () => filteredAndSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredAndSorted, page],
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <main className={styles.page}>
      <FadeIn>
        <div className={styles.page__header}>
          <Text tag="span" view="p-12" className={styles.page__eyebrow}>
            <IconSparkles size={14} /> Selected work · Archive
          </Text>
          <Text tag="h1" view="title" weight="black" uppercase>
            Проекты
          </Text>
          <Text view="p-16" color="secondary">
            Шесть работ на странице — спокойно изучайте детали и выбирайте интересное.
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

        <div className={styles.page__grid} ref={gridRef}>
          {store.meta === Meta.error && (
            <div className={styles.page__empty} role="alert">
              <Text view="p-16" color="accent">
                Не удалось загрузить проекты. Попробуйте обновить страницу.
              </Text>
            </div>
          )}
          {isLoading &&
            Array.from({ length: PAGE_SIZE }, (_, i) => <ProjectCardSkeleton key={i} />)}

          {!isLoading &&
            filteredAndSorted.length > 0 &&
            visibleProjects.map((project, i) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
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

        {!isLoading && filteredAndSorted.length > 0 && (
          <div className={styles.page__paginationRow}>
            <Text tag="span" view="p-12" className={styles.page__resultCount}>
              <IconFolder size={15} stroke={1.5} /> {filteredAndSorted.length} работ
            </Text>
            <Pagination
              page={page}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              className={styles.page__pagination}
            />
          </div>
        )}
      </div>
    </main>
  );
});
