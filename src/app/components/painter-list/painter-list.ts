// src/components/painter/painter-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PainterService } from '../../services/painter.service';
import { Painter } from '../../../model/painter.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-painter-list',
  templateUrl: './painter-list.html',
  styleUrls: ['./painter-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PainterList implements OnInit {
  private readonly painterService = inject(PainterService);
  
  // All painters from API
  private readonly allPainters = signal<Painter[]>([]);
  
  // Current display state
  readonly painters = signal<Painter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');
  
  // Filter state
  readonly activeFilter = signal<'all' | 'verified' | 'top-rated'>('all');

  // Filtered by search
  readonly filteredPainters = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const current = this.painters();
    
    if (!query) return current;
    
    return current.filter(painter =>
      painter.name.toLowerCase().includes(query) ||
      painter.specialization.toLowerCase().includes(query) ||
      painter.address.toLowerCase().includes(query) ||
      painter.city?.toLowerCase().includes(query) ||
      painter.governorate?.toLowerCase().includes(query) ||
      painter.bio?.toLowerCase().includes(query) ||
      painter.paintTypes?.some(type => type.toLowerCase().includes(query)) ||
      painter.techniques?.some(tech => tech.toLowerCase().includes(query))
    );
  });

  // Verified painters count
  readonly verifiedPainters = computed(() =>
    this.allPainters().filter(p => p.isVerified)
  );

  ngOnInit(): void {
    this.loadPainters();
  }

  loadPainters(): void {
    this.loading.set(true);
    this.error.set(null);

    this.painterService.getPainters().subscribe({
      next: (data) => {
        this.allPainters.set(data);
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

  // Filter methods
  showAll(): void {
    this.activeFilter.set('all');
    this.painters.set(this.allPainters());
    this.searchQuery.set('');
  }

  filterVerified(): void {
    this.activeFilter.set('verified');
    const verified = this.allPainters().filter(p => p.isVerified);
    this.painters.set(verified);
    this.searchQuery.set('');
  }

  filterTopRated(): void {
    this.activeFilter.set('top-rated');
    const topRated = [...this.allPainters()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    this.painters.set(topRated);
    this.searchQuery.set('');
  }

  isFilterActive(filter: 'all' | 'verified' | 'top-rated'): boolean {
    return this.activeFilter() === filter;
  }

  contactPainter(painter: Painter): void {
    const phone = painter.phone.replace(/\s+/g, '');
    window.location.href = `tel:${phone}`;
  }

  getPriceRange(painter: Painter): string {
    if (painter.minPrice && painter.maxPrice) {
      return `${painter.minPrice} - ${painter.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }

  getNameInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackByPainterId(index: number, painter: Painter): number {
    return painter.id;
  }
}