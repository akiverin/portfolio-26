'use client';

import styles from './GrantsSection.module.scss';
import Text from 'shared/ui/Text';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { GrantListStore } from 'entities/Grant/stores/GrantListStore';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import GovScience from 'shared/ui/icons/GovScience';
import Polytech from 'shared/ui/icons/Polytech';
import Moscow from 'shared/ui/icons/Moscow';
import Button from 'shared/ui/Button';
import Skeleton from 'shared/ui/Skeleton';
import classNames from 'classnames';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';

const GRANT_ICONS = {
  govScience: GovScience,
  polytech: Polytech,
  moscow: Moscow,
};

const SKELETON_COUNT = 4;

const formatMonthYear = (date: Date): string => {
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const GrantItemSkeleton: React.FC = () => (
  <li className={styles.grants__item}>
    <div className={styles.grants__titles}>
      <Skeleton width="50%" height={20} />
      <div className={styles.grants__details}>
        <Skeleton width="35%" height={16} />
        <Skeleton width="15%" height={16} />
      </div>
    </div>
    <div className={styles.grants__dates}>
      <Skeleton width={100} height={14} />
    </div>
  </li>
);

const GrantsSection: React.FC = observer(() => {
  const [isActive, setIsActive] = useState(false);
  const store = useLocalStore(() => new GrantListStore());

  useEffect(() => {
    store.fetchAllGrants();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;

  return (
    <section className={styles.grants}>
      <div className={styles.grants__head}>
        <Text
          font="caveat"
          view="p-24"
          weight="medium"
          color="secondary"
          className={styles.grants__desc}
        >
          с 2022 по 2026 год
        </Text>
        <Text tag="h2" view="title" weight="black" uppercase>
          <span className={styles.grants__titleSpan}>
            Стипендии <br />и гранты
            <DotLottieReact
              className={styles.grants__decorate}
              src="https://lottie.host/32f3e8a4-7bfd-4d0f-8529-f58a3b4560fa/ISHaPO2vJn.lottie"
              autoplay
              loop
            />
          </span>
        </Text>
      </div>
      <ul
        className={classNames(
          styles.grants__content,
          isActive ? styles['grants__content--active'] : '',
        )}
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => <GrantItemSkeleton key={i} />)
          : store.grants.map((grant) => (
              <li key={grant.id} className={styles.grants__item}>
                <div className={styles.grants__titles}>
                  <Text tag="h3" view="p-20">
                    {grant.title}
                  </Text>
                  <div className={styles.grants__details}>
                    {grant.icon && grant.icon in GRANT_ICONS
                      ? React.createElement(
                          GRANT_ICONS[grant.icon as keyof typeof GRANT_ICONS],
                        )
                      : null}{' '}
                    <Text view="p-16" color="secondary">
                      {grant.desc}
                    </Text>
                    <Text view="p-16" color="secondary">
                      •{' '}
                      {Number(grant.sum).toLocaleString('ru-RU', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}{' '}
                      ₽
                    </Text>
                  </div>
                </div>
                <div className={styles.grants__dates}>
                  <Text view="p-14" color="secondary">
                    {formatMonthYear(
                      new Date(
                        grant.startDate.seconds * 1000 +
                          grant.startDate.nanoseconds / 1000000,
                      ),
                    )}
                  </Text>
                  <Text view="p-14" color="secondary">
                    {' – '}
                    {formatMonthYear(
                      new Date(
                        grant.endDate.seconds * 1000 + grant.endDate.nanoseconds / 1000000,
                      ),
                    )}
                  </Text>
                </div>
              </li>
            ))}
      </ul>
      <Button className={styles.grants__button} onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Скрыть' : 'Показать все'}
      </Button>
    </section>
  );
});

export default GrantsSection;
