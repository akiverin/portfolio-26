import { Timestamp } from "firebase/firestore";
type GrantIconName = "govScience" | "polytech" | "moscow";

export interface Grant {
  id: string;
  title: string;
  desc: string;
  sum: number;
  startDate: Timestamp;
  endDate: Timestamp;
  icon?: GrantIconName | null;
}

export interface GrantListResponse {
  data: Grant[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
