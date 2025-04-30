import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  
})
export class LoginComponent {
  cardNumber: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.cardNumber === '1234567812345678' && this.password === '1234') {
      // Guardar token ficticio en localStorage
      localStorage.setItem('authToken', 'faketoken'); // Guarda el token
  
      // Redirigir al usuario a la página de índice
      this.router.navigate(['/index']);
    } else {
      alert('Número de tarjeta o PIN incorrecto');
    }
  }
  
  
}