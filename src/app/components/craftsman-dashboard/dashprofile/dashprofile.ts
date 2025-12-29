import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CraftsProfileService, CraftsProfile,Profession } from '../../../services/crafts-profile-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashprofile',
  imports: [CommonModule],
  templateUrl: './dashprofile.html',
  styleUrl: './dashprofile.css',
})
export class Dashprofile implements OnInit {
  profile:CraftsProfile | null = null;
  loading: boolean = true;
  
  profession: Profession | null = null;
  professionName: string = '';
  
  constructor(private craftsProfileService: CraftsProfileService, private route: ActivatedRoute) {}

  ngOnInit() {
     const craftsId = this.route.snapshot.paramMap.get('id') || '';
    this.craftsProfileService.getCraftsmanProfile(Number(craftsId)).subscribe({
      next: (res) => {
        this.profile = res.data;
       
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }
  loadProfessionName(professionId: number): void {
  this.craftsProfileService.getProfessionById(professionId).subscribe({
    next: (profession) => {
      this.professionName = profession.arabicName; // الاسم العربي مباشرة
    },
    error: (err) => {
      console.error('Error fetching profession', err);
    }
  });
}

}
