import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from '@phosphor-icons/react/dist/csr/X';
import styles from './Announcement.module.scss';

export type AnnouncementProps = {
  open: boolean;
  message: string;
  badge?: string;
  onClose?: () => void;
  reserveSidebarSpace?: boolean;
};

const Announcement: React.FC<AnnouncementProps> = ({
  open,
  message,
  badge = 'New',
  onClose,
  reserveSidebarSpace = false,
}) => {
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
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: reducedMotion ? 0 : 10,
              scale: reducedMotion ? 1 : 0.985,
              transition: { duration: reducedMotion ? 0.12 : 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={
              reducedMotion
                ? { duration: 0.15 }
                : { type: 'spring', stiffness: 270, damping: 28, mass: 0.85 }
            }
          >
            <span className={styles.notice__badge} aria-hidden="true">
              <span>{badge}</span>
            </span>
            <span className={styles.notice__message}>{message}</span>
            {onClose && (
              <button
                type="button"
                className={styles.notice__close}
                onClick={onClose}
                aria-label="Скрыть уведомление"
              >
                <XIcon size={15} weight="bold" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};

export default Announcement;
