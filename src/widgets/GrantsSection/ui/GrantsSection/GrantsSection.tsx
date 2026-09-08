import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence, motion } from 'framer-motion';
import {
  IconArrowDown,
  IconBuildingBank,
  IconCalendarEvent,
  IconCoins,
  IconSparkles,
} from '@tabler/icons-react';
import styles from './GrantsSection.module.scss';
import Text from 'shared/ui/Text';
import { GrantListStore } from 'entities/Grant/stores/GrantListStore';
import GovScience from 'shared/ui/icons/GovScience';
import Polytech from 'shared/ui/icons/Polytech';
import Moscow from 'shared/ui/icons/Moscow';
import Alfa from 'shared/ui/icons/Alfa';
import Skeleton from 'shared/ui/Skeleton';
import Select from 'shared/ui/Select';
import { useLocalStore } from 'shared/hooks/useLocalStore';
import { Meta } from 'shared/lib/meta';

const GRANT_ICONS = {
  govScience: GovScience,
  polytech: Polytech,
  moscow: Moscow,
  alfa: Alfa,
};

const COLLAPSED_COUNT = 3;

type GrantSort = 'date-desc' | 'date-asc' | 'sum-desc' | 'sum-asc';

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'sum-desc', label: 'Сначала крупные суммы' },
  { value: 'sum-asc', label: 'Сначала небольшие суммы' },
];

const MONTHS = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
] as const;

const timestampToDate = (timestamp: { seconds: number; nanoseconds: number }): Date =>
  new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000);

const formatMonthYear = (date: Date): string => `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const formatAmount = (value: string | number): string =>
  `${Number(value).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`;

const GrantItemSkeleton: React.FC = () => (
  <li className={styles.grants__item}>
    <Skeleton width={44} height={44} borderRadius={12} />
    <div className={styles.grants__skeletonCopy}>
      <Skeleton width="64%" height={19} />
      <Skeleton width="42%" height={13} />
    </div>
    <Skeleton width={110} height={18} />
  </li>
);

const GrantsSection: React.FC = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sort, setSort] = useState<GrantSort>('date-desc');
  const store = useLocalStore(() => new GrantListStore());

  useEffect(() => {
    store.fetchAllGrants();
  }, [store]);

  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;
  const sortedGrants = useMemo(() => {
    const grants = [...store.grants];
    grants.sort((first, second) => {
      if (sort === 'sum-desc') return Number(second.sum) - Number(first.sum);
      if (sort === 'sum-asc') return Number(first.sum) - Number(second.sum);
      const difference = first.startDate.seconds - second.startDate.seconds;
      return sort === 'date-asc' ? difference : -difference;
    });
    return grants;
  }, [store.grants, sort]);
  const visibleGrants = isExpanded ? sortedGrants : sortedGrants.slice(0, COLLAPSED_COUNT);
  const hiddenCount = Math.max(0, sortedGrants.length - COLLAPSED_COUNT);
  const totalSupport = useMemo(
    () => store.grants.reduce((total, grant) => total + Number(grant.sum || 0), 0),
    [store.grants],
  );

  return (
    <section className={styles.grants} aria-labelledby="grants-title">
      <div className={styles.grants__shell}>
        <div className={styles.grants__background} aria-hidden="true">
          <div className={styles.grants__halo} />
          <div className={styles.grants__orbit} />
        </div>

        <motion.div
          className={styles.grants__aside}
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className={styles.grants__heading}>
            <Text tag="span" view="p-14" className={styles.grants__eyebrow}>
              <IconSparkles size={14} stroke={1.6} /> 04 · Academic support
            </Text>
            <Text id="grants-title" tag="h2" view="title" weight="black" uppercase>
              Стипендии
              <br />и гранты
            </Text>
            <Text tag="p" view="p-16">
              Поддержка за академические, проектные и исследовательские результаты.
            </Text>
          </div>

          <div className={styles.grants__asideNote}>
            <IconBuildingBank size={17} stroke={1.5} />
            <Text tag="span" view="p-14">
              2022 — 2026 · Москва
            </Text>
          </div>
        </motion.div>

        <motion.div
          className={styles.grants__archive}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className={styles.grants__archiveHeader}>
            <Select
              value={sort}
              options={SORT_OPTIONS}
              onChange={(value) => setSort(value as GrantSort)}
              className={styles.grants__sort}
            />
          </div>

          <ul className={styles.grants__content} id="grants-list">
            {store.meta === Meta.error && (
              <li className={styles.grants__empty} role="alert">
                <Text view="p-14">Не удалось загрузить данные</Text>
              </li>
            )}

            {isLoading &&
              Array.from({ length: COLLAPSED_COUNT }, (_, index) => (
                <GrantItemSkeleton key={index} />
              ))}

            <AnimatePresence initial={false}>
              {!isLoading &&
                visibleGrants.map((grant, index) => {
                  const GrantIcon =
                    grant.icon && grant.icon in GRANT_ICONS
                      ? GRANT_ICONS[grant.icon as keyof typeof GRANT_ICONS]
                      : null;

                  return (
                    <motion.li
                      key={grant.id}
                      className={styles.grants__item}
                      initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.38, delay: index * 0.045 }}
                    >
                      <div className={styles.grants__iconBox}>
                        {GrantIcon ? <GrantIcon /> : <IconCoins size={20} stroke={1.4} />}
                      </div>

                      <div className={styles.grants__copy}>
                        <Text tag="h3" view="p-18" weight="bold">
                          {grant.title}
                        </Text>
                        <Text tag="p" view="p-14">
                          {grant.desc}
                        </Text>
                      </div>

                      <div className={styles.grants__meta}>
                        <Text
                          tag="span"
                          view="p-16"
                          weight="bold"
                          className={styles.grants__amount}
                        >
                          {formatAmount(grant.sum)}
                        </Text>
                        <Text tag="span" view="p-12" className={styles.grants__period}>
                          <IconCalendarEvent size={13} stroke={1.5} />
                          {formatMonthYear(timestampToDate(grant.startDate))} —{' '}
                          {formatMonthYear(timestampToDate(grant.endDate))}
                        </Text>
                      </div>
                    </motion.li>
                  );
                })}
            </AnimatePresence>
          </ul>

          {!isLoading && hiddenCount > 0 && (
            <button
              type="button"
              className={styles.grants__expandBtn}
              onClick={() => setIsExpanded((value) => !value)}
              aria-expanded={isExpanded}
              aria-controls="grants-list"
            >
              <Text tag="span" view="p-14" weight="medium">
                {isExpanded ? 'Свернуть архив' : `Ещё ${hiddenCount} записей`}
              </Text>
              <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                <IconArrowDown size={17} stroke={1.7} />
              </motion.span>
            </button>
          )}
        </motion.div>

        <AnimatePresence>
          {(isExpanded || hiddenCount === 0) && !isLoading && (
            <motion.div
              className={styles.grants__summary}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <Text tag="span" view="p-12">
                  Количество стипендий и грантов
                </Text>
                <Text tag="span" view="p-20" weight="bold">
                  {store.grants.length}
                </Text>
              </div>
              <div>
                <Text tag="span" view="p-12">
                  Общая сумма
                </Text>
                <Text tag="span" view="p-20" weight="bold">
                  {formatAmount(totalSupport)}
                </Text>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

export default GrantsSection;
