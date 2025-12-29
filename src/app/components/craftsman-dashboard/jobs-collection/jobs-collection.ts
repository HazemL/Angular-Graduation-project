import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Craftsjobs,GalleryItem } from '../../../services/craftsjobs';
import { OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { signal } from '@angular/core';


@Component({
  selector: 'app-jobs-collection',
  imports: [CommonModule],
  templateUrl: './jobs-collection.html',
  styleUrl: './jobs-collection.css',
})
export class JobsCollection implements OnInit {
jobs = signal<GalleryItem[]>([]);
loading = signal<boolean>(true);
constructor(private craftsjobsService: Craftsjobs,private authService: AuthService) {}
craftsmanId: number | null = null;
ngOnInit(): void {
  this.craftsmanId = this.authService.getCraftsmanId();
  if (!this.craftsmanId) {
      console.error('No logged-in craftsman found');
      this.loading.set(false);
      return;
    }
    this.craftsjobsService.getMyWorks(this.craftsmanId).subscribe({
      next: data => {
        this.jobs.set(data);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
  get gallery() {
    return this.jobs;
  }
  get loadingState() {
    return this.loading;
  }
}
