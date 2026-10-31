import { useId } from 'react';
import styles from './SegmentedControl.module.scss';

type Props = {
  label: string;
  value: string;
  options: readonly { value: string; label: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
};

/** Native radio semantics include arrow-key navigation and a single Tab stop. */
export default function SegmentedControl({
  label,
  value,
  options,
  onChange,
  disabled,
  compact,
  fullWidth,
}: Props) {
  const name = useId();
  return (
    <fieldset
      className={styles.segmented}
      disabled={disabled}
      data-compact={compact || undefined}
      data-full-width={fullWidth || undefined}
    >
      <legend className={styles.segmented__legend}>{label}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles.segmented__option}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
