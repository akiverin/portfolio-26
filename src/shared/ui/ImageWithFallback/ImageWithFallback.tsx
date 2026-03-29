import React, { useState } from 'react';
import { IconPhoto } from '@tabler/icons-react';
import styles from './ImageWithFallback.module.scss';

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackClassName?: string;
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallbackClassName,
  className,
  alt,
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !props.src) {
    return (
      <div className={`${styles.fallback} ${fallbackClassName ?? className ?? ''}`}>
        <IconPhoto size={24} stroke={1.2} className={styles.fallback__icon} />
      </div>
    );
  }

  return (
    <img
      {...props}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default ImageWithFallback;
