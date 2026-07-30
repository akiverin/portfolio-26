import React from 'react';
import { IconMoon, IconPlus, IconSun, IconTrash } from '@tabler/icons-react';
import { ExportDropdown } from 'features/admin/ui/ExportDropdown';
import Text from 'shared/ui/Text';
import styles from './AdminPage.module.scss';

type ExportRange = 'year' | '2years' | 'all';
type ExportFormat = 'csv' | 'excel' | 'txt' | 'zip';

type AdminHeaderProps = {
  title: string;
  collection: string;
  activeSection: string;
  selectedCount: number;
  loading: boolean;
  darkMode: boolean;
  onBulkDelete: () => void;
  onExport: (range: ExportRange, format: ExportFormat) => void;
  onToggleTheme: () => void;
  onCreate: () => void;
};

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  collection,
  activeSection,
  selectedCount,
  loading,
  darkMode,
  onBulkDelete,
  onExport,
  onToggleTheme,
  onCreate,
}) => (
  <header className={styles.admin__header}>
    <div>
      <Text tag="h1" view="p-24" weight="bold" className={styles.admin__title}>
        {title}
      </Text>
      <Text view="p-14" className={styles.admin__subtitle}>
        Коллекция «{collection}»
      </Text>
    </div>

    <div className={styles.admin__headerActions}>
      {selectedCount > 0 && (
        <button type="button" className={styles.admin__bulkDeleteBtn} onClick={onBulkDelete}>
          <IconTrash size={16} stroke={1.5} aria-hidden="true" />
          <Text tag="span" view="p-14" weight="medium">
            Удалить ({selectedCount})
          </Text>
        </button>
      )}
      {activeSection === 'achievements' && <ExportDropdown onExport={onExport} loading={loading} />}
      <button
        type="button"
        className={styles.admin__themeBtn}
        onClick={onToggleTheme}
        aria-label={darkMode ? 'Светлая тема' : 'Тёмная тема'}
        title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
      >
        {darkMode ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
      </button>
      <button type="button" className={styles.admin__addBtn} onClick={onCreate}>
        <IconPlus size={16} stroke={2} aria-hidden="true" />
        <Text tag="span" view="p-14" weight="medium">
          Добавить
        </Text>
      </button>
    </div>
  </header>
);

export default AdminHeader;
