import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import styles from './AchievementsSection.module.scss';
import Text from 'shared/ui/Text';
import { useEffect, useState } from 'react';
import {
  AchievementListStore,
} from 'entities/Achievement/stores/AchievementListStore';
import AchievementCard from 'entities/Achievement/ui/AchievementCard';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import Skeleton from 'shared/ui/Skeleton';
import { Meta } from 'shared/lib/meta';
import FadeIn from 'shared/ui/FadeIn';
import Button from 'shared/ui/Button';
import { AnimatedCheckbox } from 'shared/ui/AnimatedCheckbox';
import { ROUTES } from 'shared/configs/routes';

const DISPLAY_COUNT = 6;
const SKELETON_COUNT = 6;

const AchievementCardSkeleton: React.FC = () => (
  <div className={styles.achievements__skeletonCard}>
    <Skeleton light borderRadius={12} className={styles.achievements__skeletonCover} />
    <div className={styles.achievements__skeletonInfo}>
      <Skeleton light width="70%" height={16} />
      <Skeleton light width="90%" height={14} />
    </div>
  </div>
);

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

const AchievementsSection: React.FC = observer(() => {
  const store = useLocalStore(() => new AchievementListStore({ pageSize: DISPLAY_COUNT }));
  const [showDates, setShowDates] = useState(false);

  useEffect(() => {
    store.fetchAchievements();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;

  return (
    <section className={styles.achievements} id="achievements">
      <FadeIn>
        <div className={styles.achievements__info}>
          <Text
            font="caveat"
            view="p-24"
            weight="medium"
            color="secondary"
            className={styles.achievements__desc}
          >
            с 2021 по сей день
          </Text>
          <Text tag="h2" view="title" weight="black" uppercase>
            <span className={styles.achievements__titleSpan}>
              Последние <br />
              достижения
              <DotLottieReact
                className={styles.achievements__decorate}
                src="https://assets.awwwards.com/assets/redesign/images/lottie/laurel-wreath.json"
                loop
                autoplay
              />
            </span>
          </Text>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className={styles.achievements__content}>
          <div className={styles.achievements__controls}>
            <AnimatedCheckbox
              checked={showDates}
              onChange={setShowDates}
              label={
                <Text view="p-14" weight="medium">
                  Показывать дату
                </Text>
              }
            />
          </div>

          <div className={styles.achievements__list}>
            {isLoading &&
              Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <AchievementCardSkeleton key={i} />
              ))}

            {!isLoading &&
              store.achievements.length > 0 &&
              store.achievements.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  custom={i % 3}
                >
                  <AchievementCard achievement={achievement} showDate={showDates} />
                </motion.div>
              ))}

            {!isLoading && store.achievements.length === 0 && (
              <div className={styles.achievements__empty}>
                <Text view="p-16" color="secondary">
                  Ничего не найдено
                </Text>
              </div>
            )}
          </div>

          <div className={styles.achievements__allBtn}>
            <Button href={ROUTES.ACHIEVEMENTS} theme="dark">
              <Text view="p-16" weight="medium">
                Все достижения
              </Text>
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
});

export default AchievementsSection;
