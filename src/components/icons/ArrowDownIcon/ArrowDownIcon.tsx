import * as React from 'react';
import Icon, { IconProps } from '../Icon';

const ArrowDownIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path
        d="M9.22595 10.2094L12.0036 12.987L14.7812 10.2094C15.0604 9.9302 15.5114 9.9302 15.7906 10.2094C16.0698 10.4886 16.0698 10.9396 15.7906 11.2188L12.5047 14.5047C12.2255 14.7839 11.7745 14.7839 11.4953 14.5047L8.2094 11.2188C7.9302 10.9396 7.9302 10.4886 8.2094 10.2094C8.48859 9.93736 8.94676 9.9302 9.22595 10.2094Z"
        fill="currentColor"
      />
    </Icon>
  );
};

export default ArrowDownIcon;
