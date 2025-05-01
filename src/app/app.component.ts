import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common'; 

import {
  trigger,
  transition,
  style,
  animate,
  query,
  group
} from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    NavbarComponent, 
    SidebarComponent, 
    CommonModule,  
    
    
  ],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        // Definir estilos de entrada y salida
        query(':enter, :leave', 
          style({
            position: 'absolute', 
            width: '100%', 
            top: 0, 
            left: 0, 
            opacity: 0,  // Empieza invisible
            visibility: 'hidden' // Iniciar oculto
          }), 
          { optional: true }
        ),
        
        group([
          // Animación de salida
          query(':leave', [
            animate('500ms ease-out', style({
              opacity: 0,
              visibility: 'hidden', // Desaparece cuando se va
              transform: 'translateY(30px)' // Un pequeño movimiento al salir
            }))
          ], { optional: true }),
  
          // Animación de entrada
          query(':enter', [
            style({
              opacity: 0,
              visibility: 'visible', // Hace visible el componente
              transform: 'translateY(30px)' // Empieza desplazado para el efecto
            }),
            animate('500ms ease-out', style({
              opacity: 1,
              transform: 'translateY(0)' // Regresa al lugar
            }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Banco Suquia';
  showNavbar: boolean = true;
  showSidebar: boolean = true;

  constructor(private router: Router) { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
    this.checkRoute();
  }

  checkRoute() {
    if (this.router.url === '/login') {
      this.showNavbar = false;
      this.showSidebar = false;
    } else {
      this.showNavbar = true;
      this.showSidebar = true;
    }
  }
}
