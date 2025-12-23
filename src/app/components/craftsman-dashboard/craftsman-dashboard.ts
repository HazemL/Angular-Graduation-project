import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { CraftsProfileService } from '../../services/crafts-profile-service';


@Component({
  selector: 'app-craftsman-dashboard',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './craftsman-dashboard.html',
  styleUrl: './craftsman-dashboard.css',
})
export class CraftsmanDashboard implements OnInit {
  totalReviews = signal(0);
  craftsmanName = signal('الصنايعي');
  craftsmanAvatar = signal('https://via.placeholder.com/40');
  craftsmanId = '1'; // Replace with actual logged-in craftsman ID

  constructor(
    public router: Router,
    private reviewsService: ReviewsService,
    private craftsProfileService: CraftsProfileService
  ) {}

  ngOnInit(): void {
    this.loadReviewsCount();
    this.loadCraftsmanProfile();
  }

  loadReviewsCount(): void {
    this.reviewsService.getRatingSummary().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.totalReviews.set(response.data.totalReviews);
        }
      },
      error: (error) => console.error('Error loading reviews count:', error)
    });
  }

  loadCraftsmanProfile(): void {
    this.craftsProfileService.getProfile(this.craftsmanId).subscribe({
      next: (profile) => {
        this.craftsmanName.set(profile.name);
        this.craftsmanAvatar.set(profile.avatarUrl || 'https://via.placeholder.com/40');
      },
      error: (error) => console.error('Error loading craftsman profile:', error)
    });
  }
  
  isMainDashboard(): boolean {
    return this.router.url === '/craftsman-dashboard';
  }
}
