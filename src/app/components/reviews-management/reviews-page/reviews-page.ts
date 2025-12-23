import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewsService } from '../../../services/reviews.service';
import { RatingDistribution, Review } from '../../../../model/review.model';

@Component({
    selector: 'app-reviews-page',
    standalone: true,
    templateUrl: './reviews-page.html',
    styleUrl: './reviews-page.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, CommonModule]
})
export class ReviewsPageComponent implements OnInit {
    private readonly reviewsService = inject(ReviewsService);

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
        this.loadRatingSummary();
        this.loadResponsePerformance();
        this.loadReviews();
    }

    loadRatingSummary(): void {
        this.reviewsService.getRatingSummary().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.averageRating.set(response.data.averageRating);
                    this.totalReviews.set(response.data.totalReviews);
                    this.ratingDistribution.set(response.data.distribution);
                }
            },
            error: (error) => console.error('Error loading rating summary:', error)
        });
    }

    loadResponsePerformance(): void {
        this.reviewsService.getResponsePerformance().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.responseRate.set(response.data.responseRate);
                    this.avgResponseTime.set(response.data.averageResponseTime);
                }
            },
            error: (error) => console.error('Error loading response performance:', error)
        });
    }

    getStars(rating: number): string {
        const full = '★'.repeat(rating);
        const empty = '★'.repeat(5 - rating);
        return full + (empty ? `<span class="text-secondary">${empty}</span>` : '');
    }

    setActiveTab(tabId: string): void {
        this.activeTab.set(tabId);
        this.loadReviews();
    }

    startReply(reviewId: string): void {
        this.replyingToId.set(reviewId);
        this.replyContent.set('');
    }

    cancelReply(): void {
        this.replyingToId.set(null);
        this.replyContent.set('');
    }

    submitReply(reviewId: string): void {
        if (!this.replyContent().trim()) return;

        this.reviewsService.submitReply(reviewId, this.replyContent()).subscribe({
            next: () => {
                this.replyingToId.set(null);
                this.replyContent.set('');
                this.loadReviews();
            }
        });
    }

    loadReviews(): void {
        this.isLoading.set(true);
        this.reviewsService.getReviews(this.activeTab(), this.currentPage()).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                if (response.success && response.data) {
                    this.reviews.set(response.data.reviews);
                    this.totalPages.set(response.data.totalPages);
                }
            },
            error: (error) => {
                console.error('Error loading reviews:', error);
                this.isLoading.set(false);
            }
        });
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
            this.loadReviews();
        }
    }
}
