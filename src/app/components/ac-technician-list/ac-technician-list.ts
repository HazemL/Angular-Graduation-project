// src/components/ac-technician/ac-technician-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AcTechnicianService } from '../../services/ac-technician.service';
import { AcTechnician } from '../../../model/ac-technician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-ac-technician-list',
  templateUrl: './ac-technician-list.html',
  styleUrls: ['./ac-technician-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcTechnicianList implements OnInit {
  private readonly acTechnicianService = inject(AcTechnicianService);
  
  // All technicians from API
  private readonly allAcTechnicians = signal<AcTechnician[]>([]);
  
  // Current display state
  readonly acTechnicians = signal<AcTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter state
  readonly activeFilter = signal<'all' | 'verified' | 'emergency' | 'top-rated'>('all');

  // Filtered by search
  readonly filteredAcTechnicians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.acTechnicians();
    
    if (!query) return current;
    
    return current.filter(technician =>
      technician.name.toLowerCase().includes(query) ||
      technician.specialization.toLowerCase().includes(query) ||
      technician.address.toLowerCase().includes(query) ||
      technician.city?.toLowerCase().includes(query) ||
      technician.governorate?.toLowerCase().includes(query) ||
      technician.bio?.toLowerCase().includes(query) ||
      technician.brands?.some(brand => brand.toLowerCase().includes(query)) ||
      technician.services?.some(service => service.toLowerCase().includes(query))
    );
  });

  // Verified technicians count
  readonly verifiedTechnicians = computed(() =>
    this.allAcTechnicians().filter(t => t.isVerified)
  );

  // Emergency service technicians count
  readonly emergencyTechnicians = computed(() =>
    this.allAcTechnicians().filter(t => t.emergencyService)
  );

  ngOnInit(): void {
    this.loadAcTechnicians();
  }

  loadAcTechnicians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.acTechnicianService.getAcTechnicians().subscribe({
      next: (data) => {
        this.allAcTechnicians.set(data);
        this.acTechnicians.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading AC technicians:', err);
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
    this.acTechnicians.set(this.allAcTechnicians());
    this.searchQuery.set('');
  }

  filterVerified(): void {
    this.activeFilter.set('verified');
    const verified = this.allAcTechnicians().filter(t => t.isVerified);
    this.acTechnicians.set(verified);
    this.searchQuery.set('');
  }

  filterEmergency(): void {
    this.activeFilter.set('emergency');
    const emergency = this.allAcTechnicians().filter(t => t.emergencyService);
    this.acTechnicians.set(emergency);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allAcTechnicians()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    this.acTechnicians.set(topRated);
    this.searchQuery.set('');
  }

  isFilterActive(filter: 'all' | 'verified' | 'emergency' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactAcTechnician(technician: AcTechnician): void {
    const phone = technician.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }

  getPriceRange(technician: AcTechnician): string {
    if (technician.minPrice && technician.maxPrice) {
      return `${technician.minPrice} - ${technician.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  getNameInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackByTechnicianId(index: number, technician: AcTechnician): number {
    return technician.id;
  }
}