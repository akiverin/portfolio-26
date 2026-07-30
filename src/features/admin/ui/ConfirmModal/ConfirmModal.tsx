import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconAlertTriangle } from '@tabler/icons-react';
import Text from 'shared/ui/Text';
import styles from './ConfirmModal.module.scss';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Удалить',
  loading,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modal__icon}>
              <IconAlertTriangle size={28} stroke={1.5} />
            </div>
            <Text
              id="confirm-modal-title"
              tag="h3"
              view="p-18"
              weight="medium"
              className={styles.modal__title}
            >
              {title}
            </Text>
            <Text view="p-14" className={styles.modal__message}>
              {message}
            </Text>
            <div className={styles.modal__actions}>
              <button
                type="button"
                className={styles.modal__cancelBtn}
                onClick={onCancel}
                disabled={loading}
              >
                <Text tag="span" view="p-14" weight="medium">
                  Отмена
                </Text>
              </button>
              <button
                type="button"
                className={styles.modal__confirmBtn}
                onClick={onConfirm}
                disabled={loading}
              >
                <Text tag="span" view="p-14" weight="medium">
                  {loading ? 'Удаление...' : confirmLabel}
                </Text>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
