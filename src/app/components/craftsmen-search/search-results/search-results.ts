import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CraftsmenSearchService } from '../../../services/craftsmen-search.service';
import { BreadcrumbItem, Craftsman, SearchFilters } from '../../../models/craftsman.model';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.html',
    styleUrl: './search-results.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule]
})
export class SearchResultsComponent {
    private readonly searchService = inject(CraftsmenSearchService);
    private readonly router = inject(Router);

    // Filter state
    protected readonly selectedProfession = signal('كهربائي');
    protected readonly selectedGovernorate = signal('القاهرة');
    protected readonly selectedCity = signal('مصر الجديدة');
    protected readonly priceRange = signal(500);
    protected readonly verifiedOnly = signal(false);
    protected readonly selectedRating = signal(4);

    // Results state
    protected readonly isLoading = signal(false);
    protected readonly totalCount = signal(48);
    protected readonly currentPage = signal(1);
    protected readonly totalPages = signal(8);

    // Sort state
    protected readonly sortBy = signal<'rating' | 'newest' | 'nearest'>('rating');

    // Static data (would come from API)
    protected readonly professions = [
        { value: 'كهربائي', label: 'كهربائي' },
        { value: 'سباك', label: 'سباك' },
        { value: 'نجار', label: 'نجار' }
    ];

    protected readonly governorates = [
        { value: 'القاهرة', label: 'القاهرة' },
        { value: 'الجيزة', label: 'الجيزة' },
        { value: 'الأسكندرية', label: 'الأسكندرية' }
    ];

    protected readonly cities = [
        { value: 'مصر الجديدة', label: 'مصر الجديدة' },
        { value: 'مدينة نصر', label: 'مدينة نصر' },
        { value: 'المعادي', label: 'المعادي' }
    ];

    protected readonly breadcrumbs: BreadcrumbItem[] = [
        { label: 'الرئيسية', url: '/' },
        { label: 'البحث', url: '/search' },
        { label: 'كهربائي', url: '/search/electrician' },
        { label: 'القاهرة', isActive: true }
    ];

