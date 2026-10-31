import React from 'react';
import styles from './Pagination.module.scss';
import classNames from 'classnames';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

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
    <nav className={classNames(styles.pagination, className)} aria-label="Навигация по страницам">
      <button
        type="button"
        className={styles.pagination__arrow}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Предыдущая страница"
      >
        <IconChevronLeft size={18} stroke={1.7} aria-hidden="true" />
      </button>
      <ol className={styles.pagination__pages}>
        {pages.map((item) =>
          item.type === 'dots' ? (
            <li key={item.key} className={styles.pagination__dots} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item.value} data-current={item.value === page || undefined}>
              <button
                type="button"
                className={styles.pagination__page}
                onClick={() => onPageChange(item.value)}
                aria-label={`Страница ${item.value}`}
                aria-current={item.value === page ? 'page' : undefined}
              >
                {item.value}
              </button>
            </li>
          ),
        )}
      </ol>
      <span className={styles.pagination__mobileTotal} aria-hidden="true">
        из {pageCount}
      </span>
      <button
        type="button"
        className={styles.pagination__arrow}
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        aria-label="Следующая страница"
      >
        <IconChevronRight size={18} stroke={1.7} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
