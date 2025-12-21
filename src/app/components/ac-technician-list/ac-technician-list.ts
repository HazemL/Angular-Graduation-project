import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AcTechnicianService } from '../../services/ac-technician.service';
import { AcTechnician } from '../../../model/ac-technician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-ac-technician-list',
  templateUrl: './ac-technician-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcTechnicianList implements OnInit {
  private readonly acTechnicianService = inject(AcTechnicianService);
  
  readonly acTechnicians = signal<AcTechnician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredAcTechnicians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.acTechnicians();
    
    return this.acTechnicians().filter(technician =>
      technician.name.toLowerCase().includes(query) ||
      technician.specialization.toLowerCase().includes(query) ||
      technician.address.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadAcTechnicians();
  }

  loadAcTechnicians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.acTechnicianService.getAcTechnicians().subscribe({
      next: (data) => {
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

  contactAcTechnician(technician: AcTechnician): void {
    window.location.href = `tel:${technician.phone}`;
  }
}