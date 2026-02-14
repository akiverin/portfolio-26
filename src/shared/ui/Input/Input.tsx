import React from 'react';
import styles from './Input.module.scss';
import classNames from 'classnames';
import Text from 'shared/ui/Text';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onChange: (value: string) => void;
  afterSlot?: React.ReactNode;
  showTitle?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, afterSlot, onChange, showTitle = false, className, ...props }: InputProps, ref) => {
    return (
      <div
        className={classNames(styles['input-container'], className, {
          [styles['input-container--icon']]: afterSlot,
        })}
      >
        {showTitle && (
          <div className={styles.input__title}>
            <Text color="secondary">{props.placeholder}</Text>
          </div>
        )}

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          {...props}
          placeholder={showTitle ? '' : props.placeholder}
        />
        {afterSlot}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
