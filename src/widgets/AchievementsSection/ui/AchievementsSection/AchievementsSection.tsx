import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  IconArrowUpRight,
  IconAward,
  IconEye,
  IconEyeOff,
  IconRosetteDiscountCheck,
} from '@tabler/icons-react';
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
  hidden: { opacity: 0, y: 38, rotateX: 7, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
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
        <div className={styles.achievements__background} aria-hidden="true">
          <div className={styles.achievements__radar} />
        </div>

        <motion.header
          className={styles.achievements__header}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className={styles.achievements__heading}>
            <Text tag="span" view="p-14" className={styles.achievements__eyebrow}>
              <IconRosetteDiscountCheck size={15} stroke={1.6} /> 03 · Recognition
            </Text>
            <Text tag="h2" view="title" weight="black" uppercase>
              Достижения
            </Text>
          </div>

          <div className={styles.achievements__intro}>
            <Text tag="p" view="p-16">
              Награды, публикации и профессиональные результаты — коротко и по существу.
            </Text>
            <button
              type="button"
              className={styles.achievements__dateToggle}
              onClick={() => setShowDates((value) => !value)}
              aria-pressed={showDates}
            >
              {showDates ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              <Text tag="span" view="p-12" weight="medium">
                {showDates ? 'Скрыть даты' : 'Показать даты'}
              </Text>
            </button>
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
              <IconAward size={28} stroke={1.3} />
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
              <IconAward size={28} stroke={1.3} />
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
            <div className={styles.achievements__footerNote}>
              <span className={styles.achievements__pulse} />
              <Text tag="span" view="p-12">
                Архив обновляется
              </Text>
            </div>
            <Link to={ROUTES.ACHIEVEMENTS} className={styles.achievements__allLink}>
              Все достижения
              <IconArrowUpRight size={18} stroke={1.7} />
            </Link>
          </motion.footer>
        )}
      </div>
    </section>
  );
});

export default AchievementsSection;
