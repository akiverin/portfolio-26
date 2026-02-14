'use client';

import { observer } from 'mobx-react-lite';
import styles from './AchievementsSection.module.scss';
import Text from 'shared/ui/Text';
import { useEffect } from 'react';
import { AchievementListStore } from 'entities/Achievement/stores/AchievementListStore';
import AchievementCard from 'entities/Achievement/ui/AchievementCard';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLocalStore } from 'shared/hooks/useLocalStore';

const AchievementsSection: React.FC = observer(() => {
  const store = useLocalStore(() => new AchievementListStore());

  useEffect(() => {
    store.fetchAllAchievements();
  }, [store]);

  return (
    <section className={styles.achievements} id="achievements">
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
      <div className={styles.achievements__list}>
        {store.achievements.map((achievement) => (
          <AchievementCard achievement={achievement} key={achievement.id} />
        ))}
      </div>
    </section>
  );
});

export default AchievementsSection;
