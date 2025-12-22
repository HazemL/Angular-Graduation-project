import { Component } from '@angular/core';
import { CraftsService } from '../../../services/crafts-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-dash-craftsman',
  imports: [CommonModule, FormsModule],
  templateUrl: './dash-craftsman.html',
  styleUrl: './dash-craftsman.css',
})
export class DashCraftsman implements OnInit {
  crafts: any[] = [];
  filteredCrafts: any[] = [];
  searchTerm: string = '';

  constructor(private craftsService: CraftsService) {}
  
  ngOnInit() {
    this.craftsService.getCrafts().subscribe({
      next: (data) => {
        this.crafts = data;
        this.filteredCrafts = data;
      },
      error: (err) => console.error('Error fetching crafts:', err)
    });
  }
  
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCrafts = this.crafts;
    } else {
      this.filteredCrafts = this.crafts.filter(craft => 
        craft.name?.toLowerCase().includes(term) || 
        craft.job?.toLowerCase().includes(term) ||
        craft.city?.toLowerCase().includes(term)
      );
    }
  }
}
