// src/components/device-repair/device-repair-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DeviceRepairService } from '../../services/device-repair.service';
import { DeviceRepair } from '../../../model/device-repair.model';

@Component({
  selector: 'app-device-repair-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './device-repair-list.html',
  styleUrls: ['./device-repair-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceRepairListComponent implements OnInit {
  private readonly deviceRepairService = inject(DeviceRepairService);
  private readonly route = inject(ActivatedRoute);
  
  // All device repairs from API
  private readonly allDeviceRepairs = signal<DeviceRepair[]>([]);
  
  // Current display state
  readonly deviceRepairs = signal<DeviceRepair[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter state
  readonly activeFilter = signal<'all' | 'verified' | 'warranty' | 'top-rated'>('all');

  // Store current filter params
  private currentGovernorateId = signal<number | undefined>(undefined);
  private currentCityId = signal<number | undefined>(undefined);

  // Filtered by search
  readonly filteredDeviceRepairs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.deviceRepairs();
    
    if (!query) return current;
    
    return current.filter(repair =>
      repair.name.toLowerCase().includes(query) ||
      repair.specialization.toLowerCase().includes(query) ||
      repair.address.toLowerCase().includes(query) ||
      repair.city?.toLowerCase().includes(query) ||
      repair.governorate?.toLowerCase().includes(query) ||
      repair.bio?.toLowerCase().includes(query) ||
      repair.deviceTypes?.some(d => d.toLowerCase().includes(query)) ||
      repair.brands?.some(b => b.toLowerCase().includes(query)) ||
      repair.services?.some(s => s.toLowerCase().includes(query))
    );
  });

  // Verified repairs count
  readonly verifiedRepairs = computed(() =>
    this.allDeviceRepairs().filter(r => r.isVerified)
  );

  // Warranty repairs count
  readonly warrantyRepairs = computed(() => 
    this.allDeviceRepairs().filter(r => r.warranty)
  );

  ngOnInit(): void {
    // Read query params and load device repairs with filters
    this.route.queryParams.subscribe(params => {
      const governorateId = params['governorateId'] ? +params['governorateId'] : undefined;
      const cityId = params['cityId'] ? +params['cityId'] : undefined;
      
      this.currentGovernorateId.set(governorateId);
      this.currentCityId.set(cityId);
      
      this.loadDeviceRepairs(governorateId, cityId);
    });
  }

  loadDeviceRepairs(governorateId?: number, cityId?: number): void {
    this.loading.set(true);
    this.error.set(null);

    // Use search endpoint if filters are provided, otherwise get all
    const request = (governorateId || cityId)
      ? this.deviceRepairService.searchDeviceRepairsWithFilters(governorateId, cityId)
      : this.deviceRepairService.getDeviceRepairs();

    request.subscribe({
      next: (data) => {
        this.allDeviceRepairs.set(data);
        this.deviceRepairs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading device repairs:', err);
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
    this.deviceRepairs.set(this.allDeviceRepairs());
    this.searchQuery.set('');
  }

  filterVerified(): void {
    this.activeFilter.set('verified');
    const verified = this.allDeviceRepairs().filter(r => r.isVerified);
    this.deviceRepairs.set(verified);
    this.searchQuery.set('');
  }

  filterWarranty(): void {
    this.activeFilter.set('warranty');
    const warranty = this.allDeviceRepairs().filter(r => r.warranty);
    this.deviceRepairs.set(warranty);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allDeviceRepairs()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    this.deviceRepairs.set(topRated);
    this.searchQuery.set('');
  }

  isFilterActive(filter: 'all' | 'verified' | 'warranty' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactDeviceRepair(repair: DeviceRepair): void {
    const phone = repair.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }

  getPriceRange(repair: DeviceRepair): string {
    if (repair.minPrice && repair.maxPrice) {
      return `${repair.minPrice} - ${repair.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  getNameInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackByRepairId(index: number, repair: DeviceRepair): number {
    return repair.id;
  }
}