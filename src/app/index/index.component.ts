import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']); // Si no hay token, redirige a login
    }
  }

}
