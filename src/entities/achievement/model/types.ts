import { Timestamp } from 'firebase/firestore';

export interface Badge {
  id: string;
  title: string;
  color?: string;
  icon?: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  date: Timestamp;
  cover: string;
  coverType?: 'image' | 'video';
  link?: string;
  badges?: Badge[];
}
