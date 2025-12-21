import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PainterService } from '../../services/painter.service';
import { Painter } from '../../../model/painter.model';

@Component({
  imports: [CommonModule,RouterLink],
  selector: 'app-painter-list',
  templateUrl: './painter-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PainterList implements OnInit {
  private readonly painterService = inject(PainterService);
  
  readonly painters = signal<Painter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredPainters = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.painters();
    
    return this.painters().filter(painter =>
      painter.name.toLowerCase().includes(query) ||
      painter.specialization.toLowerCase().includes(query) ||
      painter.address.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadPainters();
  }

  loadPainters(): void {
    this.loading.set(true);
    this.error.set(null);

    this.painterService.getPainters().subscribe({
      next: (data) => {
        this.painters.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading painters:', err);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  contactPainter(painter: Painter): void {
    window.location.href = `tel:${painter.phone}`;
  }
}