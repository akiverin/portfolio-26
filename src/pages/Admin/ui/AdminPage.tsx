import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'shared/api/firebase';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { IconPlus, IconTrash, IconSun, IconMoon } from '@tabler/icons-react';
import classNames from 'classnames';
import styles from './AdminPage.module.scss';
import AdminSidebar from './AdminSidebar';
import AdminTable from 'features/admin/ui/AdminTable';
import EditModal from 'features/admin/ui/EditModal';
import ConfirmModal from 'features/admin/ui/ConfirmModal';
import { ExportDropdown } from 'features/admin/ui/ExportDropdown';
import { exportAchievements, ExportAchievement } from 'shared/lib/exportAchievements';
import { ADMIN_SECTIONS } from './sections';
import { AdminCollectionStore } from 'features/admin/model/AdminCollectionStore';
import { useUserStore } from 'shared/stores/StoreContext';
import { useNotification } from 'shared/ui/Notifications';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';
import { AdminOption } from 'features/admin/model/types';

const AdminPage: React.FC = observer(() => {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const notify = useNotification();

  const [activeSection, setActiveSection] = useState(ADMIN_SECTIONS[0].key);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('admin-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('admin-dark-mode') === 'true';
    } catch {
      return false;
    }
  });

  const [asyncOptions, setAsyncOptions] = useState<Record<string, AdminOption[]>>({});

  const fetchBadgeOptions = useCallback(async () => {
    try {
      const badgesSnap = await getDocs(collection(db, 'badges'));
      const badgeOpts = badgesSnap.docs.map((docSnap) => ({
        value: docSnap.id,
        label: (docSnap.data().title as string) || 'Без названия',
        color: String(docSnap.data().color || 'black'),
        icon: String(docSnap.data().icon || ''),
      }));
      setAsyncOptions((prev) => ({ ...prev, badges: badgeOpts }));
    } catch {
      notify('Не удалось загрузить список бейджей', 'error');
    }
  }, [notify]);

  useEffect(() => {
    void fetchBadgeOptions();
  }, [fetchBadgeOptions]);

  const section = ADMIN_SECTIONS.find((s) => s.key === activeSection) ?? ADMIN_SECTIONS[0];

  const [stores] = useState(() => {
    const map = new Map<string, AdminCollectionStore>();
    ADMIN_SECTIONS.forEach((s) => {
      map.set(s.key, new AdminCollectionStore(s.collection));
    });
    return map;
  });

  const store = stores.get(activeSection)!;

  useEffect(() => {
    if (userStore.isInitialized && !userStore.isAuth) {
      navigate(ROUTES.AUTH, { replace: true });
      return;
    }
    if (userStore.isInitialized && userStore.currentUser && userStore.currentUser.role !== 'admin') {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [userStore.isInitialized, userStore.isAuth, userStore.currentUser, navigate]);

  useEffect(() => {
    if (store.meta === Meta.initial) {
      store.fetch();
    }
  }, [store]);

  const handleToggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin-sidebar-collapsed', String(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const handleToggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin-dark-mode', String(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    await userStore.signOut();
    navigate(ROUTES.HOME, { replace: true });
  }, [userStore, navigate]);

  const handleCellEdit = useCallback(
    async (id: string, key: string, value: string) => {
      try {
        await store.updateCell(id, key, value);
        notify('Ячейка обновлена', 'success');
      } catch {
        notify('Ошибка при обновлении', 'error');
      }
    },
    [store, notify],
  );

  const handleSaveEdit = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        if (store.editingId) {
          await store.update(store.editingId, data);
          if (activeSection === 'badges') await fetchBadgeOptions();
          store.closeEdit();
          notify('Запись обновлена', 'success');
        }
      } catch {
        notify('Ошибка при сохранении', 'error');
      }
    },
    [store, notify, activeSection, fetchBadgeOptions],
  );

  const handleSaveCreate = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        await store.create(data);
        if (activeSection === 'badges') await fetchBadgeOptions();
        store.closeCreate();
        notify('Запись создана', 'success');
      } catch {
        notify('Ошибка при создании', 'error');
      }
    },
    [store, notify, activeSection, fetchBadgeOptions],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!store.deleteId) return;
    try {
      await store.remove(store.deleteId);
      store.closeDelete();
      notify('Запись удалена', 'success');
    } catch {
      notify('Ошибка при удалении', 'error');
    }
  }, [store, notify]);

  const handleConfirmBulkDelete = useCallback(async () => {
    try {
      const count = store.selectedIds.length;
      await store.removeBulk();
      notify(`Удалено записей: ${count}`, 'success');
    } catch {
      notify('Ошибка при удалении', 'error');
    }
  }, [store, notify]);

  const handleExport = useCallback(
    async (range: 'year' | '2years' | 'all', format: 'csv' | 'excel' | 'txt' | 'zip') => {
      try {
        await exportAchievements(store.sortedItems as ExportAchievement[], range, format);
        notify('Экспорт завершён', 'success');
      } catch {
        notify('Ошибка при экспорте', 'error');
      }
    },
    [store, notify],
  );

  const sidebarItems = useMemo(
    () => ADMIN_SECTIONS.map((s) => ({ key: s.key, label: s.label, icon: s.icon })),
    [],
  );

  if (!userStore.isInitialized) {
    return (
      <div
        className={classNames(styles.admin, darkMode && styles['admin--dark'], styles.admin__loading)}
      >
        <div className={styles.admin__spinner} />
      </div>
    );
  }

  return (
    <div className={classNames(styles.admin, darkMode && styles['admin--dark'])}>
      <AdminSidebar
        items={sidebarItems}
        active={activeSection}
        collapsed={collapsed}
        onSelect={setActiveSection}
        onToggle={handleToggleSidebar}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
      />

      <main className={styles.admin__main}>
        <div className={styles.admin__header}>
          <div>
            <h1 className={styles.admin__title}>{section.label}</h1>
            <p className={styles.admin__subtitle}>
              Управление данными коллекции «{section.collection}»
            </p>
          </div>
          <div className={styles.admin__headerActions}>
            {store.hasSelection && (
              <button
                type="button"
                className={styles.admin__bulkDeleteBtn}
                onClick={() => store.openBulkDelete()}
              >
                <IconTrash size={16} stroke={1.5} />
                Удалить ({store.selectedIds.length})
              </button>
            )}
            {activeSection === 'achievements' && (
              <ExportDropdown onExport={handleExport} loading={store.meta === Meta.loading} />
            )}
            <button
              type="button"
              className={styles.admin__themeBtn}
              onClick={handleToggleTheme}
              aria-label={darkMode ? 'Светлая тема' : 'Тёмная тема'}
              title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
            >
              {darkMode ? <IconSun size={18} stroke={1.5} /> : <IconMoon size={18} stroke={1.5} />}
            </button>
            <button
              type="button"
              className={styles.admin__addBtn}
              onClick={() => store.openCreate()}
            >
              <IconPlus size={16} stroke={2} />
              Добавить
            </button>
          </div>
        </div>

        <AdminTable
          columns={section.columns}
          data={store.sortedItems}
          sortKey={store.sortKey}
          sortDir={store.sortDir}
          selectedIds={store.selectedIds}
          page={store.page}
          pageCount={store.pageCount}
          total={store.total}
          loading={store.meta === Meta.loading}
          onSort={(key) => store.setSort(key)}
          onSelect={(id) => store.toggleSelect(id)}
          onSelectAll={() => store.toggleSelectAll()}
          allSelected={store.allSelected}
          onEdit={(id) => store.openEdit(id)}
          onDelete={(id) => store.openDelete(id)}
          onCellEdit={handleCellEdit}
          onPageChange={(p) => store.setPage(p)}
          badgeOptions={asyncOptions.badges ?? []}
        />
      </main>

      <EditModal
        isOpen={store.editingId !== null}
        title="Редактирование"
        fields={section.fields}
        data={store.editingData}
        asyncOptions={asyncOptions}
        darkMode={darkMode}
        onSave={handleSaveEdit}
        onClose={() => store.closeEdit()}
      />

      <EditModal
        isOpen={store.showCreateModal}
        title="Создание записи"
        fields={section.fields}
        data={store.editingData}
        asyncOptions={asyncOptions}
        darkMode={darkMode}
        onSave={handleSaveCreate}
        onClose={() => store.closeCreate()}
      />

      <ConfirmModal
        isOpen={store.deleteId !== null}
        title="Удалить запись?"
        message="Это действие нельзя отменить. Запись будет удалена навсегда."
        onConfirm={handleConfirmDelete}
        onCancel={() => store.closeDelete()}
      />

      <ConfirmModal
        isOpen={store.showBulkDelete}
        title="Удалить выбранные записи?"
        message={`Будет удалено записей: ${store.selectedIds.length}. Это действие нельзя отменить.`}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => store.closeBulkDelete()}
      />
    </div>
  );
});

export default AdminPage;
