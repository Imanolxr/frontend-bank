import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { NewTransactionDTO } from '../models/newTransaction.model';


import Swal from 'sweetalert2';
import { filter } from 'rxjs/operators';
import { TransactionService } from '../transaction/services/transaction.service';
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
  styleUrls: ['./new-transaction.component.css']
})

export class NewTransactionComponent implements OnInit {
  originCardNumber: string = '';
  transactionForm: FormGroup;
  availableBalance: number = 0; 
  showTransaction = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.fb.group({
      cardNumber: ['', [Validators.required, this.validateCardNumber]],
      amount: ['', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/), // Hasta 2 decimales
        Validators.min(0.1),
        this.validateAmountAgainstBalance.bind(this)
      ]]
    });
  }

  ngOnInit() {
    this.getCardBalance(); // Llamar la API para obtener el saldo de la tarjeta
  }


  // Validación del monto contra el saldo disponible
  validateAmountAgainstBalance(control: any) {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;
    return value > this.availableBalance ? { exceedsBalance: true } : null;
  }

  // Validación del número de tarjeta
  validateCardNumber(control: any) {
    const value = control.value?.replace(/\s/g, '');
    return value && value.length === 16 ? null : { invalidCard: true };
  }

  // Verificar si el número de tarjeta es inválido
  cardNumberIsInvalid(): boolean {
    const raw = this.transactionForm.get('cardNumber')?.value?.replace(/\s/g, '');
    return raw?.length < 16;
  }

  // Formatear número de tarjeta
  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos

    if (input.length > 16) {
      input = input.substring(0, 16); // Limitar a 16 caracteres
    }

    const formatted = input.replace(/(\d{4})(?=\d)/g, '$1 '); // Formato 4 dígitos por grupo
    this.transactionForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }



  checkCardExists(): void {
    const rawCardNumber = this.transactionForm.get('cardNumber')?.value?.replace(/\s/g, '');
    
    if (rawCardNumber?.length === 16) {
      this.transactionService.checkIfCardExists(rawCardNumber).subscribe(
        (exists) => {
          if (!exists) {
            Swal.fire({
              icon: 'error',
              title: 'Número de tarjeta inválido',
              text: 'La tarjeta ingresada no está registrada.',
              confirmButtonColor: '#d33'
            });
            this.transactionForm.get('cardNumber')?.setErrors({ notExists: true });
          } else {
            // Limpiar el error si existe
            this.transactionForm.get('cardNumber')?.setErrors(null);
          }
        },
        (error) => {
          console.error('Error verificando tarjeta:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al verificar la tarjeta',
            text: 'Intente nuevamente más tarde.',
            confirmButtonColor: '#d33'
          });
        }
      );
    }
  }
  

  // Obtener el saldo de la tarjeta
  getCardBalance() {
    this.transactionService.getCardInfo().subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        this.originCardNumber = response.cardNumber;
        this.availableBalance = response.balance;
      },
      (error) => {
        console.error('Error al obtener los datos de la tarjeta:', error);
        if (error.status === 401) {
          console.error('Error de autenticación: token inválido');
        }
      }
    );
  }

  

  // Formatear monto
  formatAmount(event: any): void {
    let input = event.target.value.replace(/[^0-9.]/g, ''); // Eliminar caracteres no numéricos
  
    // Limitar a dos decimales
    const parts = input.split('.');
    if (parts.length > 2) {
      input = parts[0] + '.' + parts[1]; // Eliminar puntos adicionales
    }
    if (parts[1]?.length > 2) {
      parts[1] = parts[1].substring(0, 2); // Limitar a 2 decimales
      input = parts[0] + '.' + parts[1];
    }
  
    this.transactionForm.get('amount')?.setValue(input, { emitEvent: false });
    event.target.value = `$${input}`; // Mostrar como moneda
  }

  // Enviar la transacción
  onSubmit(): void {
    if (this.transactionForm.valid) {
      const rawCardNumber = this.transactionForm.get('cardNumber')?.value;
      const cleanCardNumber = rawCardNumber.replace(/\s/g, '');
      
      // Verificar que no sea la misma tarjeta
      if (cleanCardNumber === this.originCardNumber) {
        Swal.fire({
          icon: 'error',
          title: 'Operación inválida',
          text: 'No puedes transferir dinero a tu propia tarjeta.',
          confirmButtonColor: '#d33'
        });
        return;
      }
  
      const amount = this.transactionForm.get('amount')?.value;
  
      const transaction: NewTransactionDTO = {
        originCardNumber: this.originCardNumber,
        destinyCardNumber: cleanCardNumber,
        amount: parseFloat(amount)
      };
      
      console.log('Enviando transacción:', transaction);
      

  
      Swal.fire({
        title: '¿Confirmar transacción?',
        html: `<p>¿Deseás enviar <strong>$${amount}</strong> a la tarjeta <strong>${cleanCardNumber}</strong>?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          // Enviar al backend
          this.transactionService.createTransaction(transaction).subscribe({
            next: () => {
              Swal.fire({
                title: '¡Enviado!',
                text: 'La transacción fue realizada con éxito.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
              this.transactionForm.reset();
              // Actualizar el saldo después de la transacción
              this.getCardBalance();
            },
            error: (err) => {
              console.error('Error al enviar la transacción:', err);
              Swal.fire({
                title: 'Error',
                text: err.error.message || 'Ocurrió un error al procesar la transacción.',
                icon: 'error'
              });
            }
          });
        }
      });
    }
  }
}