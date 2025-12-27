import { Component } from '@angular/core';
import { CraftsService } from '../../../services/crafts-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { tap , map} from 'rxjs/operators';

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

  private professionCache: { [id: number]: string } = {};

  constructor(private craftsService: CraftsService) {}

  ngOnInit() {
    this.craftsService.getCrafts().subscribe({
      next: (res) => {
        this.crafts = res.data.map((item: any) => ({
          id: item.id,
          name: item.fullName,
          professionId: item.professionId,
          serviceAreas: [item.governorateName, item.cityName],
          isVerified: item.isVerified,
          rating: 0
        }));

        
        const requests = this.crafts.map(craft => 
          craft.professionId ? this.getCraftName(craft.professionId) : of({ name: 'غير محدد' })
        );

        forkJoin(requests).subscribe(craftsNames => {
          this.crafts = this.crafts.map((craft, index) => ({
            ...craft,
            profession: craftsNames[index].arabicName
          }));
          
          const ratingRequests = this.crafts.map(craft => 
  this.craftsService.getRatingsByCraftsmanId(craft.id).pipe(
    map(reviews => {
      if (!reviews || reviews.length === 0) return 0; 
      const sum = reviews.reduce((acc, r) => acc + r.stars, 0); // نجمع النجوم
      return sum / reviews.length; 
    })
  )
);

        forkJoin(ratingRequests).subscribe(avgRatings => {
          this.crafts = this.crafts.map((craft, index) => ({
            ...craft,
            rating: avgRatings[index]
          }));

          this.filteredCrafts = this.crafts;
        });
      });
      },
      error: (err) => console.error('Error fetching crafts:', err)
    });
  }

  private getCraftName(id: number) {
    if (this.professionCache[id]) {
      return of({ name: this.professionCache[id] });
    }
    return this.craftsService.getCraftNameById(id).pipe(
      tap(res => this.professionCache[id] = res.arabicName)
    );
  }
     

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCrafts = this.crafts;
    } else {
      this.filteredCrafts = this.crafts.filter(craft =>
        craft.name?.toLowerCase().includes(term) ||
        craft.profession?.toLowerCase().includes(term) ||
        craft.serviceAreas?.some((area: string) => area.toLowerCase().includes(term))
      );
    }
  }
}