import * as React from 'react';
import Icon, { IconProps } from 'shared/ui/Icon';

const Favorite: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <g clipPath="url(#clip0_2004_659)">
        <path d="M17 3.5H7C5.9 3.5 5 4.4 5 5.5V21.5L12 18.5L19 21.5V5.5C19 4.4 18.1 3.5 17 3.5Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_2004_659">
          <rect width="24" height="24" fill="currentColor" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </Icon>
  );
};

export default Favorite;
