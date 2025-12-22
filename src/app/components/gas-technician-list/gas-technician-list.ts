import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GasTechnicianService } from '../../services/gas-technician.service';
import { GasTechnician } from '../../../model/gas-technician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-gas-technician-list',
  templateUrl: './gas-technician-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GasTechnicianList implements OnInit {
  private readonly gasTechnicianService = inject(GasTechnicianService);
  
  readonly gasTechnicians = signal<GasTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredGasTechnicians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.gasTechnicians();
    
    return this.gasTechnicians().filter(technician =>
      technician.name.toLowerCase().includes(query) ||
      technician.specialization.toLowerCase().includes(query) ||
      technician.address.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadGasTechnicians();
  }

  loadGasTechnicians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.gasTechnicianService.getGasTechnicians().subscribe({
      next: (data) => {
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

  contactGasTechnician(technician: GasTechnician): void {
    window.location.href = `tel:${technician.phone}`;
  }
}