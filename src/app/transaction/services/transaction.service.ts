import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionDTO } from '../../models/transaction.model';
import { NewTransactionDTO } from '../../models/newTransaction.model';
import { CardResponseDTO } from '../../models/CardResponse.model';
@Injectable({
    providedIn: 'root'
  })
export class TransactionService {
    
    private baseUrl = 'http://localhost:8080'; 

    constructor(private http: HttpClient) {}
  
    getMonthList(month: number): Observable<TransactionDTO[]> {
      const token = localStorage.getItem('jwt_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const params = new HttpParams().set('month', month.toString());
  
      return this.http.get<TransactionDTO[]>(`${this.baseUrl}/transaction/monthList`, { headers, params });
    }

    getAllMovements(): Observable<TransactionDTO[]> {
      const token = localStorage.getItem('jwt_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.get<TransactionDTO[]>(`${this.baseUrl}/movements/all`, { headers });
    }

    // Método para obtener la tarjeta completa (incluyendo el balance)
    getCardInfo(): Observable<CardResponseDTO> {
      const token = localStorage.getItem('jwt_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
      return this.http.get<CardResponseDTO>(`${this.baseUrl}/auth/card`, { headers });
    }

    checkIfCardExists(cardNumber: string): Observable<boolean> {
      const token = localStorage.getItem('jwt_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<boolean>(`${this.baseUrl}/card/exists`,  { headers,
        params: { cardNumber } 
      });
    }
    
    


    

    createTransaction(dto: NewTransactionDTO): Observable<any> {
      const token = localStorage.getItem('jwt_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.baseUrl}/transaction/new`, dto, { headers });
    }

    getMonthSpent(): Observable<number> {
      const token = localStorage.getItem('jwt_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<number>(`${this.baseUrl}/movements/totalMonthSpent`, { headers });
    }

    getMonthIncome() : Observable<number>{
      const token = localStorage.getItem('jwt_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<number>(`${this.baseUrl}/movements/totalMonthIncome`, { headers });

    }
    
}
