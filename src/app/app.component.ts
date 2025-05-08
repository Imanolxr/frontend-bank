import { Component, OnInit, HostListener, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { AuthService } from './service/auth.service';
import { HttpClientModule } from '@angular/common/http';

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
    HttpClientModule 
  ],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', 
          style({
            position: 'absolute', 
            width: '100%', 
            top: 0, 
            left: 0, 
            opacity: 0, 
            visibility: 'hidden' 
          }), 
          { optional: true }
        ),
        group([
          query(':leave', [
            animate('500ms ease-out', style({
              opacity: 0,
              visibility: 'hidden',
              transform: 'translateY(30px)'
            }))
          ], { optional: true }),
          query(':enter', [
            style({
              opacity: 0,
              visibility: 'visible',
              transform: 'translateY(30px)'
            }),
            animate('500ms ease-out', style({
              opacity: 1,
              transform: 'translateY(0)'
            }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  private readonly INACTIVITY_TIMEOUT = 30000; // 30 segundos
  title = 'Banco Suquia';
  showNavbar: boolean = true;
  showSidebar: boolean = true;
  private isBrowser: boolean;

  constructor(
    private router: Router, 
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnInit() {
    // Solo realizar verificaciones de autenticación en el navegador
    if (this.isBrowser) {
      // Verificar autenticación al inicio
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
      
      // Iniciar el temporizador de inactividad
      this.resetInactivityTimer();
    }
    
    // Suscribirse a los eventos del router
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
    
    // Verificar la ruta inicial
    this.checkRoute();
  }

  ngOnDestroy() {
    // Si hay algún temporizador, limpiarlo al destruir el componente
    if (this.isBrowser) {
      this.authService.logout();
    }
  }

  checkRoute() {
    // Verificar si estamos en la página de login
    const isLoginPage = this.router.url === '/login';
    this.showNavbar = !isLoginPage;
    this.showSidebar = !isLoginPage;
  }

  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  @HostListener('document:wheel')
  onActivity(): void {
    if (this.isBrowser) {
      this.resetInactivityTimer();
    }
  }

  private resetInactivityTimer(): void {
    // Usar el método centralizado en el servicio
    this.authService.resetInactivityTimer(this.INACTIVITY_TIMEOUT);
  }

  @HostListener('window:beforeunload')
  unloadNotification(): void {
    // Solo ejecutar en el navegador
    if (this.isBrowser) {
      // Cerrar sesión al cerrar la ventana
      this.authService.logout();
    }
  }
}