import React, { createContext, useContext, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';
import styles from './NotificationProvider.module.scss';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type NotifyFn = (message: string, type?: ToastType) => void;

const NotificationContext = createContext<NotifyFn>(() => {});

export const useNotification = (): NotifyFn => useContext(NotificationContext);

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <IconCheck size={18} stroke={2} />,
  error: <IconX size={18} stroke={2} />,
  info: <IconInfoCircle size={18} stroke={2} />,
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify: NotifyFn = useCallback((message, type = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className={styles.container}>
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              layout
            >
              <span className={styles.toast__icon}>{ICONS[toast.type]}</span>
              <span className={styles.toast__message}>{toast.message}</span>
              <button
                type="button"
                className={styles.toast__close}
                onClick={() => dismiss(toast.id)}
                aria-label="Закрыть"
              >
                <IconX size={14} stroke={2} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
