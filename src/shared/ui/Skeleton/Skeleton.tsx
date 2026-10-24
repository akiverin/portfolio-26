import React from 'react';
import styles from './Skeleton.module.scss';
import classNames from 'classnames';

export type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  /** Use the higher-contrast variant on dark showcase surfaces. */
  light?: boolean;
  className?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius, light, className }) => (
  <div
    className={classNames(styles.skeleton, light && styles['skeleton--light'], className)}
    style={{ width, height, borderRadius }}
  />
);

export default Skeleton;
