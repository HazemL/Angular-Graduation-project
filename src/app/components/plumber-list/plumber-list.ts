import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlumberService } from '../../services/plumber.service';
import { Plumber } from '../../../model/plumber.model';

@Component({
  selector: 'app-plumber-list',
  standalone: true,
  templateUrl: './plumber-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink
  ]
})
export class PlumberList implements OnInit {
  private readonly plumberService = inject(PlumberService);
  
  readonly plumbers = signal<Plumber[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredPlumbers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.plumbers();
    
    return this.plumbers().filter(plumber =>
      plumber.name.toLowerCase().includes(query) ||
      plumber.specialization.toLowerCase().includes(query) ||
      plumber.address.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadPlumbers();
  }

  loadPlumbers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.plumberService.getPlumbers().subscribe({
      next: (data) => {
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

  contactPlumber(plumber: Plumber): void {
    window.location.href = `tel:${plumber.phone}`;
  }
}