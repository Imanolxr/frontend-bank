import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MonthSpentComponent } from '../components/month-spent/month-spent.component';
import { MonthIncomeComponent } from '../components/month-income/month-income.component';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [MonthSpentComponent, MonthIncomeComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.hasToken()) {
      this.router.navigate(['/login']);
    }
  }

}
