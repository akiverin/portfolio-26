import * as React from 'react';
import Icon, { IconProps } from 'shared/ui/Icon';

const Auth: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <g clipPath="url(#clip0_2004_664)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 23.5C18.0751 23.5 23 18.5751 23 12.5C23 6.42487 18.0751 1.5 12 1.5C5.92487 1.5 1 6.42487 1 12.5C1 18.5751 5.92487 23.5 12 23.5ZM14.5629 9.07143C14.5629 10.4943 13.4229 11.6429 12 11.6429C10.5771 11.6429 9.42857 10.4943 9.42857 9.07143C9.42857 7.64857 10.5771 6.5 12 6.5C13.4229 6.5 14.5629 7.64857 14.5629 9.07143ZM6 16.3571C6 14.36 10.0029 13.3571 12 13.3571C13.9971 13.3571 18 14.36 18 16.3571V17.6429C18 18.1143 17.6143 18.5 17.1429 18.5H6.85714C6.38571 18.5 6 18.1143 6 17.6429V16.3571Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2004_664">
          <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </Icon>
  );
};

export default Auth;
