// src/components/device-repair/device-repair-list.component.ts
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  
  readonly deviceRepairs = signal<DeviceRepair[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  readonly filteredDeviceRepairs = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.deviceRepairs();
    
    return this.deviceRepairs().filter(repair =>
      repair.name.toLowerCase().includes(query) ||
      repair.specialization.toLowerCase().includes(query) ||
      repair.address.toLowerCase().includes(query) ||
      repair.city?.toLowerCase().includes(query) ||
      repair.deviceTypes?.some(d => d.toLowerCase().includes(query)) ||
      repair.brands?.some(b => b.toLowerCase().includes(query)) ||
      repair.services?.some(s => s.toLowerCase().includes(query))
    );
  });

  ngOnInit(): void {
    this.loadDeviceRepairs();
  }

  loadDeviceRepairs(): void {
    this.loading.set(true);
    this.error.set(null);

    this.deviceRepairService.getDeviceRepairs().subscribe({
      next: (data) => {
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

  contactDeviceRepair(repair: DeviceRepair): void {
    window.location.href = `tel:${repair.phone}`;
  }
  // Add to device-repair-list.component.ts

readonly warrantyRepairs = computed(() => 
  this.deviceRepairs().filter(r => r.warranty)
);

private currentFilter = signal<string>('all');

isFilterActive(filter: string): boolean {
  return this.currentFilter() === filter;
}

showAll(): void {
  this.currentFilter.set('all');
  this.searchQuery.set('');
}

filterVerified(): void {
  this.currentFilter.set('verified');
  this.deviceRepairs.update(repairs => 
    repairs.filter(r => r.isVerified)
  );
}

filterWarranty(): void {
  this.currentFilter.set('warranty');
  this.deviceRepairs.update(repairs => 
    repairs.filter(r => r.warranty)
  );
}

trackByRepairId(index: number, repair: DeviceRepair): number {
  return repair.id;
}

}