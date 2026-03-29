import styles from './GrantsSection.module.scss';
import Text from 'shared/ui/Text';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { GrantListStore } from 'entities/Grant/stores/GrantListStore';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import GovScience from 'shared/ui/icons/GovScience';
import Polytech from 'shared/ui/icons/Polytech';
import Moscow from 'shared/ui/icons/Moscow';
import { IconChevronDown } from '@tabler/icons-react';
import Skeleton from 'shared/ui/Skeleton';
import classNames from 'classnames';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';
import FadeIn from 'shared/ui/FadeIn';

const GRANT_ICONS = {
  govScience: GovScience,
  polytech: Polytech,
  moscow: Moscow,
};

const SKELETON_COUNT = 4;

const MONTHS = [
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
] as const;

const timestampToDate = (ts: { seconds: number; nanoseconds: number }): Date =>
  new Date(ts.seconds * 1000 + ts.nanoseconds / 1_000_000);

const formatMonthYear = (date: Date): string =>
  `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

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

const grantItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const GrantsSection: React.FC = observer(() => {
  const [isActive, setIsActive] = useState(false);
  const store = useLocalStore(() => new GrantListStore());

  useEffect(() => {
    store.fetchAllGrants();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;

  return (
    <section className={styles.grants}>
      <FadeIn>
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
      </FadeIn>
      <ul
        className={classNames(
          styles.grants__content,
          isActive && styles['grants__content--active'],
        )}
      >
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => <GrantItemSkeleton key={i} />)
          : store.grants.map((grant, i) => (
              <motion.li
                key={grant.id}
                className={styles.grants__item}
                variants={grantItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
              >
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
                    {formatMonthYear(timestampToDate(grant.startDate))}
                  </Text>
                  <Text view="p-14" color="secondary">
                    {' – '}
                    {formatMonthYear(timestampToDate(grant.endDate))}
                  </Text>
                </div>
              </motion.li>
            ))}
      </ul>
      <div className={styles.grants__buttonWrapper}>
        <button
          type="button"
          className={styles.grants__expandBtn}
          onClick={() => setIsActive(!isActive)}
        >
          <span className={styles.grants__expandLabel}>
            {isActive ? 'Скрыть' : 'Показать все'}
          </span>
          <motion.span
            className={styles.grants__expandIcon}
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <IconChevronDown size={18} stroke={2} />
          </motion.span>
        </button>
      </div>
    </section>
  );
});

export default GrantsSection;
