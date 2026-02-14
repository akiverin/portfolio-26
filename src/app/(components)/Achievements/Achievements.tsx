"use client";

import { observer, useLocalObservable } from "mobx-react-lite";
import styles from "./Achievements.module.scss";
import Text from "components/Text";
import { useCallback, useEffect } from "react";
import { SearchParams } from "entities/searchParams/model";
import { useSearchParams } from "next/navigation";
import { useUrlParams } from "hooks/useUrlParams";
import { AchievementListStore } from "entities/achievement/stores/AchievementListStore";
import AchievementCard from "./AchievementCard";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const AchievementsSection: React.FC = observer(() => {
  const searchParams = useSearchParams();
  const { set: updateUrl } = useUrlParams();

  const handleUpdateUrl = useCallback(
    (updates: Partial<SearchParams>) => {
      const cleaned = Object.fromEntries(
        Object.entries(updates).filter(([, value]) => value != null)
      );
      updateUrl(cleaned);
    },
    [updateUrl]
  );

  const achievementsListStore = useLocalObservable(
    () => new AchievementListStore(new URLSearchParams(), handleUpdateUrl)
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    achievementsListStore.searchModel.initFromParams(params);
    achievementsListStore.fetchAllAchievements();
  }, [searchParams, achievementsListStore]);

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
        {achievementsListStore.achievements.map((achievement) => {
          return (
            <AchievementCard achievement={achievement} key={achievement.id} />
          );
        })}
      </div>
    </section>
  );
});

export default AchievementsSection;
