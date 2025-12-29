import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewsService } from '../../../services/reviews.service';
import { RatingDistribution } from '../../../../model/review.model';
import { Review } from '../../../services/reviews.service'
import { AuthService } from '../../../services/auth.service';
import { CraftsProfileService } from '../../../services/crafts-profile-service';


@Component({
    selector: 'app-reviews-page',
    standalone: true,
    templateUrl: './reviews-page.html',
    styleUrl: './reviews-page.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, CommonModule]
})
export class ReviewsPageComponent implements OnInit {
    review = signal<Review[]>([]);
    loading = signal<boolean>(true);
    private readonly reviewsService = inject(ReviewsService);
    private readonly authService = inject(AuthService);
    private readonly craftsProfileService = inject(CraftsProfileService);
    protected readonly isLoading = signal(false);
    protected readonly currentPage = signal(1);
    protected readonly totalPages = signal(1);
    protected readonly activeTab = signal<string>('all');
    protected readonly replyingToId = signal<string | null>(null);
    protected readonly replyContent = signal('');

    protected readonly tabs = [
        { id: 'all', label: 'الكل' },
        { id: '5stars', label: '5 نجوم' },
        { id: '4stars', label: '4 نجوم' },
        { id: '3stars', label: '3 نجوم وأقل' },
        { id: 'unreplied', label: 'لم يتم الرد عليها' }
    ];

    protected readonly averageRating = signal(0);
    protected readonly totalReviews = signal(0);
    protected readonly responseRate = signal(0);
    protected readonly avgResponseTime = signal('');
    protected readonly ratingDistribution = signal<RatingDistribution[]>([]);
    protected readonly reviews = signal<Review[]>([]);

    protected readonly tips = [
        'اشكر العميل على تقييمه، سواء كان إيجابياً أو سلبياً.',
        'حافظ على احترافيتك وهدوءك في الردود.',
        'قدم حلولاً للمشكلات المذكورة في التقييمات السلبية.',
        'أضف طابعاً شخصياً على ردودك لإظهار اهتمامك.'
    ];

    ngOnInit(): void {
    const userId = this.authService.getCraftsmanId();
    if (!userId) {
      console.error('No logged-in craftsman found');
      this.loading.set(false);
      return;
    }
    
    // استخدام userId للحصول على craftsmanId الحقيقي
    this.craftsProfileService.getCraftsmanId(userId-1).subscribe({
      next: (craftsmanId) => {
        console.log('Craftsman ID:', craftsmanId);
        
        // جلب التقييمات باستخدام craftsmanId الحقيقي
        this.reviewsService.getReviewss(craftsmanId).subscribe({
          next: (res) => {
            console.log('Reviews received:', res);
            this.review.set(res);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error fetching reviews:', err);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching craftsman ID:', err);
        this.loading.set(false);
      }
    });
    }

   


    getStars(rating: number): string {
        const full = '★'.repeat(rating);
        const empty = '★'.repeat(5 - rating);
        return full + (empty ? `<span class="text-secondary">${empty}</span>` : '');
    }

    

    startReply(reviewId: string): void {
        this.replyingToId.set(reviewId);
        this.replyContent.set('');
    }

    cancelReply(): void {
        this.replyingToId.set(null);
        this.replyContent.set('');
    }

   

    
        
    
}
