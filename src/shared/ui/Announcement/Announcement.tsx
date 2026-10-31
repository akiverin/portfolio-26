import type { ReactNode } from 'react';
import ActionButton from 'shared/ui/ActionButton';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react/dist/csr/X';
import styles from './Announcement.module.scss';

export type AnnouncementProps = {
  open: boolean;
  message: ReactNode;
  title?: string;
  badge?: string;
  icon?: ReactNode;
  onClose?: () => void;
  reserveSidebarSpace?: boolean;
};

const Announcement = ({
  open,
  message,
  title,
  badge,
  icon,
  onClose,
  reserveSidebarSpace = false,
}: AnnouncementProps) => {
  const reducedMotion = useReducedMotion();
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className={styles.container} data-with-sidebar={reserveSidebarSpace || undefined}>
      <AnimatePresence>
        {open && (
          <motion.div
            key="announcement"
            className={styles.notice}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: reducedMotion ? 0 : 6,
              transition: { duration: reducedMotion ? 0.1 : 0.16 },
            }}
            transition={{ duration: reducedMotion ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {icon && (
              <span className={styles.notice__icon} aria-hidden="true">
                {icon}
              </span>
            )}
            <div className={styles.notice__copy}>
              {(title || badge) && (
                <div className={styles.notice__heading}>
                  {title && <span className={styles.notice__title}>{title}</span>}
                  {badge && <span className={styles.notice__badge}>{badge}</span>}
                </div>
              )}
              <div className={styles.notice__message}>{message}</div>
            </div>
            {onClose && (
              <ActionButton
                variant="icon"
                surface="light"
                size="xs"
                className={styles.notice__close}
                onClick={onClose}
                aria-label="Скрыть уведомление"
              >
                <XIcon size={14} aria-hidden="true" />
              </ActionButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};
export default Announcement;
