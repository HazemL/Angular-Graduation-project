import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Craftsjobs,job } from '../../../services/craftsjobs';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-jobs-collection',
  imports: [CommonModule],
  templateUrl: './jobs-collection.html',
  styleUrl: './jobs-collection.css',
})
export class JobsCollection implements OnInit {
jobs: job[] = [];
loading: boolean = true;
constructor(private craftsjobsService: Craftsjobs) {}
ngOnInit(): void {
    this.craftsjobsService.getMyWorks().subscribe({
      next: data => {
        this.jobs = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
