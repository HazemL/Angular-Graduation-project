// src/components/electrician/electrician-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElectricianService } from '../../services/electrician.service';
import { Electrician } from '../../../model/electrician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-electrician-list',
  templateUrl: './electrician-list.html',
  styleUrls: ['./electrician-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElectricianList implements OnInit {
  private readonly electricianService = inject(ElectricianService);
  
  // All electricians from API
  private readonly allElectricians = signal<Electrician[]>([]);
  
  // Current display state
  readonly electricians = signal<Electrician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter state
  readonly activeFilter = signal<'all' | 'verified' | 'top-rated'>('all');

  // Filtered by search
  readonly filteredElectricians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.electricians();
    
    if (!query) return current;
    
    return current.filter(electrician =>
      electrician.name.toLowerCase().includes(query) ||
      electrician.specialization.toLowerCase().includes(query) ||
      electrician.address.toLowerCase().includes(query) ||
      electrician.city?.toLowerCase().includes(query) ||
      electrician.governorate?.toLowerCase().includes(query) ||
      electrician.bio?.toLowerCase().includes(query) ||
      electrician.certifications?.some(cert => cert.toLowerCase().includes(query))
    );
  });

  // Verified electricians count
  readonly verifiedElectricians = computed(() =>
    this.allElectricians().filter(e => e.isVerified)
  );

  ngOnInit(): void {
    this.loadElectricians();
  }

  loadElectricians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.electricianService.getElectricians().subscribe({
      next: (data) => {
        this.allElectricians.set(data);
        this.electricians.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading electricians:', err);
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
    this.electricians.set(this.allElectricians());
    this.searchQuery.set('');
  }

  filterVerified(): void {
    this.activeFilter.set('verified');
    const verified = this.allElectricians().filter(e => e.isVerified);
    this.electricians.set(verified);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allElectricians()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    this.electricians.set(topRated);
    this.searchQuery.set('');
  }

  isFilterActive(filter: 'all' | 'verified' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactElectrician(electrician: Electrician): void {
    const phone = electrician.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }

  getPriceRange(electrician: Electrician): string {
    if (electrician.minPrice && electrician.maxPrice) {
      return `${electrician.minPrice} - ${electrician.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  getNameInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackByElectricianId(index: number, electrician: Electrician): number {
    return electrician.id;
  }
}