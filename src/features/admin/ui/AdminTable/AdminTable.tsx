import React, { useState, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  IconPencil,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import styles from './AdminTable.module.scss';
import classNames from 'classnames';
import { AdminOption, ColumnDef } from 'features/admin/model/types';
import Badge, { ColorsBadgeT, IconsBadgeT } from 'shared/ui/Badge';

type AdminTableProps = {
  columns: ColumnDef[];
  data: Record<string, unknown>[];
  sortKey: string;
  sortDir: 'asc' | 'desc';
  selectedIds: string[];
  page: number;
  pageCount: number;
  total: number;
  loading: boolean;
  onSort: (key: string) => void;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCellEdit: (id: string, key: string, value: string) => void;
  onPageChange: (page: number) => void;
  badgeOptions?: AdminOption[];
};

const formatTimestamp = (val: unknown): string => {
  if (!val || typeof val !== 'object') return '—';
  const ts = val as { seconds?: number };
  if (typeof ts.seconds === 'number') {
    return new Date(ts.seconds * 1000).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  if (val instanceof Date) {
    return val.toLocaleDateString('ru-RU');
  }
  return '—';
};

const formatCellValue = (val: unknown, type?: string): string => {
  if (val == null) return '—';
  if (type === 'timestamp') return formatTimestamp(val);
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

type InlineCellProps = {
  rowId: string;
  colKey: string;
  value: unknown;
  type?: string;
  editable?: boolean;
  onSave: (id: string, key: string, value: string) => void;
  badgeOptions?: AdminOption[];
};

const getReferenceId = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return null;
  if ('id' in value && typeof value.id === 'string') return value.id;
  if ('path' in value && typeof value.path === 'string') {
    return value.path.split('/').filter(Boolean).at(-1) ?? null;
  }
  return null;
};

const InlineCell: React.FC<InlineCellProps> = ({
  rowId,
  colKey,
  value,
  type,
  editable,
  onSave,
  badgeOptions = [],
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const startEdit = useCallback(() => {
    if (!editable || type === 'timestamp' || type === 'image') return;
    setEditValue(value == null ? '' : String(value));
    setEditing(true);
  }, [editable, type, value]);

  const save = useCallback(() => {
    setEditing(false);
    if (editValue !== String(value ?? '')) {
      onSave(rowId, colKey, editValue);
    }
  }, [editValue, value, rowId, colKey, onSave]);

  const cancel = useCallback(() => {
    setEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') cancel();
    },
    [save, cancel],
  );

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={styles.table__inlineInput}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
      />
    );
  }

  if (type === 'badges') {
    const references = Array.isArray(value) ? value : [];
    const badges = references
      .map(getReferenceId)
      .filter((id): id is string => Boolean(id))
      .map((id) => badgeOptions.find((option) => option.value === id))
      .filter((option): option is AdminOption => Boolean(option));

    if (badges.length === 0) {
      return <span className={styles.table__emptyValue}>Нет бейджей</span>;
    }

    return (
      <div className={styles.table__badgeList}>
        {badges.map((badge) => (
          <Badge
            key={badge.value}
            title={badge.label}
            color={badge.color as ColorsBadgeT}
            icon={badge.icon as IconsBadgeT}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={classNames(styles.table__cellText, editable && styles['table__cellText--editable'])}
      onDoubleClick={startEdit}
      title={editable ? 'Двойной клик для редактирования' : undefined}
    >
      {type === 'image' && value ? (
        <img src={String(value)} alt="" className={styles.table__cellImage} />
      ) : null}
      {type === 'url' && value ? (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.table__cellLink}
        >
          {String(value).length > 40 ? `${String(value).slice(0, 40)}...` : String(value)}
        </a>
      ) : null}
      {type !== 'image' && type !== 'url' ? formatCellValue(value, type) : null}
      {type === 'url' && !value ? '—' : null}
    </span>
  );
};

const AdminTable: React.FC<AdminTableProps> = observer(
  ({
    columns,
    data,
    sortKey,
    sortDir,
    selectedIds,
    page,
    pageCount,
    total,
    loading,
    onSort,
    onSelect,
    onSelectAll,
    allSelected,
    onEdit,
    onDelete,
    onCellEdit,
    onPageChange,
    badgeOptions,
  }) => {
    const getSortIcon = (key: string) => {
      if (sortKey !== key) return <IconArrowsSort size={14} stroke={1.5} />;
      return sortDir === 'asc' ? (
        <IconArrowUp size={14} stroke={2} />
      ) : (
        <IconArrowDown size={14} stroke={2} />
      );
    };

    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
    const visiblePages = pages.filter(
      (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
    );

    return (
      <div className={styles.table}>
        <div className={styles.table__scrollWrapper}>
          <table className={styles.table__element}>
            <thead>
              <tr>
                <th className={styles.table__checkCol}>
                  <input
                    type="checkbox"
                    checked={allSelected && data.length > 0}
                    onChange={onSelectAll}
                    className={styles.table__checkbox}
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={classNames(
                      styles.table__th,
                      col.sortable && styles['table__th--sortable'],
                    )}
                    style={{ width: col.width, minWidth: col.minWidth || '120px' }}
                    onClick={() => col.sortable && onSort(col.key)}
                  >
                    <span className={styles.table__thContent}>
                      {col.label}
                      {col.sortable && (
                        <span className={styles.table__sortIcon}>{getSortIcon(col.key)}</span>
                      )}
                    </span>
                  </th>
                ))}
                <th className={styles.table__actionsCol}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading && data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className={styles.table__empty}>
                    <div className={styles.table__loader}>
                      <div className={styles.table__spinner} />
                    </div>
                  </td>
                </tr>
              )}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className={styles.table__empty}>
                    Нет данных
                  </td>
                </tr>
              )}
              {data.map((row) => {
                const id = row.id as string;
                const isSelected = selectedIds.includes(id);
                return (
                  <tr
                    key={id}
                    className={classNames(
                      styles.table__row,
                      isSelected && styles['table__row--selected'],
                    )}
                  >
                    <td className={styles.table__checkCol}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(id)}
                        className={styles.table__checkbox}
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className={styles.table__td}>
                        {col.render ? (
                          col.render(row[col.key], row)
                        ) : (
                          <InlineCell
                            rowId={id}
                            colKey={col.key}
                            value={row[col.key]}
                            type={col.type}
                            editable={col.editable}
                            onSave={onCellEdit}
                            badgeOptions={badgeOptions}
                          />
                        )}
                      </td>
                    ))}
                    <td className={styles.table__actionsCol}>
                      <div className={styles.table__actions}>
                        <button
                          type="button"
                          className={styles.table__actionBtn}
                          onClick={() => onEdit(id)}
                          title="Редактировать"
                        >
                          <IconPencil size={16} stroke={1.5} />
                        </button>
                        <button
                          type="button"
                          className={classNames(
                            styles.table__actionBtn,
                            styles['table__actionBtn--danger'],
                          )}
                          onClick={() => onDelete(id)}
                          title="Удалить"
                        >
                          <IconTrash size={16} stroke={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className={styles.table__pagination}>
            <span className={styles.table__paginationInfo}>
              Всего: {total}
            </span>
            <div className={styles.table__paginationControls}>
              <button
                type="button"
                className={styles.table__pageBtn}
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                <IconChevronLeft size={16} />
              </button>
              {visiblePages.map((p, i) => {
                const prev = visiblePages[i - 1];
                const showEllipsis = prev !== undefined && p - prev > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className={styles.table__ellipsis}>...</span>}
                    <button
                      type="button"
                      className={classNames(
                        styles.table__pageBtn,
                        p === page && styles['table__pageBtn--active'],
                      )}
                      onClick={() => onPageChange(p)}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
              <button
                type="button"
                className={styles.table__pageBtn}
                disabled={page >= pageCount}
                onClick={() => onPageChange(page + 1)}
              >
                <IconChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

export default AdminTable;
