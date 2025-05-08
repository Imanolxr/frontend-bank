import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true, 
  imports: [CommonModule],   
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  show = true;
  username: string = '';


  constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {
    if (this.authService.hasToken()) {
      this.authService.getUserInfo().subscribe({
        next: (user) => {
          this.username = `${this.capitalize(user.name)} ${this.capitalize(user.lastName)}`;
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario:', err);
        }
      });
    }
  }
  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  

  isAuthenticated(): boolean {
    return localStorage.getItem('jwt_token') !== null;
  }

  logout() {
    localStorage.removeItem('jwt_token'); // Eliminar el token de localStorage
    localStorage.removeItem('current_user');
    this.router.navigate(['/login']); // Redirigir al login
  }
}
