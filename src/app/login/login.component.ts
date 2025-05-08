import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializar formulario de login
    this.loginForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      pin: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const { cardNumber, pin } = this.loginForm.value;

console.log('Intentando login con:', { cardNumber, pin: '****' });

this.authService.login(cardNumber, pin).subscribe({
  next: (response) => {
    console.log('Login exitoso, respuesta completa:', response);
    this.isLoading = false;
    setTimeout(() => {
      this.router.navigate(['/index']);
    }, 100);
    
  },
  error: (error) => {
    this.isLoading = false;
    if (error.status === 401) {
      this.errorMessage = 'Número de tarjeta o PIN incorrecto';
    } else if (error.status === 0) {
      this.errorMessage = 'Error de conexión al servidor. Verifique su conexión a Internet.';
    } else if (error.error && error.error.message) {
      this.errorMessage = `Error: ${error.error.message}`;
    } else {
      this.errorMessage = `Error al iniciar sesión (${error.status || 'desconocido'}). Intente nuevamente.`;
    }
  }
});
  }
}