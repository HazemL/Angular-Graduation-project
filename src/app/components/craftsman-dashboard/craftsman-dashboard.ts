import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';


@Component({
  selector: 'app-craftsman-dashboard',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './craftsman-dashboard.html',
  styleUrl: './craftsman-dashboard.css',
})
export class CraftsmanDashboard {
  constructor(public router: Router) {}
  
  isMainDashboard(): boolean {
    return this.router.url === '/craftsman-dashboard';
  }
}
