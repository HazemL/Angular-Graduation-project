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
  statusFilter: string = 'all';
  selectedUser: any = null;
  showViewModal: boolean = false;
  showEditModal: boolean = false;
  
  constructor(private usersService: Users) {}
  
  ngOnInit() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        console.log('Users data received:', data);
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => console.error('Error loading users:', err)
    });   
  }
  
  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.users;

    // تطبيق فلتر البحث
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(user => 
        user.fullName?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term)
      );
    }

    // تطبيق فلتر الحالة
    if (this.statusFilter === 'active') {
      filtered = filtered.filter(user => user.isActive !== false);
    } else if (this.statusFilter === 'inactive') {
      filtered = filtered.filter(user => user.isActive === false);
    }

    this.filteredUsers = filtered;
  }

  viewUser(user: any) {
    this.selectedUser = user;
    this.showViewModal = true;
    console.log('عرض مستخدم:', user);
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
    console.log('تعديل مستخدم:', user);
  }

  saveUser() {
    if (!this.selectedUser || !this.selectedUser.id) return;

    this.usersService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: (response) => {
        console.log('تم تحديث المستخدم بنجاح', response);
        // تحديث القائمة
        const index = this.users.findIndex(u => u.id === this.selectedUser.id);
        if (index !== -1) {
          this.users[index] = { ...this.selectedUser };
          this.applyFilters();
        }
        this.closeModal();
        alert('تم تحديث المستخدم بنجاح');
      },
      error: (err) => {
        console.error('خطأ في تحديث المستخدم:', err);
        alert('حدث خطأ أثناء تحديث المستخدم');
      }
    });
  }

  deleteUser(user: any) {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${user.fullName}"?`)) {
      return;
    }

    this.usersService.deleteUser(user.id).subscribe({
      next: (response) => {
        console.log('تم حذف المستخدم بنجاح', response);
        // إزالة من القائمة
        this.users = this.users.filter(u => u.id !== user.id);
        this.applyFilters();
        alert('تم حذف المستخدم بنجاح');
      },
      error: (err) => {
        console.error('خطأ في حذف المستخدم:', err);
        alert('حدث خطأ أثناء حذف المستخدم');
      }
    });
  }

  closeModal() {
    this.showViewModal = false;
    this.showEditModal = false;
    this.selectedUser = null;
  }
}
