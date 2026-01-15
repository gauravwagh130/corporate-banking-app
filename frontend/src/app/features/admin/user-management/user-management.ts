import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { User } from '../../../core/models/user';
import { Role } from '../../../core/models/role';
import { RegisterRequest } from '../../../core/models/register-request';
import { UpdateUserStatusRequest } from '../../../core/models/update-user-status-request';
import { AdminService } from '../../../core/services/admin-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  createUserForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showCreateForm = false;
  showFilters = false;
  activeFilterCount = 0;
  searchTerm = '';
  selectedRoles: string[] = [];
  selectedStatuses: string[] = [];

  roles = [
    { value: Role.ADMIN, label: 'Administrator' },
    { value: Role.RM, label: 'Relationship Manager' },
    { value: Role.ANALYST, label: 'Analyst' },
  ];

  displayedColumns: string[] = ['username', 'email', 'role', 'status', 'actions'];

  constructor(
    private adminService: AdminService,
    private authService:  AuthService,
    private fb:  FormBuilder,
    private router:  Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
  }

  private initializeForm(): void {
    this.createUserForm = this. fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators. email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [Role. RM, Validators.required],
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
        console.error('Error loading users:', error);
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    if (this.selectedRoles.length > 0) {
      filtered = filtered.filter((user) => this.selectedRoles. includes(user.role));
    }
    if (this.selectedStatuses. length > 0) {
      filtered = filtered.filter((user) => {
        if (this. selectedStatuses.includes('Active') && user.active) return true;
        if (this.selectedStatuses.includes('Inactive') && !user.active) return true;
        return false;
      });
    }

    this.filteredUsers = filtered;
    this.updateActiveFilterCount();
  }

  updateActiveFilterCount(): void {
    this.activeFilterCount = 0;
    if (this.searchTerm) this.activeFilterCount++;
    if (this.selectedRoles.length > 0) this.activeFilterCount += this.selectedRoles.length;
    if (this.selectedStatuses.length > 0) this.activeFilterCount += this.selectedStatuses.length;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this. selectedRoles = [];
    this.selectedStatuses = [];
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onRoleFilterChange(role: string, checked: boolean): void {
    if (checked) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles = this. selectedRoles.filter((r) => r !== role);
    }
    this.applyFilters();
  }

  onStatusFilterChange(status: string, checked: boolean): void {
    if (checked) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter((s) => s !== status);
    }
    this.applyFilters();
  }

  removeRoleFilter(role: string): void {
    this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
    this.applyFilters();
  }

  removeStatusFilter(status:  string): void {
    this.selectedStatuses = this.selectedStatuses.filter((s) => s !== status);
    this.applyFilters();
  }

  onCreateUser(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const request: RegisterRequest = this.createUserForm.value;

    this.authService. register(request).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.createUserForm.reset({ role: Role.RM });
        this.loadUsers();
      },
      error: (error) => {
        this.errorMessage = error. message || 'Failed to create user';
        this.isLoading = false;
      },
    });
  }

  toggleUserStatus(user: User): void {
    const action = user.active ? 'Deactivate' : 'Activate';
    
    if (! confirm(`${action} user "${user.username}"?`)) {
      return;
    }

    const request: UpdateUserStatusRequest = { active: !user. active };

    this.adminService.updateUserStatus(user.id, request).subscribe({
      next: () => {
        user.active = !user.active;
        this.applyFilters();
      },
      error: (error) => {
        this.errorMessage = 'Failed to update user status';
        console.error('Error updating user status:', error);
      },
    });
  }

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find((r) => r.value === role);
    return roleObj ? roleObj.label : role;
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}