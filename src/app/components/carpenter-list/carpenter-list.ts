// src/components/carpenter/carpenter-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarpenterService } from '../../services/carpenter.service';
import { Carpenter } from '../../../model/carpenter.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-carpenter-list',
  templateUrl: './carpenter-list.html',
  styleUrls: ['./carpenter-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarpenterList implements OnInit {
  private readonly carpenterService = inject(CarpenterService);
  
  readonly carpenters = signal<Carpenter[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredCarpenters = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.carpenters();
    
    return this.carpenters().filter(carpenter =>
      carpenter.name.toLowerCase().includes(query) ||
      carpenter.specialization.toLowerCase().includes(query) ||
      carpenter.address.toLowerCase().includes(query) ||
      carpenter.city?.toLowerCase().includes(query) ||
      carpenter.governorate?.toLowerCase().includes(query)
    );
  });

  // Computed signal for verified carpenters
  readonly verifiedCarpenters = computed(() =>
    this.carpenters().filter(c => c.isVerified)
  );

  ngOnInit(): void {
    this.loadCarpenters();
  }

  loadCarpenters(): void {
    this.loading.set(true);
    this.error.set(null);

    this.carpenterService.getCarpenters().subscribe({
      next: (data) => {
        this.carpenters.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.');
        this.loading.set(false);
        console.error('Error loading carpenters:', err);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  contactCarpenter(carpenter: Carpenter): void {
    // You can use the placeholder phone or implement a modal to get real contact
    window.location.href = `tel:${carpenter.phone}`;
  }
  
  // Optional: Add price range display helper
  getPriceRange(carpenter: Carpenter): string {
    if (carpenter.minPrice && carpenter.maxPrice) {
      return `${carpenter.minPrice} - ${carpenter.maxPrice} جنيه`;
    }
    return 'السعر غير محدد';
  }
  filterVerified(): void {
  // Implementation for filtering verified carpenters
  const verified = this.carpenters().filter(c => c.isVerified);
  this.carpenters.set(verified);
}

}