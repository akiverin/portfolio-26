import * as React from 'react';
import Icon, { IconProps } from 'shared/ui/Icon';

const ArrowLeft: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <g clipPath="url(#clip0_2067_2637)">
        <ellipse
          cx="12"
          cy="12"
          rx="12"
          ry="12"
          transform="rotate(-180 12 12)"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <g clipPath="url(#clip1_2067_2637)">
          <path
            d="M13.7551 9.8397L11.3934 12.2013L13.7551 14.563C13.9925 14.8003 13.9925 15.1838 13.7551 15.4212C13.5177 15.6586 13.1342 15.6586 12.8969 15.4212L10.1031 12.6274C9.86569 12.39 9.86569 12.0066 10.1031 11.7692L12.8969 8.9754C13.1342 8.73802 13.5177 8.73802 13.7551 8.9754C13.9864 9.21278 13.9925 9.60232 13.7551 9.8397Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_2067_2637">
          <rect width="24" height="24" fill="white" transform="translate(24 24) rotate(-180)" />
        </clipPath>
        <clipPath id="clip1_2067_2637">
          <rect width="20.4055" height="20.5714" fill="white" transform="translate(22.2329 1.79736) rotate(90)" />
        </clipPath>
      </defs>
    </Icon>
  );
};

export default ArrowLeft;
