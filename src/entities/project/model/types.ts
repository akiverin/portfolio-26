import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  desc: string;
  date: Timestamp;
  coverType: string;
  cover: string;
  link?: string;
  github?: string;
  behance?: string;
}
