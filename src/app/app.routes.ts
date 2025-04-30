import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index/index.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'index', component: IndexComponent, canActivate: [AuthGuard] },
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard] }
];
