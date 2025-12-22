import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CraftsProfileService, CraftsProfile } from '../../../services/crafts-profile-service';

@Component({
  selector: 'app-dashprofile',
  imports: [CommonModule],
  templateUrl: './dashprofile.html',
  styleUrl: './dashprofile.css',
})
export class Dashprofile implements OnInit {
  profile:CraftsProfile | null = null;
  loading: boolean = true;
  craftsId='123';
  constructor(private craftsProfileService: CraftsProfileService) {}

  ngOnInit() {
    this.craftsProfileService.getProfile(this.craftsId).subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

}
