import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { CraftsProfileService } from '../../services/crafts-profile-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-craftsman-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './craftsman-dashboard.html',
  styleUrls: ['./craftsman-dashboard.css'],
})
export class CraftsmanDashboard implements OnInit {
  totalReviews = signal(0);
  craftsmanName = signal('الصنايعي');
  craftsmanAvatar = signal('https://via.placeholder.com/40');
  craftsmanId: string | null = null;
  
  

  constructor(
    private router: Router,
    private reviewsService: ReviewsService,
    private craftsProfileService: CraftsProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // جلب الـ craftsmanId من المستخدم المسجل الدخول
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.role === 'Craftsman') {
      const fetchId=currentUser.userId -1;
      this.craftsmanId = fetchId.toString();
      this.loadCraftsmanProfile();
      
    } else {
      console.error('No logged-in craftsman found');
      // يمكن إعادة التوجيه أو عرض رسالة خطأ
    }
  }

  
  loadCraftsmanProfile(): void {
    if (!this.craftsmanId) return;

    this.craftsProfileService.getCraftsmanProfile(Number(this.craftsmanId)).subscribe({
      next: (profile) => {
        this.craftsmanName.set(profile.data.fullName);
        this.craftsmanAvatar.set(profile.data.profileImageUrl || 'https://via.placeholder.com/40');
      },
      error: (error) => console.error('Error loading craftsman profile:', error)
    });
  }

  isMainDashboard(): boolean {
    return this.router.url === `/craftsman-dashboard/${this.craftsmanId}`;
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
