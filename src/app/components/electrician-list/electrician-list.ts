import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElectricianService } from '../../services/electrician.service';
import { Electrician } from '../../../model/electrician.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-electrician-list',
  templateUrl: './electrician-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElectricianList implements OnInit {
  private readonly electricianService = inject(ElectricianService);
  
  readonly electricians = signal<Electrician[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredElectricians = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.electricians();
    
    return this.electricians().filter(electrician =>
      electrician.name.toLowerCase().includes(query) ||
      electrician.specialization.toLowerCase().includes(query) ||
      electrician.address.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadElectricians();
  }

  loadElectricians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.electricianService.getElectricians().subscribe({
      next: (data) => {
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

  contactElectrician(electrician: Electrician): void {
    window.location.href = `tel:${electrician.phone}`;
  }
}