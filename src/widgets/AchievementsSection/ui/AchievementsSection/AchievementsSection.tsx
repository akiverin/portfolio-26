import { AnimatedCheckbox } from 'shared/ui/AnimatedCheckbox';
import { ActionLink } from 'shared/ui/ActionButton';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import styles from './AchievementsSection.module.scss';
import Text from 'shared/ui/Text';
import { AchievementListStore } from 'entities/Achievement/stores/AchievementListStore';
import AchievementCard from 'entities/Achievement/ui/AchievementCard';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import Skeleton from 'shared/ui/Skeleton';
import { Meta } from 'shared/lib/meta';
import { ROUTES } from 'shared/configs/routes';

const DISPLAY_COUNT = 6;

const AchievementCardSkeleton: React.FC = () => (
  <div className={styles.achievements__skeletonCard}>
    <Skeleton light borderRadius={16} className={styles.achievements__skeletonCover} />
    <div className={styles.achievements__skeletonInfo}>
      <Skeleton light width="72%" height={18} />
      <Skeleton light width="92%" height={14} />
    </div>
  </div>
);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 38, rotateX: 7 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring' as const, damping: 24, stiffness: 110 },
  },
};

const AchievementsSection: React.FC = observer(() => {
  const store = useLocalStore(() => new AchievementListStore({ pageSize: DISPLAY_COUNT }));
  const [showDates, setShowDates] = useState(false);

  useEffect(() => {
    store.fetchAchievements();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;

  return (
    <section className={styles.achievements} id="achievements">
      <div className={styles.achievements__shell}>
        <motion.header
          className={styles.achievements__header}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className={styles.achievements__heading}>
            <Text tag="h2" view="title" weight="black" uppercase>
              Достижения
            </Text>
          </div>

          <div className={styles.achievements__intro}>
            <AnimatedCheckbox checked={showDates} onChange={setShowDates} label="Показывать даты" />
          </div>
        </motion.header>

        <motion.div
          className={styles.achievements__list}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {store.meta === Meta.error && (
            <div className={styles.achievements__empty} role="alert">
              <Text view="p-14">Не удалось загрузить достижения</Text>
            </div>
          )}

          {isLoading &&
            Array.from({ length: DISPLAY_COUNT }, (_, index) => (
              <AchievementCardSkeleton key={index} />
            ))}

          {!isLoading &&
            store.achievements.slice(0, DISPLAY_COUNT).map((achievement) => (
              <motion.div key={achievement.id} variants={cardVariants}>
                <AchievementCard achievement={achievement} showDate={showDates} />
              </motion.div>
            ))}

          {!isLoading && store.meta !== Meta.error && store.achievements.length === 0 && (
            <div className={styles.achievements__empty}>
              <Text view="p-14">Достижения скоро появятся</Text>
            </div>
          )}
        </motion.div>

        {!isLoading && store.meta !== Meta.error && (
          <motion.footer
            className={styles.achievements__footer}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ActionLink
              variant="text"
              chevron
              href={ROUTES.ACHIEVEMENTS}
              className={styles.achievements__allLink}
            >
              Все достижения
            </ActionLink>
          </motion.footer>
        )}
      </div>
    </section>
  );
});

export default AchievementsSection;