    // Mock craftsmen data (would come from API)
    protected readonly craftsmen = signal<Craftsman[]>([
        {
            id: '1',
            name: 'أحمد المصري',
            profession: 'كهربائي',
            profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClNzc9oDk-bQSCNAVXGiY5sZgHciT0Rls5bK1C4OFy-tjnUsyKGSVLobswpGY7iurzBjseRt49Gn2iKQLMp7WY-ZMxZMtCMnqhS_8JwpfKBpkjW_SBvyPv1T6TWFCB5N-Xi6WVkbPipZlw3NxxY6KJ7NfsQ5yMEZp9l6JBfeqNDtVPK-575I-6Fo1eagGzSImN5hIrhDRBjExi76LtkitJ11NyxGUSKdVu3kNZXy-HgvIQySAoplFrlih7vD4C7JsnEo7bA9KF9e4Z',
            rating: 4.8,
            reviewCount: 125,
            yearsOfExperience: 5,
            priceRangeMin: 200,
            priceRangeMax: 500,
            serviceAreas: ['القاهرة', 'الجيزة'],
            isVerified: true,
            isPremium: true
        },
        {
            id: '2',
            name: 'محمد الشناوي',
            profession: 'سباك',
            profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVoCSbhhn4VbS16fPAN5_kZZNX6p7LPYQdCQWAriTuei9kBaQNTm41y5UuHFE1kTidDKH_bqFgjrVaU-Aw2lhVHnCHEds5r8jOkaYXcIq89ouWCT8Ff8bP_CvI3wtADtZRr-Laxh_IfFCXTTrVrJbArefBJ4uhURQLGpWVY7KsJtXB8w-jMQihZY5WtR3mgfqfaa91Q-CtZmhmjESl7uEBJcrnK7DqNc3r7ZMhnmCT1_M8-xqP2BtDVP4rja0zellGrMT2hNpYxRz_',
            rating: 4.5,
            reviewCount: 88,
            yearsOfExperience: 10,
            priceRangeMin: 150,
            priceRangeMax: 400,
            serviceAreas: ['المعادي', 'مدينة نصر'],
            isVerified: true,
            isPremium: false
        },
        {
            id: '3',
            name: 'علي السيد',
            profession: 'كهربائي',
            profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy_aI5PTUEEMhC6FnVW1V-0tnLakku7bCS7ASf-wCvTigxOZTVRrcqi91y-7ulw0zjxfty0mbjoJ_Itt3BeRjO8fg6PTzrcfB_hxxg8G6Ec-xPezY0K475FhHZulLin1-fpmLl7S3JQgIaPBSBMulOI3nYFEUBjNjA8WU_f6-sr11k3Glt1tDIZ8N8LdqzHUroI__s5CieFYAcTaGxwIlQ-ndcjsjto8Z5xaadTu4Xs2UbiUFUUbAYm9e4w7EQe8iWu5V_I8jVm7U8',
            rating: 4.2,
            reviewCount: 45,
            yearsOfExperience: 3,
            priceRangeMin: 100,
            priceRangeMax: 300,
            serviceAreas: ['القاهرة'],
            isVerified: false,
            isPremium: false
        },
        {
            id: '4',
            name: 'يوسف محمود',
            profession: 'نقاش',
            profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBViMXbeu44B-HESUTIIGcmgUueOcLtJwFXJNyObsH2gy-NO61YJ19HQj7BgRqNy65PyZURJRgEA9H0Rv-W_FsF-dRGPyBydAw4aJf_ic1x8k4mkQrQIis3BmqSeKciuwBHMZxGBs_9NYd0LQ4GZbFPTuFfkFX0wJ4Awt4JnsJXcIlixAwcbiy2Ea7H8qTDV2HFCMGTug9lwEX5f0M36-WM9_ARDFAm946uYPODUkFMXByihBPf99vVGlDSEJof1v9EySb1Zkj3-u2I',
            rating: 4.9,
            reviewCount: 210,
            yearsOfExperience: 8,
            priceRangeMin: 300,
            priceRangeMax: 800,
            serviceAreas: ['الجيزة', '6 أكتوبر'],
            isVerified: true,
            isPremium: false
        }
    ]);

    protected readonly paginationPages = computed(() => {
        const pages: (number | '...')[] = [];
        const total = this.totalPages();
        const current = this.currentPage();

        pages.push(1);
        if (current > 3) pages.push('...');
        if (current > 2) pages.push(current - 1);
        if (current > 1 && current < total) pages.push(current);
        if (current < total - 1) pages.push(current + 1);
        if (current < total - 2) pages.push('...');
        if (total > 1) pages.push(total);

        return [...new Set(pages)];
    });

    applyFilters(): void {
        this.isLoading.set(true);
        const filters: SearchFilters = {
            profession: this.selectedProfession(),
            governorate: this.selectedGovernorate(),
            city: this.selectedCity(),
            maxPrice: this.priceRange(),
            verifiedOnly: this.verifiedOnly(),
            minRating: this.selectedRating()
        };

        this.searchService.search(filters).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                if (response.success && response.data) {
                    this.craftsmen.set(response.data.craftsmen);
                    this.totalCount.set(response.data.totalCount);
                    this.totalPages.set(response.data.totalPages);
                }
            },
            error: () => this.isLoading.set(false)
        });
    }

    viewProfile(craftsman: Craftsman): void {
        this.router.navigate(['/craftsman', craftsman.id]);
    }

    goToPage(page: number | '...'): void {
        if (page === '...') return;
        this.currentPage.set(page);
        this.applyFilters();
    }

    previousPage(): void {
        if (this.currentPage() > 1) {
            this.currentPage.update(p => p - 1);
            this.applyFilters();
        }
    }

    nextPage(): void {
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.update(p => p + 1);
            this.applyFilters();
        }
    }

    setSortBy(sort: 'rating' | 'newest' | 'nearest'): void {
        this.sortBy.set(sort);
        this.applyFilters();
    }
}
