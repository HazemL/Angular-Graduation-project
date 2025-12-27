import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Users } from '../../services/users';
import { CraftsService } from '../../services/crafts-service';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  usersCount: number = 0;
  craftsCount: number = 0;
  reportsCount: number = 0;
  adminProfile: any = {
    name: 'Admin',
    image: 'assets/images/default-avatar.png'
  };
  private baseUrl = 'http://localhost:3000/';
  
  constructor(public router: Router, private usersService: Users, private craftsService: CraftsService, private reportsService: ReportsService) {}
  
  ngOnInit() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.usersCount = data.length;
        // Get admin user (assuming admin is first user or has specific role)
        const admin = data.find(user => user.role === 'admin') || data[0];
        if (admin) {
          this.adminProfile = {
            name: admin.fullName || 'Admin',
            image: admin.image ? `${this.baseUrl}${admin.image}` : 'assets/images/default-avatar.png'
          };
        }
      },
      error: (err) => console.error('Error fetching users:', err)
    });
    
    this.craftsService.getCrafts().subscribe({
      next: (data) => {
        const craftsData = Array.isArray(data) ? data : (data?.data ?? []);
        this.craftsCount = craftsData.length;
      },
      error: (err) => console.error('Error fetching crafts:', err)
    });
    
    this.reportsService.getReports().subscribe({
      next: (reports: any) => {
        const reportsData = Array.isArray(reports) ? reports : (reports?.data ?? []);
        this.reportsCount = reportsData.length;
      },
      error: (err) => console.error('Error fetching reports:', err)
    });
  }
  
  isMainDashboard(): boolean {
    return this.router.url === '/dashboard';
  }
}
