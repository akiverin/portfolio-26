import React, { useState } from 'react';
import { IconVideo } from '@tabler/icons-react';
import styles from './VideoWithFallback.module.scss';

type VideoWithFallbackProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  fallbackClassName?: string;
};

const VideoWithFallback: React.FC<VideoWithFallbackProps> = ({
  fallbackClassName,
  className,
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !props.src) {
    return (
      <div className={`${styles.fallback} ${fallbackClassName ?? className ?? ''}`}>
        <IconVideo size={28} stroke={1.2} className={styles.fallback__icon} />
      </div>
    );
  }

  return (
    <video {...props} className={className} onError={() => setError(true)} />
  );
};

export default VideoWithFallback;
