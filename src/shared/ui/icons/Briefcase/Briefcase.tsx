import * as React from 'react';
import Icon, { IconProps } from 'shared/ui/Icon';

const Briefcase: React.FC<IconProps> = (props) => {
  return (
    <Icon viewBox="0 0 256 256" {...props}>
      <path
        fill="currentColor"
        d="M216,60H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48V60H40A20,20,0,0,0,20,80V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V80A20,20,0,0,0,216,60ZM104,48h48V60H104ZM44,84H212v40H44Zm0,112V148H100v12a12,12,0,0,0,24,0V148h68v48Z"
      />
    </Icon>
  );
};

export default Briefcase;
