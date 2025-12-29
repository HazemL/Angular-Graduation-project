// src/components/gas-technician/gas-technician-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GasTechnicianService } from '../../services/gas-technician.service';
import { GasTechnician } from '../../../model/gas-technician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-gas-technician-list',
  templateUrl: './gas-technician-list.html',
  styleUrls: ['./gas-technician-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GasTechnicianList implements OnInit {
  private readonly gasTechnicianService = inject(GasTechnicianService);
  private readonly route = inject(ActivatedRoute);
  
  // All technicians from API
  private readonly allGasTechnicians = signal<GasTechnician[]>([]);
  
  // Current display state
  readonly gasTechnicians = signal<GasTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter state
  readonly activeFilter = signal<'all' | 'licensed' | 'emergency' | 'top-rated'>('all');

  // Store current filter params
  private currentGovernorateId = signal<number | undefined>(undefined);
  private currentCityId = signal<number | undefined>(undefined);

  // Filtered by search
  readonly filteredGasTechnicians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.gasTechnicians();
    
    if (!query) return current;
    
    return current.filter(technician =>
      technician.name.toLowerCase().includes(query) ||
      technician.specialization.toLowerCase().includes(query) ||
      technician.address.toLowerCase().includes(query) ||
      technician.city?.toLowerCase().includes(query) ||
      technician.governorate?.toLowerCase().includes(query) ||
      technician.bio?.toLowerCase().includes(query) ||
      technician.services?.some(s => s.toLowerCase().includes(query)) ||
      technician.certifications?.some(c => c.toLowerCase().includes(query)) ||
      technician.licensedBy?.toLowerCase().includes(query)
    );
  });

  // Licensed technicians count
  readonly licensedTechnicians = computed(() =>
    this.allGasTechnicians().filter(t => t.licensedBy)
  );

  // Emergency service technicians count
  readonly emergencyTechnicians = computed(() =>
    this.allGasTechnicians().filter(t => t.emergencyService)
  );

  ngOnInit(): void {
    // Read query params and load gas technicians with filters
    this.route.queryParams.subscribe(params => {
      const governorateId = params['governorateId'] ? +params['governorateId'] : undefined;
      const cityId = params['cityId'] ? +params['cityId'] : undefined;
      
      this.currentGovernorateId.set(governorateId);
      this.currentCityId.set(cityId);
      
      this.loadGasTechnicians(governorateId, cityId);
    });
  }

  loadGasTechnicians(governorateId?: number, cityId?: number): void {
    this.loading.set(true);
    this.error.set(null);

    // Use search endpoint if filters are provided, otherwise get all
    const request = (governorateId || cityId)
      ? this.gasTechnicianService.searchGasTechniciansWithFilters(governorateId, cityId)
      : this.gasTechnicianService.getGasTechnicians();

    request.subscribe({
      next: (data) => {
        this.allGasTechnicians.set(data);
        this.gasTechnicians.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading gas technicians:', err);
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
    this.gasTechnicians.set(this.allGasTechnicians());
    this.searchQuery.set('');
  }

  filterLicensed(): void {
    this.activeFilter.set('licensed');
    const licensed = this.allGasTechnicians().filter(t => t.licensedBy);
    this.gasTechnicians.set(licensed);
    this.searchQuery.set('');
  }

  filterEmergency(): void {
    this.activeFilter.set('emergency');
    const emergency = this.allGasTechnicians().filter(t => t.emergencyService);
    this.gasTechnicians.set(emergency);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allGasTechnicians()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    this.gasTechnicians.set(topRated);
    this.searchQuery.set('');
  }

  isFilterActive(filter: 'all' | 'licensed' | 'emergency' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactGasTechnician(technician: GasTechnician): void {
    const phone = technician.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }

  getPriceRange(technician: GasTechnician): string {
    if (technician.minPrice && technician.maxPrice) {
      return `${technician.minPrice} - ${technician.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  getNameInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackByTechnicianId(index: number, technician: GasTechnician): number {
    return technician.id;
  }
}