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
      this.craftsmanId = currentUser.userId?.toString() || null;
      this.loadCraftsmanProfile();
      this.loadReviewsCount();
    } else {
      console.error('No logged-in craftsman found');
      // يمكن إعادة التوجيه أو عرض رسالة خطأ
    }
  }

  loadReviewsCount(): void {
    if (!this.craftsmanId) return;

    this.reviewsService.getRatingSummary(this.craftsmanId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.totalReviews.set(response.data.totalReviews);
        }
      },
      error: (error) => console.error('Error loading reviews count:', error)
    });
  }

  loadCraftsmanProfile(): void {
    if (!this.craftsmanId) return;

    this.craftsProfileService.getProfile(this.craftsmanId).subscribe({
      next: (profile) => {
        this.craftsmanName.set(profile.name);
        this.craftsmanAvatar.set(profile.avatarUrl || 'https://via.placeholder.com/40');
      },
      error: (error) => console.error('Error loading craftsman profile:', error)
    });
  }

  isMainDashboard(): boolean {
    return this.router.url === `/craftsman-dashboard/${this.craftsmanId}`;
  }
}
