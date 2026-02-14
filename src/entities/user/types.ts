import { DocumentReference } from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role?: string | null;
  createdAt?: { seconds: number; nanoseconds: number } | null;
}

export interface UserListResponse {
  data: User[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
