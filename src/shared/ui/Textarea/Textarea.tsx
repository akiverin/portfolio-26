import React from 'react';
import styles from './Textarea.module.scss';
import classNames from 'classnames';
import Text from 'shared/ui/Text';

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  showTitle?: boolean;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, onChange, showTitle = false, className, ...props }: TextareaProps, ref) => {
    return (
      <div className={classNames(styles['textarea-container'], className)}>
        {showTitle && (
          <div className={styles.textarea__title}>
            <Text color="secondary">{props.placeholder}</Text>
          </div>
        )}

        <textarea
          ref={ref}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
          {...props}
          placeholder={showTitle ? '' : props.placeholder}
        />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
