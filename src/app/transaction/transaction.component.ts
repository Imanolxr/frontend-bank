import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionDTO } from './transaction.model';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit{
  


  transactions: TransactionDTO[] = [];

  ngOnInit(): void {
    this.transactions = [
      {
        amount: 200,
        dateTime: '2025-05-01T14:30:00',
        originCard: '1234567890123456',
        nameOriginCard: 'Juan Pérez',
        destinyCard: '6543210987654321',
        nameDestinyCard: 'María Gómez',
        credit: false
      },
      {
        amount: 500,
        dateTime: '2025-04-29T10:00:00',
        originCard: '1234567890123456',
        nameOriginCard: 'Juan Pérez',
        destinyCard: '1111222233334444',
        nameDestinyCard: 'Carlos Ruiz',
        credit: false
      }
    ];
  }

  
  
  
}

