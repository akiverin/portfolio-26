import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconDownload, IconChevronDown } from '@tabler/icons-react';
import styles from './ExportDropdown.module.scss';

type TimeRange = 'year' | '2years' | 'all';
type ExportFormat = 'csv' | 'excel' | 'txt' | 'zip';

type ExportDropdownProps = {
  onExport: (range: TimeRange, format: ExportFormat) => void;
  loading?: boolean;
};

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: 'year', label: 'За последний год' },
  { value: '2years', label: 'За последние 2 года' },
  { value: 'all', label: 'За все время' },
];

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'txt', label: 'TXT' },
  { value: 'zip', label: 'ZIP (с фото)' },
];

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport, loading }) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<TimeRange>('all');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={styles.export} ref={ref}>
      <button
        type="button"
        className={styles.export__trigger}
        onClick={() => setOpen(!open)}
        disabled={loading}
      >
        <IconDownload size={16} stroke={1.5} />
        Экспорт
        <IconChevronDown size={14} stroke={2} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.export__dropdown}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            <div className={styles.export__section}>
              <span className={styles.export__sectionTitle}>Период</span>
              {TIME_RANGES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`${styles.export__option} ${range === r.value ? styles['export__option--active'] : ''}`}
                  onClick={() => setRange(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className={styles.export__divider} />
            <div className={styles.export__section}>
              <span className={styles.export__sectionTitle}>Формат</span>
              <div className={styles.export__formats}>
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={styles.export__formatBtn}
                    onClick={() => {
                      onExport(range, f.value);
                      setOpen(false);
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportDropdown;
