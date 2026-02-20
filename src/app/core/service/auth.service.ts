import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { TokenStorageService } from './token-storage.service';
import { endpoints } from '../api/endpoints';
import { LoginRequest, LoginResponse, SessionUser, RoleName } from '../model/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<SessionUser | null>(this.storage.getUser());
  user$ = this.userSubject.asObservable();

  constructor(
    private api: ApiClientService,
    private storage: TokenStorageService
  ) {}

  get isLoggedIn(): boolean {
    return !!this.storage.getToken();
  }

  get currentUser(): SessionUser | null {
    return this.userSubject.value;
  }

  login(role: string, payload: LoginRequest): Observable<SessionUser> {
    return this.api.post<LoginResponse>(endpoints.login(role), payload).pipe(
      map((res) => {
        const u = res.user;
        const sessionUser: SessionUser = {
          id: u.id,
          full_name: u.full_name,
          email: u.email,
          role_name: u.role?.role_name ?? 'Unknown',
          user_role_id: u.user_role_id,
        };
        return { sessionUser, token: res.token };
      }),
      tap(({ sessionUser, token }) => {
        this.storage.setToken(token);
        this.storage.setUser(sessionUser);
        this.userSubject.next(sessionUser);
      }),
      map(({ sessionUser }) => sessionUser)
    );
  }

  logout(): void {
    this.storage.clearAll();
    this.userSubject.next(null);
  }

  hasRole(allowed: RoleName[]): boolean {
    const u = this.currentUser;
    return !!u && allowed.includes(u.role_name);
  }
}