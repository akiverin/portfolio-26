import { forwardRef, type SelectHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './Select.module.scss';

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'onChange' | 'children'
> & {
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

/** Native picker preserves keyboard navigation, type-ahead and mobile selection. */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { value, options, onChange, placeholder = 'Выберите', className, ...props },
  ref,
) {
  return (
    <div className={classNames(styles.select, className)}>
      <select ref={ref} value={value} onChange={(event) => onChange(event.target.value)} {...props}>
        {!options.some((option) => option.value === '') && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.select__chevron} aria-hidden="true" />
    </div>
  );
});
export default Select;
