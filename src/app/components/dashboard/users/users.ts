import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Users } from '../../../services/users';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  
  constructor(private usersService: Users) {}
  
  ngOnInit() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => console.error(err)
    });   
  }
  
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => 
        user.name?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term)
      );
    }
  }
}
