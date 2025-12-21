import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewsService } from '../../../services/reviews.service';
import { CraftsmanProfile, RatingDistribution, Review, SidebarLink } from '../../../../model/review.model';

@Component({
    selector: 'app-reviews-page',
    templateUrl: './reviews-page.html',
    styleUrl: './reviews-page.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule]
})
export class ReviewsPageComponent {
    private readonly reviewsService = inject(ReviewsService);
    private readonly router = inject(Router);

    protected readonly isLoading = signal(false);
    protected readonly currentPage = signal(2);
    protected readonly totalPages = signal(8);
    protected readonly activeTab = signal<string>('all');
    protected readonly replyingToId = signal<string | null>(null);
    protected readonly replyContent = signal('');

    protected readonly craftsmanProfile: CraftsmanProfile = {
        name: 'أحمد المصري',
        profession: 'نجار',
        profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGv_lGcdGX2_KBCM72NEHtk1SfExjEDGliuPAd7pmvw9z77T55zpSxZGNla6SjfNqDjo4C78w-ESYgXt-fbppY9Uon2JGI2kAHI-iFPCIY7mGM3ke8ADkMBbFj839G00t3EijLJ2HmO2yTUOjH-amrwOTv-YHWoT7TYFS2KGoHwmASWaRbeaE-BiTBurEKTW83ddgu2Flmfm8Jxlt-Xa4bHWDXap-XT6qx2wytHQtmD756X-_7aWDP71NwjqLaGVQKP70a8WPv9DR3'
    };

    protected readonly sidebarLinks: SidebarLink[] = [
        { icon: 'dashboard', label: 'لوحة التحكم', route: '/dashboard' },
        { icon: 'inventory_2', label: 'المنتجات', route: '/products' },
        { icon: 'list_alt', label: 'الطلبات', route: '/orders' },
        { icon: 'star', label: 'التقييمات', route: '/reviews', isActive: true },
        { icon: 'settings', label: 'الإعدادات', route: '/settings' }
    ];

    protected readonly tabs = [
        { id: 'all', label: 'الكل' },
        { id: '5stars', label: '5 نجوم' },
        { id: '4stars', label: '4 نجوم' },
        { id: '3stars', label: '3 نجوم وأقل' },
        { id: 'unreplied', label: 'لم يتم الرد عليها' }
    ];

    protected readonly averageRating = 4.7;
    protected readonly totalReviews = 89;
    protected readonly responseRate = 95;
    protected readonly avgResponseTime = '2 ساعة';

    protected readonly ratingDistribution: RatingDistribution[] = [
        { stars: 5, percentage: 65, color: 'bg-success' },
        { stars: 4, percentage: 15, color: 'bg-success-light' },
        { stars: 3, percentage: 12, color: 'bg-warning' },
        { stars: 2, percentage: 5, color: 'bg-orange' },
        { stars: 1, percentage: 3, color: 'bg-danger' }
    ];

    protected readonly reviews = signal<Review[]>([
        {
            id: '1',
            customerName: 'محمد علي',
            customerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRiapw3rP9nyjZqyrU4HBFEk7n3xuMVej33baoSoP3WFVPXO2ocIzauGZGU8XtTkDc83WzRtbB5946aOdPahyN9LrU609syl61GnIYR7sJlEOycv0K6kXnrPYZGCnZmeA7Sh2pQqsGLfa8cSNjbVOf0a3LK5R8tAO8dh0jBmQh2_Qq8SX10YmVWjk2eJkV8bP8Jj3QlctoZRk-tJKXz3tCmVSSLSo1iVe3OGUvfjlPxSTPYfM9B4A845TIGEyzhzTx_xbLW3-hItBC',
            rating: 5,
            comment: 'شغل ممتاز وجودة عالية جداً. الأستاذ أحمد محترف ومواعيده دقيقة. أنصح بالتعامل معه بشدة.',
            createdAt: 'منذ 3 أيام',
            reply: {
                content: 'شكراً جزيلاً لك أستاذ محمد، يسعدني أن العمل نال إعجابك. في خدمتك دائماً.',
                createdAt: 'منذ يومين'
            }
        },
        {
            id: '2',
            customerName: 'فاطمة السيد',
            customerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVhHqGDOc8VyjTslq-Rke-fMys3KttZBEdRrQ28afPg1Jx2ZfJiqgj_sD-WgDuE2UB7IxE0B5Iw8iHsNCIY2AWrgPbilhBTtji-6n5MWriiayviQv6qfadZcAzCoIU2seWlfy24zoHyLbTRGTNGMhGnq0jdyXlvZdLNFdu3LdF_WzWsfSH5aE4QJJKiQJ_i6wi30PDt6xHESxBy4QsUzl6NRngaGCILFHAFn40sRPBCYyLOwDanHgL5E4fAAMd5iEcTWGoex2eICkf',
            rating: 4,
            comment: 'المنتج جيد ولكن تأخر التسليم قليلاً عن الموعد المتفق عليه.',
            createdAt: 'منذ أسبوع',
            images: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBNXvJihM3HlUwSBBkLV2wT-V576FtC7bnizALOoB4oGFavumzXkKATljlI1-4GT3oq7isf2CAiLa1dcGfGcjYqYkk130myk0L6Zaet_FjuPDxqqIhvt11ZGt-Pky7tNNCBeGMQRDivp6og9kycAnMdUPVKu7iVDRG8EWFZrNhnOcDcR42bEJ4ZsLbrCxMwycHHA5oxYDE5knV0fjBskeoD5DvYKHRhk2yLVGiVmgAiHDo3SKHLNkOcPufk3novE6cO8P5kqEX3Z2sx',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDo-Ra1HUdLO8MrLY9SHzJ9oMAeVvjKzGc4Ld6yDmy4Pb1RvevRIacWBUZCkmVvSPYIdHM_BxlQYb75mRt3bZ1d29J6Bu43ElLzWeJdofj4N2fsT4gxv-usCHXVMXVuvGoyRqPG412sqUTih6FVOK11mv75UI5gxwK5p61n0YbCK11v8Z5VtjlfdyjkszfL8SCxvQSzy1Wa2NH3LehinXo3DXoNawY65t7KY9-6MC00veblZ4FsVkOotod4avHLeidWgjdR64W4aOEY'
            ]
        },
        {
            id: '3',
            customerName: 'كريم عادل',
            customerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxf8Zg5t_FN1PFbzU8iC9qnBdqW55xtjBBadBaRIMEuexMb1drKHHgqbmgYfn5igxDH2zaN-qhsT85aziBum2rIBJmrr_hDohsqYb4q-w2fswM4tXWukYMe012k-XEslS0NTGs9wUwsKAiIk79Ikvo-TjfrMVKCQjc8XWCEKYVvaJYixAEcfaeDXtP0w4bykxMP9qDepIeXTjHwYBRMSOEYnjww9oyZmhskZcBOTc1Kq6XuKf5brsvz3QX5bcfZZCW-etHtiScF1_A',
            rating: 3,
            comment: 'الخامة ليست كما توقعت.',
            createdAt: 'منذ أسبوعين'
        }
    ]);

    protected readonly tips = [
        'اشكر العميل على تقييمه، سواء كان إيجابياً أو سلبياً.',
        'حافظ على احترافيتك وهدوءك في الردود.',
        'قدم حلولاً للمشكلات المذكورة في التقييمات السلبية.',
        'أضف طابعاً شخصياً على ردودك لإظهار اهتمامك.'
    ];

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
            error: () => this.isLoading.set(false)
        });
    }

    goToPage(page: number): void {
        this.currentPage.set(page);
        this.loadReviews();
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }
}
