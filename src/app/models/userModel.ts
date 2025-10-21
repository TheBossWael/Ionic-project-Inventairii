// src/app/models/user.model.ts
export interface User {
  uid: string;
  email: string;
  Username: string;
  role: 'admin' | 'manager' | 'employee';
}
