// src/components/carpenter/carpenter-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarpenterService } from '../../services/carpenter.service';
import { Carpenter } from '../../../model/carpenter.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-carpenter-list',
  templateUrl: './carpenter-list.html',
  styleUrls: ['./carpenter-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarpenterList implements OnInit {
  private readonly carpenterService = inject(CarpenterService);
  
  // All carpenters loaded from API
  private readonly allCarpenters = signal<Carpenter[]>([]);
  
  // Current display state
  readonly carpenters = signal<Carpenter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter states
  readonly activeFilter = signal<'all' | 'verified' | 'top-rated'>('all');

  // Filtered by search query
  readonly filteredCarpenters = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.carpenters();
    
    if (!query) return current;
    
    return current.filter(carpenter =>
      carpenter.name.toLowerCase().includes(query) ||
      carpenter.specialization.toLowerCase().includes(query) ||
      carpenter.address.toLowerCase().includes(query) ||
      carpenter.city?.toLowerCase().includes(query) ||
      carpenter.governorate?.toLowerCase().includes(query) ||
      carpenter.bio?.toLowerCase().includes(query)
    );
  });

  // Computed signal for verified carpenters count
  readonly verifiedCarpenters = computed(() =>
    this.allCarpenters().filter(c => c.isVerified)
  );

  ngOnInit(): void {
    this.loadCarpenters();
  }

  loadCarpenters(): void {
    this.loading.set(true);
    this.error.set(null);

    this.carpenterService.getCarpenters().subscribe({
      next: (data) => {
        this.allCarpenters.set(data);
        this.carpenters.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading carpenters:', err);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Filter methods
  showAll(): void {
    this.activeFilter.set('all');
    this.carpenters.set(this.allCarpenters());
    this.searchQuery.set('');
  }

  filterVerified(): void {
    this.activeFilter.set('verified');
    const verified = this.allCarpenters().filter(c => c.isVerified);
    this.carpenters.set(verified);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allCarpenters()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10); // Top 10
    this.carpenters.set(topRated);
    this.searchQuery.set('');
  }

  // Check if filter is active
  isFilterActive(filter: 'all' | 'verified' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactCarpenter(carpenter: Carpenter): void {
    // Format phone number for tel: link
    const phone = carpenter.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }
  
  getPriceRange(carpenter: Carpenter): string {
    if (carpenter.minPrice && carpenter.maxPrice) {
      return `${carpenter.minPrice} - ${carpenter.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  // Track by function for better performance
  trackByCarpenterId(index: number, carpenter: Carpenter): number {
    return carpenter.id;
  }
  getNameInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}
}