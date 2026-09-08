import { Timestamp } from 'firebase/firestore';

type GrantIconName = 'govScience' | 'polytech' | 'moscow' | 'alfa';

export interface Grant {
  id: string;
  title: string;
  desc: string;
  sum: number;
  startDate: Timestamp;
  endDate: Timestamp;
  icon?: GrantIconName | null;
}
