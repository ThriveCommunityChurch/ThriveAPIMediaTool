import { User } from './User';

export interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
}
