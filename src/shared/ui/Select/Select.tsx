import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Select.module.scss';
import classNames from 'classnames';
import Text from 'shared/ui/Text';
import ArrowDownIcon from 'shared/ui/icons/ArrowDownIcon';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  className?: string;
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -4, scaleY: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -4,
    scaleY: 0.95,
    transition: { duration: 0.12, ease: 'easeIn' as const },
  },
};

const Select: React.FC<SelectProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Выберите...',
  searchable = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownId = useId();

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions =
    searchable && search
      ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
      : options;

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSearch('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className={classNames(styles.select, className)}>
      <button
        type="button"
        className={classNames(styles.select__trigger, {
          [styles['select__trigger--open']]: isOpen,
        })}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={dropdownId}
      >
        <Text view="p-14" weight="medium">
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <motion.span
          className={styles.select__arrow}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <ArrowDownIcon width={16} height={16} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.select__dropdown}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: 'top center' }}
            id={dropdownId}
          >
            {searchable && (
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск..."
                className={styles.select__search}
                aria-label="Поиск по вариантам"
              />
            )}
            <ul className={styles.select__options} role="listbox">
              {filteredOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={classNames(styles.select__option, {
                      [styles['select__option--active']]: option.value === value,
                    })}
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <Text view="p-14">{option.label}</Text>
                    {option.value === value && (
                      <motion.span
                        className={styles.select__check}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className={styles.select__empty}>
                  <Text view="p-14" color="secondary">
                    Ничего не найдено
                  </Text>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
