import ActionButton from 'shared/ui/ActionButton';
import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import GovScience from 'shared/ui/icons/GovScience';
import Polytech from 'shared/ui/icons/Polytech';
import Moscow from 'shared/ui/icons/Moscow';
import Alfa from 'shared/ui/icons/Alfa';
import styles from './GrantsSection.module.scss';
import { GrantListStore } from 'entities/Grant/stores/GrantListStore';
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
  new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds ?? 0) / 1_000_000);

const formatMonthYear = (date: Date): string => `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const formatAmount = (value: string | number): string =>
  `${Number(value).toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽`;

const getGrantMonthCount = (startDate: Date, endDate: Date): number => {
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth() +
    1;

  return Math.max(1, months);
};

const GrantItemSkeleton = () => (
  <li className={styles.grants__item} aria-hidden="true">
    <Skeleton width={40} height={40} borderRadius={10} />
    <Skeleton width="78%" height={18} />
    <Skeleton width="90%" height={14} />
    <Skeleton width="48%" height={24} />
  </li>
);

const GrantsSection = observer(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sort, setSort] = useState<GrantSort>('date-desc');
  const store = useLocalStore(() => new GrantListStore());
  useEffect(() => {
    void store.fetchAllGrants();
  }, [store]);
  const isLoading = store.meta === Meta.initial || store.meta === Meta.loading;
  const sortedGrants = useMemo(
    () =>
      [...store.grants].sort((first, second) => {
        if (sort === 'sum-desc') return Number(second.sum) - Number(first.sum);
        if (sort === 'sum-asc') return Number(first.sum) - Number(second.sum);
        const difference = first.startDate.seconds - second.startDate.seconds;
        return sort === 'date-asc' ? difference : -difference;
      }),
    [store.grants, sort],
  );
  const visibleGrants = isExpanded ? sortedGrants : sortedGrants.slice(0, COLLAPSED_COUNT);
  const totalSupport = store.grants.reduce((total, grant) => total + (Number(grant.sum) || 0), 0);

  return (
    <section className={styles.grants} aria-labelledby="grants-title">
      <header className={styles.grants__heading}>
        <div>
          <h2 id="grants-title">Стипендии и гранты</h2>
          <p>Поддержка учёбы и исследований.</p>
        </div>
        {!isLoading && store.meta !== Meta.error && store.grants.length > 0 && (
          <div className={styles.grants__summary}>
            <span>Общая поддержка</span>
            <strong>{formatAmount(totalSupport)}</strong>
          </div>
        )}
      </header>
      <div className={styles.grants__archive}>
        <div className={styles.grants__archiveHeader}>
          <Select
            aria-label="Сортировка стипендий и грантов"
            value={sort}
            options={SORT_OPTIONS}
            onChange={(value) => setSort(value as GrantSort)}
            className={styles.grants__sort}
          />
        </div>
        <ul
          className={styles.grants__content}
          id="grants-list"
          data-expanded={isExpanded || undefined}
        >
          {store.meta === Meta.error && (
            <li className={styles.grants__empty} role="alert">
              Не удалось загрузить данные
            </li>
          )}
          {isLoading &&
            Array.from({ length: COLLAPSED_COUNT }, (_, index) => (
              <GrantItemSkeleton key={index} />
            ))}
          {!isLoading &&
            visibleGrants.map((grant) => {
              const GrantIcon =
                grant.icon && grant.icon in GRANT_ICONS
                  ? GRANT_ICONS[grant.icon as keyof typeof GRANT_ICONS]
                  : null;
              const start = timestampToDate(grant.startDate);
              const end = timestampToDate(grant.endDate);
              const months = getGrantMonthCount(start, end);
              return (
                <li key={grant.id} className={styles.grants__item}>
                  <div className={styles.grants__cardHeader}>
                    <div className={styles.grants__iconBox} aria-hidden="true">
                      {GrantIcon ? <GrantIcon /> : null}
                    </div>
                    <span className={styles.grants__period}>
                      {formatMonthYear(start)} — {formatMonthYear(end)}
                    </span>
                  </div>
                  <div className={styles.grants__copy}>
                    <h3>{grant.title}</h3>
                    <p>{grant.desc}</p>
                  </div>
                  <div className={styles.grants__amounts}>
                    <strong>{formatAmount(grant.sum)}</strong>
                    <span title={`В среднем за период: ${months} мес.`}>
                      {formatAmount(Math.round(Number(grant.sum) / months))}/мес
                    </span>
                  </div>
                </li>
              );
            })}
          {!isLoading && store.meta !== Meta.error && store.grants.length === 0 && (
            <li className={styles.grants__empty}>Пока нет записей</li>
          )}
        </ul>
        {!isLoading && store.grants.length > COLLAPSED_COUNT && (
          <div className={styles.grants__footer}>
            <ActionButton
              variant="text"
              size="sm"
              onClick={() => setIsExpanded((value) => !value)}
              aria-expanded={isExpanded}
              aria-controls="grants-list"
            >
              {isExpanded ? 'Свернуть' : `Показать все (${store.grants.length})`}
              <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
            </ActionButton>
          </div>
        )}
      </div>
    </section>
  );
});
export default GrantsSection;
