import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NgClass } from '@angular/common'; 
import { RouterModule } from '@angular/router';




@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, NgClass, RouterModule],
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {

  transactions = [
    {
      movement: {
        dateTime: '2025-04-29T10:00:00',
        originCard: '1234 5678 9876 5432',
        nameOriginCard: 'Tarjeta Banco',
        destinyCard: '2345 6789 8765 4321',
        nameDestinyCard: 'Tarjeta Suquia',
        amount: 1500.00,
      },
      credit: true // Movimiento recibido
    },
    {
      movement: {
        dateTime: '2025-05-01T14:30:00',
        originCard: '2345 6789 8765 4321',
        nameOriginCard: 'Tarjeta Suquia',
        destinyCard: '1234 5678 9876 5432',
        nameDestinyCard: 'Tarjeta Banco',
        amount: 2000.00,
      },
      credit: false // Movimiento realizado
    }
    // Agrega más transacciones según sea necesario
  ];

  constructor() { }

  ngOnInit(): void {
  }

  viewDetails(transaction: any) {
    console.log(transaction); // Aquí puedes hacer que se muestren detalles o redirigir a otra página
  }
}
