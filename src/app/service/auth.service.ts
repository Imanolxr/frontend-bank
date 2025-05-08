import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Ajusta la URL según tu backend
  private tokenKey = 'jwt_token';
  private userKey = 'current_user';
  private inactivityTimer: any;
  private isBrowser: boolean;
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Solo intentar acceder a localStorage si estamos en el navegador
    if (this.isBrowser) {
      this.isAuthenticatedSubject.next(this.hasToken());
    }
  }

  login(cardNumber: string, pin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { cardNumber, pin })
      .pipe(
        tap(response => {
          if (response && response.token && this.isBrowser) {
            // Guardar token solo si estamos en el navegador
            localStorage.setItem(this.tokenKey, response.token);
            
            // Guardar información del usuario si está disponible
            if (response.user) {
              localStorage.setItem(this.userKey, JSON.stringify(response.user));
            }
            
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    // Limpiar el temporizador si existe
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    
    // Limpiar storage solo si estamos en el navegador
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
    
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    // Acceder a localStorage solo si estamos en el navegador
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getCurrentUser(): any {
    // Acceder a localStorage solo si estamos en el navegador
    if (this.isBrowser) {
      const userJson = localStorage.getItem(this.userKey);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  getUserInfo(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }
  
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    return this.http.get<any>(`${this.apiUrl}/auth/me`, { headers });
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  }
  
  // Método para resetear el temporizador de inactividad
  resetInactivityTimer(timeout: number): void {
    // Solo en el navegador
    if (!this.isBrowser) return;
    
    // Limpiar el temporizador existente si hay uno
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    
    // Establecer un nuevo temporizador solo si el usuario está autenticado
    if (this.isAuthenticated()) {
      this.inactivityTimer = setTimeout(() => {
        this.logout();
      }, timeout);
    }
  }
}