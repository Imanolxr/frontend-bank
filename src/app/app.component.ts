import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, CommonModule],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Banco Suquia';
  showNavbar: boolean = true;
  showSidebar: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    // Verifica la ruta actual cuando el componente se inicia
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
    this.checkRoute(); // Verifica la ruta inicial
  }

  checkRoute() {
    // Verifica si la ruta es 'login' y oculta las barras
    if (this.router.url === '/login') {
      this.showNavbar = false;
      this.showSidebar = false;
    } else {
      this.showNavbar = true;
      this.showSidebar = true;
    }
  }
}
