import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true, 
  imports: [CommonModule],   
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  show = true;


  constructor(private router: Router) { }

  isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  logout() {
    localStorage.removeItem('authToken'); // Eliminar el token de localStorage
    this.router.navigate(['/login']); // Redirigir al login
  }
}
