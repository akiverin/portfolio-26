import React from 'react';
import { motion } from 'framer-motion';
import styles from './AnimatedCheckbox.module.scss';
import classNames from 'classnames';

export type AnimatedCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const tickVariants = {
  unchecked: { pathLength: 0, opacity: 0 },
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
};

const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
  className,
  disabled,
}) => {
  return (
    <label
      className={classNames(styles.checkbox, className, {
        [styles['checkbox--disabled']]: disabled,
      })}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.checkbox__input}
        disabled={disabled}
      />
      <motion.div
        className={styles.checkbox__box}
        animate={checked ? 'checked' : 'unchecked'}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className={styles.checkbox__svg}
        >
          <motion.path
            d="M5 12.5L10 17.5L19 6.5"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={tickVariants}
          />
        </motion.svg>
      </motion.div>
      {label && <span className={styles.checkbox__label}>{label}</span>}
    </label>
  );
};

export default AnimatedCheckbox;
