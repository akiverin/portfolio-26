'use client';

import { observer } from 'mobx-react-lite';
import styles from './AchievementsSection.module.scss';
import Text from 'shared/ui/Text';
import { useEffect } from 'react';
import { AchievementListStore, SortField } from 'entities/Achievement/stores/AchievementListStore';
import AchievementCard from 'entities/Achievement/ui/AchievementCard';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import Input from 'shared/ui/Input';
import Search from 'shared/ui/icons/Search';
import Button from 'shared/ui/Button';
import Pagination from 'shared/ui/Pagination';
import ArrowDownIcon from 'shared/ui/icons/ArrowDownIcon';
import classNames from 'classnames';

const AchievementsSection: React.FC = observer(() => {
  const store = useLocalStore(() => new AchievementListStore());

  useEffect(() => {
    store.fetchAchievements();
  }, [store]);

  const handleSortToggle = (field: SortField) => {
    if (store.sortField === field) {
      store.setSort(field, store.sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      store.setSort(field, 'desc');
    }
  };

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

      <div className={styles.achievements__content}>
        <div className={styles.achievements__controls}>
          <div className={styles.achievements__search}>
            <Input
              value={store.search}
              onChange={(v) => store.setSearch(v)}
              placeholder="Поиск по достижениям..."
              afterSlot={<Search width={20} height={20} />}
            />
          </div>
          <div className={styles.achievements__sort}>
            <Button
              theme={store.sortField === 'date' ? 'accent' : 'dark'}
              onClick={() => handleSortToggle('date')}
            >
              <Text view="p-14" weight="medium">
                По дате
              </Text>
              {store.sortField === 'date' && (
                <ArrowDownIcon
                  width={16}
                  height={16}
                  className={classNames(styles.achievements__sortIcon, {
                    [styles['achievements__sortIcon--asc']]: store.sortDirection === 'asc',
                  })}
                />
              )}
            </Button>
            <Button
              theme={store.sortField === 'title' ? 'accent' : 'dark'}
              onClick={() => handleSortToggle('title')}
            >
              <Text view="p-14" weight="medium">
                По названию
              </Text>
              {store.sortField === 'title' && (
                <ArrowDownIcon
                  width={16}
                  height={16}
                  className={classNames(styles.achievements__sortIcon, {
                    [styles['achievements__sortIcon--asc']]: store.sortDirection === 'asc',
                  })}
                />
              )}
            </Button>
          </div>
        </div>

        <div className={styles.achievements__list}>
          {store.achievements.length > 0 ? (
            store.achievements.map((achievement) => (
              <AchievementCard achievement={achievement} key={achievement.id} />
            ))
          ) : (
            <div className={styles.achievements__empty}>
              <Text view="p-16" color="secondary">
                {store.search ? 'Ничего не найдено' : 'Загрузка...'}
              </Text>
            </div>
          )}
        </div>

        {store.totalPages > 1 && (
          <div className={styles.achievements__pagination}>
            <Pagination
              page={store.pagination.page}
              pageCount={store.totalPages}
              onPageChange={(p) => store.setPage(p)}
            />
          </div>
        )}
      </div>
    </section>
  );
});

export default AchievementsSection;
