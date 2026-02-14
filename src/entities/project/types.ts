import { Timestamp } from "firebase/firestore";

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

export interface ProjectListResponse {
  data: Project[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
