import React from 'react';
import styles from './Pagination.module.scss';
import classNames from 'classnames';
import Text from 'shared/ui/Text';

export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

type PageItem = { type: 'page'; value: number } | { type: 'dots'; key: string };

function getPageNumbers(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({ type: 'page' as const, value: i + 1 }));
  }

  const pages: PageItem[] = [{ type: 'page', value: 1 }];

  if (current > 3) {
    pages.push({ type: 'dots', key: 'dots-left' });
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push({ type: 'page', value: i });
  }

  if (current < total - 2) {
    pages.push({ type: 'dots', key: 'dots-right' });
  }

  pages.push({ type: 'page', value: total });

  return pages;
}

const Pagination: React.FC<PaginationProps> = ({ page, pageCount, onPageChange, className }) => {
  if (pageCount <= 1) return null;

  const pages = getPageNumbers(page, pageCount);

  return (
    <div className={classNames(styles.pagination, className)}>
      <button
        className={styles.pagination__arrow}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Предыдущая страница"
      >
        <Text view="p-16" weight="medium">
          ‹
        </Text>
      </button>

      {pages.map((item) =>
        item.type === 'dots' ? (
          <span key={item.key} className={styles.pagination__dots}>
            <Text view="p-14" color="secondary">
              …
            </Text>
          </span>
        ) : (
          <button
            key={item.value}
            className={classNames(styles.pagination__page, {
              [styles['pagination__page--active']]: item.value === page,
            })}
            onClick={() => onPageChange(item.value)}
          >
            <Text view="p-14" weight={item.value === page ? 'bold' : 'medium'}>
              {item.value}
            </Text>
          </button>
        ),
      )}

      <button
        className={styles.pagination__arrow}
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Следующая страница"
      >
        <Text view="p-16" weight="medium">
          ›
        </Text>
      </button>
    </div>
  );
};

export default Pagination;
