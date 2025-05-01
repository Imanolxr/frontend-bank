import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { filter } from 'rxjs/operators';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';


@Component({
  selector: 'app-new-transaction',
  standalone: true,
  animations: [
    trigger('fadeOutOnLeave', [
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ],
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-transaction.component.html',
  styleUrl: './new-transaction.component.css'
})


export class NewTransactionComponent {
  transactionForm: FormGroup;
  availableBalance: number = 5200.00; // Simulado, luego viene de la API
  showTransaction = true;

  constructor(private fb: FormBuilder, private router: Router) {
    this.transactionForm = this.fb.group({
      cardNumber: ['', [Validators.required, this.validateCardNumber]],
      amount: ['', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/),  // hasta 2 decimales
        Validators.min(0.1),
        this.validateAmountAgainstBalance.bind(this)
      ]]
    });

    this.router.events.pipe(
    filter(event => event instanceof NavigationStart)
  ).subscribe(() => {
    this.showTransaction = false;
  });
  }

  validateAmountAgainstBalance(control: any) {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;
  
    return value > this.availableBalance ? { exceedsBalance: true } : null;
  }
  
  

navigateToAnotherPage() {
  this.showTransaction = false;
  setTimeout(() => {
    this.router.navigate(['/otra-ruta']); // esperá la animación y luego navegá
  }, 400);
}




  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\D/g, '');

    if (input.length > 16) {
      input = input.substring(0, 16);
    }

    const formatted = input.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.transactionForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }

  formatAmount(event: any): void {
    let input = event.target.value.replace(/[^0-9.]/g, '');
  
    // Limita a dos decimales
    const parts = input.split('.');
    if (parts.length > 2) {
      input = parts[0] + '.' + parts[1]; // Elimina cualquier punto adicional
    }
    if (parts[1]?.length > 2) {
      parts[1] = parts[1].substring(0, 2);
      input = parts[0] + '.' + parts[1];
    }
  
    this.transactionForm.get('amount')?.setValue(input, { emitEvent: false });
    event.target.value = `$${input}`;
  }
  validateCardNumber(control: any) {
    const value = control.value?.replace(/\s/g, '');
    return value && value.length === 16 ? null : { invalidCard: true };
  }
  

  cardNumberIsInvalid(): boolean {
    const raw = this.transactionForm.get('cardNumber')?.value?.replace(/\s/g, '');
    return raw?.length < 16;
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const { cardNumber, amount } = this.transactionForm.value;
  
      Swal.fire({
        title: '¿Confirmar transacción?',
        html: `<p>¿Deseás enviar <strong>$${amount}</strong> a la tarjeta <strong>${cardNumber}</strong>?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          
          Swal.fire({
            title: '¡Enviado!',
            text: 'La transacción fue realizada con éxito.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
  
          // Resetear formulario
          this.transactionForm.reset();
        }
      });
    }
  }

}
