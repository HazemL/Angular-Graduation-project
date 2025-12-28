// src/components/plumber/plumber-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlumberService } from '../../services/plumber.service';
import { Plumber } from '../../../model/plumber.model';

@Component({
  selector: 'app-plumber-list',
  standalone: true,
  templateUrl: './plumber-list.html',
  styleUrls: ['./plumber-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class PlumberList implements OnInit {
  private readonly plumberService = inject(PlumberService);
  
  // All plumbers from API
  private readonly allPlumbers = signal<Plumber[]>([]);
  
  // Current display state
  readonly plumbers = signal<Plumber[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter state
  readonly activeFilter = signal<'all' | 'verified' | 'top-rated'>('all');

  // Filtered by search
  readonly filteredPlumbers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.plumbers();
    
    if (!query) return current;
    
    return current.filter(plumber =>
      plumber.name.toLowerCase().includes(query) ||
      plumber.specialization.toLowerCase().includes(query) ||
      plumber.address.toLowerCase().includes(query) ||
      plumber.city?.toLowerCase().includes(query) ||
      plumber.governorate?.toLowerCase().includes(query) ||
      plumber.bio?.toLowerCase().includes(query) ||
      plumber.services?.some(service => service.toLowerCase().includes(query))
    );
  });

  // Verified plumbers count
  readonly verifiedPlumbers = computed(() =>
    this.allPlumbers().filter(p => p.isVerified)
  );

  ngOnInit(): void {
    this.loadPlumbers();
  }

  loadPlumbers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.plumberService.getPlumbers().subscribe({
      next: (data) => {
        this.allPlumbers.set(data);
        this.plumbers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading plumbers:', err);
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
    this.plumbers.set(this.allPlumbers());
    this.searchQuery.set('');
  }

  filterVerified(): void {
    this.activeFilter.set('verified');
    const verified = this.allPlumbers().filter(p => p.isVerified);
    this.plumbers.set(verified);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allPlumbers()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    this.plumbers.set(topRated);
    this.searchQuery.set('');
  }

  isFilterActive(filter: 'all' | 'verified' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactPlumber(plumber: Plumber): void {
    const phone = plumber.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }

  getPriceRange(plumber: Plumber): string {
    if (plumber.minPrice && plumber.maxPrice) {
      return `${plumber.minPrice} - ${plumber.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  getNameInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackByPlumberId(index: number, plumber: Plumber): number {
    return plumber.id;
  }
}