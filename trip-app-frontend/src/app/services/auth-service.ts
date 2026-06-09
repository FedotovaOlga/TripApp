import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable, tap } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface AuthenticatedUser {
  accessToken: string;
  refreshToken: string;
  name: string;
  role: string;
  id: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly httpClient = inject(HttpClient);
  private readonly url = `${environment.backendUrl}/auth`;

  user = signal<AuthenticatedUser | undefined>(undefined);

  constructor() {
    effect(() => {
      if (this.user()) {
        localStorage.setItem('user', JSON.stringify(this.user()));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  init() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user.set(JSON.parse(storedUser));
    }
  }

  register(data: {email: string, password: string, displayName: string}): Observable<void> {
    return this.httpClient.post<void>(`${this.url}/register`, data);
  }

  login(email: string, password: string): Observable<void> {
    return this.httpClient.post<AuthResponse>(`${this.url}/password`, {email, password}).pipe(
      tap(({accessToken, refreshToken}) => {
        const decodedToken = jwtDecode<JwtPayload & { name: string, role: string}> (accessToken);
        this.user.set({
          accessToken,
          refreshToken,
          name: decodedToken.name,
          role: decodedToken.role,
          id: decodedToken.sub!
        });
      }),
      map(_ => {})
    )
  }

  logout() {
    this.user.set(undefined);
  }

  refresh() {
    return this.httpClient.post<AuthResponse>(`${this.url}/refresh`, {
      refreshToken: this.user()!.refreshToken
    }).pipe(
      tap(({accessToken, refreshToken}) => {
        this.user.set({
          accessToken,
          refreshToken,
          name: this.user()!.name,
          role: this.user()!.role,id: this.user()!.id
        });
      }),
      map(() => {})
    );
  }
}
