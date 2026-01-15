import { Role } from './role';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: Role;
}