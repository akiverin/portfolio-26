import type { FC, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './AnimatedCheckbox.module.scss';
export type AnimatedCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  className?: string;
  disabled?: boolean;
};
const AnimatedCheckbox: FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
  className,
  disabled,
}) => (
  <label className={classNames(styles.checkbox, className)}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      disabled={disabled}
    />
    {label && <span>{label}</span>}
  </label>
);
export default AnimatedCheckbox;
