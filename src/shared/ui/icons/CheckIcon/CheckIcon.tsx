import * as React from 'react'
import Icon, { IconProps } from 'shared/ui/Icon';

const CheckIcon: React.FC<IconProps> = (props: IconProps) => {
    return (
        <Icon {...props}>
            <path d="M4 11.6129L9.87755 18L20 7" stroke="currentColor" strokeWidth="2" />
        </Icon>
    )
}

export default CheckIcon;
