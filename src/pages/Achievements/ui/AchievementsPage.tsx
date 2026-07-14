import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import styles from './AchievementsPage.module.scss';
import Text from 'shared/ui/Text';
import Select from 'shared/ui/Select';
import Input from 'shared/ui/Input';
import Skeleton from 'shared/ui/Skeleton';
import AchievementCard from 'entities/Achievement/ui/AchievementCard';
import { AchievementListStore, SORT_OPTIONS } from 'entities/Achievement/stores/AchievementListStore';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { useDebounce } from 'shared/hooks/useDebounce';
import { Meta } from 'shared/lib/meta';
import FadeIn from 'shared/ui/FadeIn';
import { AnimatedCheckbox } from 'shared/ui/AnimatedCheckbox';
import { IconSearch } from '@tabler/icons-react';

const SKELETON_COUNT = 10;

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const AchievementCardSkeleton: React.FC = () => (
  <div className={styles.page__skeletonCard}>
    <Skeleton light borderRadius={12} className={styles.page__skeletonCover} />
    <div className={styles.page__skeletonInfo}>
      <Skeleton light width="70%" height={16} />
      <Skeleton light width="90%" height={14} />
    </div>
  </div>
);

export const AchievementsPage: React.FC = observer(() => {
  const store = useLocalStore(() => new AchievementListStore({ pageSize: 100 }));
  const [showDates, setShowDates] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    store.fetchAchievements();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return store.achievements;
    const q = debouncedSearch.toLowerCase();
    return store.achievements.filter(
      (a) => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q),
    );
  }, [store.achievements, debouncedSearch]);

  return (
    <main className={styles.page}>
      <FadeIn>
        <div className={styles.page__header}>
          <Text tag="h1" view="title" weight="black" uppercase>
            Достижения
          </Text>
          <Text view="p-16" color="secondary">
            Все мои достижения и награды
          </Text>
        </div>
      </FadeIn>

      <div className={styles.page__content}>
        <div className={styles.page__controls}>
          <div className={styles.page__search}>
            <Input
              value={search}
              onChange={setSearch}
              placeholder="Поиск достижений..."
              aria-label="Поиск достижений"
              afterSlot={<IconSearch size={18} stroke={1.5} />}
            />
          </div>
          <AnimatedCheckbox
            checked={showDates}
            onChange={setShowDates}
            label={
              <Text view="p-14" weight="medium">
                Показывать дату
              </Text>
            }
          />
          <Select
            value={store.sortValue}
            options={SORT_OPTIONS}
            onChange={(v) => store.setSortValue(v)}
            className={styles.page__sort}
          />
        </div>

        <div className={styles.page__grid}>
          {store.meta === Meta.error && (
            <div className={styles.page__empty} role="alert">
              <Text view="p-16" color="accent">
                Не удалось загрузить достижения. Попробуйте обновить страницу.
              </Text>
            </div>
          )}
          {isLoading &&
            Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <AchievementCardSkeleton key={i} />
            ))}

          {!isLoading &&
            filtered.length > 0 &&
            filtered.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i % 3}
              >
                <AchievementCard achievement={achievement} showDate={showDates} fullDescription />
              </motion.div>
            ))}

          {!isLoading && store.meta !== Meta.error && filtered.length === 0 && (
            <div className={styles.page__empty}>
              <Text view="p-16" color="secondary">
                {search ? 'Ничего не найдено' : 'Достижения отсутствуют'}
              </Text>
            </div>
          )}
        </div>
      </div>
    </main>
  );
});
