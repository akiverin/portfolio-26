import React, { useState, useRef, useEffect, useCallback } from 'react';
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
      >
        <Text view="p-14" weight="medium">
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ArrowDownIcon
          width={16}
          height={16}
          className={classNames(styles.select__arrow, {
            [styles['select__arrow--open']]: isOpen,
          })}
        />
      </button>

      {isOpen && (
        <div className={styles.select__dropdown}>
          {searchable && (
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className={styles.select__search}
            />
          )}
          <ul className={styles.select__options}>
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={classNames(styles.select__option, {
                    [styles['select__option--active']]: option.value === value,
                  })}
                  onClick={() => handleSelect(option.value)}
                >
                  <Text view="p-14">{option.label}</Text>
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
        </div>
      )}
    </div>
  );
};

export default Select;
