import { Injectable } from '@angular/core';
import { SessionUser } from '../model/auth.model';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getUser(): SessionUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  }
  setUser(user: SessionUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  clearAll(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}