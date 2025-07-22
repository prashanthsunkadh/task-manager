import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, tap, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private router: Router) {}

  login(username: string, password: string) {
    // Simulate API call
    return of({ token: `fake-token-for-${username}` }).pipe(
      delay(500), // Simulate network latency
      tap(response => localStorage.setItem('authToken', response.token))
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}