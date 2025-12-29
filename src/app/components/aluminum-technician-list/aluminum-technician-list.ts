// src/components/aluminum-technician/aluminum-technician-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AluminumTechnicianService } from '../../services/aluminum-technician.service';
import { AluminumTechnician } from '../../../model/aluminum-technician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-aluminum-technician-list',
  templateUrl: './aluminum-technician-list.html',
  styleUrls: ['./aluminum-technician-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AluminumTechnicianList implements OnInit {
  private readonly aluminumTechnicianService = inject(AluminumTechnicianService);
  private readonly route = inject(ActivatedRoute);
  
  // All technicians from API
  private readonly allAluminumTechnicians = signal<AluminumTechnician[]>([]);
  
  // Current display state
  readonly aluminumTechnicians = signal<AluminumTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter state
  readonly activeFilter = signal<'all' | 'verified' | 'warranty' | 'top-rated'>('all');

  // Store current filter params
  private currentGovernorateId = signal<number | undefined>(undefined);
  private currentCityId = signal<number | undefined>(undefined);

  // Filtered by search
  readonly filteredAluminumTechnicians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.aluminumTechnicians();
    
    if (!query) return current;
    
    return current.filter(technician =>
      technician.name.toLowerCase().includes(query) ||
      technician.specialization.toLowerCase().includes(query) ||
      technician.address.toLowerCase().includes(query) ||
      technician.city?.toLowerCase().includes(query) ||
      technician.governorate?.toLowerCase().includes(query) ||
      technician.bio?.toLowerCase().includes(query) ||
      technician.services?.some(s => s.toLowerCase().includes(query)) ||
      technician.materials?.some(m => m.toLowerCase().includes(query))
    );
  });

  // Verified technicians count
  readonly verifiedTechnicians = computed(() =>
    this.allAluminumTechnicians().filter(t => t.isVerified)
  );

  // Warranty technicians count
  readonly warrantyTechnicians = computed(() =>
    this.allAluminumTechnicians().filter(t => t.warranty)
  );

  ngOnInit(): void {
    // Read query params and load aluminum technicians with filters
    this.route.queryParams.subscribe(params => {
      const governorateId = params['governorateId'] ? +params['governorateId'] : undefined;
      const cityId = params['cityId'] ? +params['cityId'] : undefined;
      
      this.currentGovernorateId.set(governorateId);
      this.currentCityId.set(cityId);
      
      this.loadAluminumTechnicians(governorateId, cityId);
    });
  }

  loadAluminumTechnicians(governorateId?: number, cityId?: number): void {
    this.loading.set(true);
    this.error.set(null);

    // Use search endpoint if filters are provided, otherwise get all
    const request = (governorateId || cityId)
      ? this.aluminumTechnicianService.searchAluminumTechniciansWithFilters(governorateId, cityId)
      : this.aluminumTechnicianService.getAluminumTechnicians();

    request.subscribe({
      next: (data) => {
        this.allAluminumTechnicians.set(data);
        this.aluminumTechnicians.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading aluminum technicians:', err);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // Filter methods - maintain location filters
  showAll(): void {
    this.activeFilter.set('all');
    this.aluminumTechnicians.set(this.allAluminumTechnicians());
    this.searchQuery.set('');
  }

  filterVerified(): void {
    this.activeFilter.set('verified');
    const verified = this.allAluminumTechnicians().filter(t => t.isVerified);
    this.aluminumTechnicians.set(verified);
    this.searchQuery.set('');
  }

  filterWarranty(): void {
    this.activeFilter.set('warranty');
    const warranty = this.allAluminumTechnicians().filter(t => t.warranty);
    this.aluminumTechnicians.set(warranty);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allAluminumTechnicians()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    this.aluminumTechnicians.set(topRated);
    this.searchQuery.set('');
  }

  isFilterActive(filter: 'all' | 'verified' | 'warranty' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactAluminumTechnician(technician: AluminumTechnician): void {
    const phone = technician.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }

  getPriceRange(technician: AluminumTechnician): string {
    if (technician.minPrice && technician.maxPrice) {
      return `${technician.minPrice} - ${technician.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  getNameInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackByTechnicianId(index: number, technician: AluminumTechnician): number {
    return technician.id;
  }
}