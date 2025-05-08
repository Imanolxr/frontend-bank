import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NgClass } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { TransactionService } from '../transaction/services/transaction.service'; 
import { TransactionDTO } from '../models/transaction.model';




@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, NgClass, RouterModule],
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {

  transactions: TransactionDTO[] = [];

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadMovements();

  }

  loadMovements(): void {
    this.transactionService.getAllMovements().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (error) => {
        console.error('Error al cargar los movimientos:', error);
      }
    });
  }

  viewDetails(transaction: any) {
    console.log(transaction); // Aquí puedes hacer que se muestren detalles o redirigir a otra página
  }
}
