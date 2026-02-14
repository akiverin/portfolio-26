export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role?: string | null;
  createdAt?: { seconds: number; nanoseconds: number } | null;
}
