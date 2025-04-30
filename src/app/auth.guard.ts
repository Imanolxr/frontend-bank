import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Comprobar si estamos en el navegador antes de acceder a localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken'); // Obtener el token desde localStorage

      if (token) {
        return true; // El usuario está autenticado
      } else {
        // Si no hay token, redirigir al login
        this.router.navigate(['/login']);
        return false;
      }
    }

    // En caso de que no estemos en el navegador, bloquear el acceso
    return false;
  }
}
