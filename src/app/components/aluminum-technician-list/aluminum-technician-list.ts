import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AluminumTechnicianService } from '../../services/aluminum-technician.service';
import { AluminumTechnician } from '../../../model/aluminum-technician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-aluminum-technician-list',
  templateUrl: './aluminum-technician-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AluminumTechnicianList implements OnInit {
  private readonly aluminumTechnicianService = inject(AluminumTechnicianService);
  
  readonly aluminumTechnicians = signal<AluminumTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredAluminumTechnicians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.aluminumTechnicians();
    
    return this.aluminumTechnicians().filter(technician =>
      technician.name.toLowerCase().includes(query) ||
      technician.specialization.toLowerCase().includes(query) ||
      technician.address.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadAluminumTechnicians();
  }

  loadAluminumTechnicians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.aluminumTechnicianService.getAluminumTechnicians().subscribe({
      next: (data) => {
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

  contactAluminumTechnician(technician: AluminumTechnician): void {
    window.location.href = `tel:${technician.phone}`;
  }
}