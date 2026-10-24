import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'shared/api/firebase';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './AdminPage.module.scss';
import AdminSidebar from './AdminSidebar';
import AdminTable from 'features/admin/ui/AdminTable';
import EditModal from 'features/admin/ui/EditModal';
import ConfirmModal from 'features/admin/ui/ConfirmModal';
import { exportAchievements, ExportAchievement } from 'shared/lib/exportAchievements';
import { ADMIN_SECTIONS } from './sections';
import { AdminCollectionStore } from 'features/admin/model/AdminCollectionStore';
import { useUserStore } from 'shared/stores/StoreContext';
import { useNotification } from 'shared/ui/Notifications';
import { ROUTES } from 'shared/configs/routes';
import { Meta } from 'shared/lib/meta';
import { AdminOption } from 'features/admin/model/types';
import AdminHeader from './AdminHeader';
import { deleteMedia, isManagedMediaUrl, MediaEntity, uploadMedia } from 'shared/api/mediaApi';
import type { MediaChange } from 'features/admin/ui/EditModal/EditModal';

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
      return localStorage.getItem('admin-dark-mode') !== 'false';
    } catch {
      return true;
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
    if (
      userStore.isInitialized &&
      userStore.currentUser &&
      userStore.currentUser.role !== 'admin'
    ) {
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
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const handleToggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin-dark-mode', String(next));
      } catch {
        /* ignore */
      }
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

  const handleUploadMedia = useCallback(
    async (entity: MediaEntity, file: File) => {
      const token = await userStore.getIdToken();
      if (!token) throw new Error('Войдите в аккаунт администратора повторно.');
      return uploadMedia(entity, file, token);
    },
    [userStore],
  );

  const handleDeleteMedia = useCallback(
    async (url: string) => {
      const token = await userStore.getIdToken();
      if (!token) throw new Error('Войдите в аккаунт администратора повторно.');
      await deleteMedia(url, token);
    },
    [userStore],
  );

  const removeReplacedMedia = useCallback(
    async (data: Record<string, unknown>, mediaChanges: MediaChange[]) => {
      const currentUrls = new Set(
        Object.values(data).filter((value): value is string => typeof value === 'string'),
      );
      const urls = [...new Set(
        mediaChanges
          .map((change) => change.previousUrl)
          .filter((url): url is string => Boolean(url && !currentUrls.has(url) && isManagedMediaUrl(url))),
      )];

      const results = await Promise.allSettled(urls.map((url) => handleDeleteMedia(url)));
      if (results.some((result) => result.status === 'rejected')) {
        notify('Запись сохранена, но один из старых медиафайлов не удалось удалить', 'error');
      }
    },
    [handleDeleteMedia, notify],
  );

  const handleSaveEdit = useCallback(
    async (data: Record<string, unknown>, mediaChanges: MediaChange[]) => {
      try {
        if (store.editingId) {
          await store.update(store.editingId, data);
          await removeReplacedMedia(data, mediaChanges);
          if (activeSection === 'badges') await fetchBadgeOptions();
          store.closeEdit();
          notify('Запись обновлена', 'success');
        }
      } catch (error) {
        notify('Ошибка при сохранении', 'error');
        throw error;
      }
    },
    [store, notify, activeSection, fetchBadgeOptions, removeReplacedMedia],
  );

  const handleSaveCreate = useCallback(
    async (data: Record<string, unknown>) => {
      try {
        await store.create(data);
        if (activeSection === 'badges') await fetchBadgeOptions();
        store.closeCreate();
        notify('Запись создана', 'success');
      } catch (error) {
        notify('Ошибка при создании', 'error');
        throw error;
      }
    },
    [store, notify, activeSection, fetchBadgeOptions],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!store.deleteId) return;
    try {
      const item = store.items.find((candidate) => candidate.id === store.deleteId);
      await store.remove(store.deleteId);
      if (isManagedMediaUrl(item?.cover)) {
        try {
          await handleDeleteMedia(item.cover);
        } catch {
          notify('Запись удалена, но файл обложки удалить не удалось', 'error');
        }
      }
      store.closeDelete();
      notify('Запись удалена', 'success');
    } catch {
      notify('Ошибка при удалении', 'error');
    }
  }, [store, notify, handleDeleteMedia]);

  const handleConfirmBulkDelete = useCallback(async () => {
    try {
      const count = store.selectedIds.length;
      const mediaUrls = store.items
        .filter((item) => store.selectedIds.includes(item.id))
        .map((item) => item.cover)
        .filter(isManagedMediaUrl);
      await store.removeBulk();
      const results = await Promise.allSettled(mediaUrls.map((url) => handleDeleteMedia(url)));
      if (results.some((result) => result.status === 'rejected')) {
        notify('Записи удалены, но часть медиафайлов удалить не удалось', 'error');
      }
      notify(`Удалено записей: ${count}`, 'success');
    } catch {
      notify('Ошибка при удалении', 'error');
    }
  }, [store, notify, handleDeleteMedia]);

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
        className={classNames(
          styles.admin,
          darkMode && styles['admin--dark'],
          styles.admin__loading,
        )}
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
        <AdminHeader
          title={section.label}
          collection={section.collection}
          activeSection={activeSection}
          selectedCount={store.selectedIds.length}
          loading={store.meta === Meta.loading}
          darkMode={darkMode}
          onBulkDelete={() => store.openBulkDelete()}
          onExport={handleExport}
          onToggleTheme={handleToggleTheme}
          onCreate={() => store.openCreate()}
        />

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
        onUploadMedia={handleUploadMedia}
        onDeleteMedia={handleDeleteMedia}
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
        onUploadMedia={handleUploadMedia}
        onDeleteMedia={handleDeleteMedia}
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
