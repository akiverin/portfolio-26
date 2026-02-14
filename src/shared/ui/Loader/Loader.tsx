import React from 'react';
import styles from './Loader.module.scss';
import classNames from 'classnames';

export type LoaderProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
};

const Loader: React.FC<LoaderProps> = ({ size, className }) => {
  return (
    <div
      className={classNames(
        styles.loader,
        size === 's' && styles['loader--small'],
        size === 'm' && styles['loader--medium'],
        className,
      )}
    >
      <div className={styles.loader__circle} />
    </div>
  );
};

export default Loader;
