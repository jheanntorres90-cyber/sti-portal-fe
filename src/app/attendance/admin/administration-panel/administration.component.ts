import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  course: string;
  yearSection: string;
  email: string;
  contact: string;
  rfid: string;
  faceImage: string;
}

@Component({
  selector: 'app-admin-administration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './administration.component.html',
})
export class AdministrationComponent implements OnInit {
  // ==================== ADMIN MANAGEMENT PROPERTIES ====================
  
  // Form Groups
  adminForm: FormGroup;
  editForm: FormGroup;
  
  // State variables
  isAddModalOpen = false;
  showDeleteModal = false;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  isLoading = false;
  showPassword = false;
  showEditPassword = false;
  
  // Admin Data
  admins: any[] = [];
  adminToDelete: any = null;
  editingAdminId: number | null = null;
  
  newAdmin: any = {
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: '',
    mobile: ''
  };

  // Constants
  roles = ['Super Admin', 'Moderator', 'Viewer'];
  alerts: any[] = [];
  
  // CSS Variables
  cssVariables = {
    'primary-blue': '#2d68b8',
    'secondary-blue': '#4a90e2',
    'light-blue': '#e3f2fd',
    'dark-gray': '#333',
    'medium-gray': '#666',
    'light-gray': '#eee',
    'accent-yellow': '#ffc107',
    'white': '#fff',
    'border-radius': '8px',
    'shadow': '0 2px 10px rgba(0, 0, 0, 0.1)'
  };

  // ==================== STUDENT MANAGEMENT PROPERTIES ====================

  // Student Form properties
  newStudent = {
    fullName: '',
    studentId: '',
    course: '',
    yearSection: '',
    email: '',
    contact: '',
    rfid: '',
    faceImage: null as File | null
  };

  editStudent = {
    fullName: 'John Doe',
    studentId: '2025-001',
    course: 'BSIT',
    yearSection: '3rd Year - A',
    email: 'john.doe@university.edu',
    contact: '0912-345-6789',
    rfid: 'RFID12345',
    faceImage: null as File | null
  };

  // Student Filter properties
  searchInput = '';
  filterCourse = '';
  filterSection = '';
  filterYear = '';

  // Student Data
  allStudents: Student[] = [];
  filteredStudents: Student[] = [];
  
  // Student Modal state
  isEditModalOpen = false;
  
  // Date display
  todayDate = '';

  // ==================== SHARED PROPERTIES ====================
  
  // Pagination (shared but separate for admin and student)
  adminCurrentPage = 1;
  studentCurrentPage = 1;
  itemsPerPage = 10;
  adminTotalPages = 1;
  studentTotalPages = 1;
  adminTotalItems = 0;
  studentTotalItems = 0;
  
  // View Children
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('editFileInput') editFileInput!: ElementRef;
  @ViewChild('studentFileInput') studentFileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    // Initialize forms
    this.adminForm = this.createAdminForm();
    this.editForm = this.createEditForm();
  }

  // ==================== INITIALIZATION ====================

  ngOnInit(): void {
    this.loadAdmins();
    this.loadSampleStudents();
    this.setCurrentDate();
    this.setCSSVariables();
  }

  private setCurrentDate(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.todayDate = now.toLocaleDateString('en-US', options);
  }

  setCSSVariables(): void {
    const root = document.documentElement;
    Object.entries(this.cssVariables).forEach(([key, value]) => {
      this.renderer.setStyle(root, `--${key}`, value);
    });
  }

  // ==================== FORM CREATION METHODS ====================

  private createAdminForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      profilePic: ['https://via.placeholder.com/120?text=Upload+Photo']
    });
  }

  private createEditForm(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: [''], // readonly but must exist
      password: [''], // optional on edit
      mobile: [''],
      profilePic: ['']
    });
  }

  // ==================== ADMIN MANAGEMENT METHODS ====================

  loadAdmins(): void {
    this.admins = [
      {
        id: 0,
        fullName: 'Juan Dela Cruz',
        email: 'juan.dela.cruz@university.edu',
        mobile: '+63 912 345 6789',
        username: 'juan.dcruz',
        profilePic: 'https://via.placeholder.com/40'
      },
      {
        id: 1,
        fullName: 'Maria Santos',
        email: 'maria.santos@university.edu',
        mobile: '+63 917 890 1234',
        username: 'maria.santos',
        role: 'Moderator',
        profilePic: 'https://via.placeholder.com/40'
      }
    ];

    this.adminTotalItems = this.admins.length;
    this.adminTotalPages = Math.ceil(this.adminTotalItems / this.itemsPerPage);
  }

  createAdmin(): void {
    if (!this.newAdmin.fullName || !this.newAdmin.email) return;

    const newAdmin = {
      ...this.newAdmin,
      id: Date.now()
    };

    this.admins.unshift(newAdmin);

    // Update pagination
    this.adminTotalItems = this.admins.length;
    this.adminTotalPages = Math.ceil(this.adminTotalItems / this.itemsPerPage);

    // Reset form
    this.newAdmin = {
      fullName: '',
      email: '',
      username: '',
      password: '',
      role: '',
      mobile: ''
    };

    this.isAddModalOpen = false;
  }

  editAdmin(adminId: number): void {
    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return;

    this.editingAdminId = admin.id;

    this.editForm.patchValue({
      fullName: admin.fullName,
      email: admin.email,
      username: admin.username,
      password: '', // keep empty
      mobile: admin.mobile,
      profilePic: admin.profilePic
    });

    this.isAddModalOpen = true;
  }

  editAdminFromRow(admin: any): void {
    this.editAdmin(admin.id);
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      this.markFormGroupTouched(this.adminForm);
      this.showAlert('Please fill in all required fields', 'error');
      return;
    }

    const formData = this.adminForm.value;
    
    if (!this.validateEmail(formData.email)) {
      this.showAlert('Please enter a valid email address', 'error');
      return;
    }

    if (formData.password.length < 8) {
      this.showAlert('Password must be at least 8 characters long!', 'error');
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      const newId = this.admins.length > 0 ? Math.max(...this.admins.map(a => a.id)) + 1 : 0;
      
      const newAdmin = {
        id: newId,
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        username: formData.username,
        profilePic: formData.profilePic || 'https://via.placeholder.com/40'
      };

      this.admins.unshift(newAdmin);
      
      this.showAlert('Admin account created successfully!', 'success');
      
      this.adminForm.reset();
      this.adminForm.patchValue({
        profilePic: 'https://via.placeholder.com/120?text=Upload+Photo'
      });
      
      this.adminTotalItems = this.admins.length;
      this.adminTotalPages = Math.ceil(this.adminTotalItems / this.itemsPerPage);
      
      this.isSubmitting = false;
    }, 1000);
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || this.editingAdminId === null) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    this.isUpdating = true;

    setTimeout(() => {
      const formData = this.editForm.value;
      const adminIndex = this.admins.findIndex(
        a => a.id === this.editingAdminId
      );

      if (adminIndex !== -1) {
        this.admins[adminIndex] = {
          ...this.admins[adminIndex],
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          profilePic:
            formData.profilePic || this.admins[adminIndex].profilePic
        };
      }

      this.showAlert('Admin account updated successfully!', 'success');
      this.closeModal();
      this.isUpdating = false;
    }, 1000);
  }

  deleteAdmin(adminId: number): void {
    const admin = this.admins.find(a => a.id === adminId);
    if (admin) {
      this.adminToDelete = admin;
      this.showAlert('Are you sure you want to delete this admin account?', 'warning', 0, true);
    }
  }

  confirmDelete(admin: any): void {
    this.adminToDelete = admin;
    this.showDeleteModal = true;
  }

  executeDelete(): void {
    if (!this.adminToDelete?.id) return;

    this.isDeleting = true;

    setTimeout(() => {
      const adminIndex = this.admins.findIndex(a => a.id === this.adminToDelete.id);
      
      if (adminIndex !== -1) {
        this.admins.splice(adminIndex, 1);
      }

      this.showAlert('Admin account deleted successfully!', 'success');
      this.cancelDelete();
      
      this.adminTotalItems = this.admins.length;
      this.adminTotalPages = Math.ceil(this.adminTotalItems / this.itemsPerPage);
      
      this.isDeleting = false;
    }, 1000);
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.adminToDelete = null;
  }

  closeModal(): void {
    this.isAddModalOpen = false;
    this.editingAdminId = null;
    this.editForm.reset();
  }

  viewAdmin(admin: any): void {
    this.showAlert(
      `<strong>Admin Details</strong><br>
       <strong>Name:</strong> ${admin.fullName}<br>
       <strong>Email:</strong> ${admin.email}<br>
       <strong>Role:</strong> ${admin.role}<br>
       <strong>Username:</strong> ${admin.username}<br>
       <strong>Mobile:</strong> ${admin.mobile || 'N/A'}`,
      'info'
    );
  }

  // ==================== STUDENT MANAGEMENT METHODS ====================

  private loadSampleStudents(): void {
    this.allStudents = [
      {
        id: "2025-001",
        name: "John Michael Doe",
        course: "BSIT",
        yearSection: "3rd Year - A",
        email: "john.doe@university.edu",
        contact: "0912-345-6789",
        rfid: "RFID12345",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-002",
        name: "Jane Marie Smith",
        course: "BSED",
        yearSection: "2nd Year - B",
        email: "jane.smith@university.edu",
        contact: "0912-345-6790",
        rfid: "RFID67890",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-003",
        name: "Robert James Johnson",
        course: "BSCS",
        yearSection: "4th Year - C",
        email: "robert.johnson@university.edu",
        contact: "0912-345-6791",
        rfid: "RFID54321",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-004",
        name: "Maria Santos Garcia",
        course: "BSBA",
        yearSection: "1st Year - A",
        email: "maria.garcia@university.edu",
        contact: "0912-345-6792",
        rfid: "RFID98765",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-005",
        name: "Carlos David Reyes",
        course: "BSIT",
        yearSection: "3rd Year - B",
        email: "carlos.reyes@university.edu",
        contact: "0912-345-6793",
        rfid: "RFID45678",
        faceImage: "https://via.placeholder.com/40"
      }
    ];
    this.filteredStudents = [...this.allStudents];
    this.studentTotalItems = this.allStudents.length;
    this.studentTotalPages = Math.ceil(this.studentTotalItems / this.itemsPerPage);
  }

  applyFilters(): void {
    const search = this.searchInput.toLowerCase();
    
    this.filteredStudents = this.allStudents.filter(student => {
      const matchesSearch = !search || 
        student.name.toLowerCase().includes(search) || 
        student.id.toLowerCase().includes(search);
      
      const matchesCourse = !this.filterCourse || student.course === this.filterCourse;
      const matchesSection = !this.filterSection || student.yearSection.includes(`- ${this.filterSection}`);
      const matchesYear = !this.filterYear || student.yearSection.includes(this.filterYear);
      
      return matchesSearch && matchesCourse && matchesSection && matchesYear;
    });
    
    this.studentCurrentPage = 1;
    this.studentTotalPages = Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  get paginatedStudents(): Student[] {
    const startIndex = (this.studentCurrentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredStudents.slice(startIndex, endIndex);
  }

  get studentTotalPagesCalc(): number {
    return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
  }

  get showingCount(): number {
    const total = this.filteredStudents.length;
    const start = (this.studentCurrentPage - 1) * this.itemsPerPage;
    return Math.min(this.itemsPerPage, total - start);
  }

  registerStudent(): void {
    if (!this.validateStudentForm()) return;

    const newStudent: Student = {
      id: this.newStudent.studentId,
      name: this.newStudent.fullName,
      course: this.newStudent.course,
      yearSection: this.newStudent.yearSection,
      email: this.newStudent.email,
      contact: this.newStudent.contact,
      rfid: this.newStudent.rfid,
      faceImage: "https://via.placeholder.com/40"
    };

    this.allStudents.push(newStudent);
    this.filteredStudents = [...this.allStudents];
    
    // Reset form
    this.newStudent = {
      fullName: '',
      studentId: '',
      course: '',
      yearSection: '',
      email: '',
      contact: '',
      rfid: '',
      faceImage: null
    };
    
    // Update pagination
    this.studentTotalItems = this.allStudents.length;
    this.studentTotalPages = Math.ceil(this.studentTotalItems / this.itemsPerPage);
    this.studentCurrentPage = this.studentTotalPages;
    
    this.showAlert('Student registered successfully!', 'success');
  }

  validateStudentForm(): boolean {
    if (this.allStudents.some(student => student.id === this.newStudent.studentId)) {
      this.showAlert('Student ID already exists!', 'error');
      return false;
    }

    if (this.allStudents.some(student => student.email === this.newStudent.email)) {
      this.showAlert('Email already exists!', 'error');
      return false;
    }

    if (this.allStudents.some(student => student.rfid === this.newStudent.rfid)) {
      this.showAlert('RFID code already exists!', 'error');
      return false;
    }

    if (!this.newStudent.fullName || !this.newStudent.studentId || !this.newStudent.course || 
        !this.newStudent.yearSection || !this.newStudent.email || !this.newStudent.contact || 
        !this.newStudent.rfid) {
      this.showAlert('Please fill in all required fields!', 'error');
      return false;
    }

    return true;
  }

  openEditModal(student: Student): void {
    this.editStudent = {
      fullName: student.name,
      studentId: student.id,
      course: student.course,
      yearSection: student.yearSection,
      email: student.email,
      contact: student.contact,
      rfid: student.rfid,
      faceImage: null
    };
    this.isEditModalOpen = true;
  }

  updateStudent(): void {
    const index = this.allStudents.findIndex(s => s.id === this.editStudent.studentId);
    if (index !== -1) {
      this.allStudents[index] = {
        ...this.allStudents[index],
        name: this.editStudent.fullName,
        course: this.editStudent.course,
        yearSection: this.editStudent.yearSection,
        email: this.editStudent.email,
        contact: this.editStudent.contact,
        rfid: this.editStudent.rfid
      };
      this.filteredStudents = [...this.allStudents];
      this.showAlert('Student information updated successfully!', 'success');
    }
    this.isEditModalOpen = false;
  }

  confirmDeleteStudent(student: Student): void {
    this.showAlert('Are you sure you want to delete this student record? This action cannot be undone.', 'warning', 0, true);
    this.studentToDelete = student;
  }

  studentToDelete: Student | null = null;

  executeStudentDelete(): void {
    if (this.studentToDelete) {
      this.allStudents = this.allStudents.filter(s => s.id !== this.studentToDelete?.id);
      this.filteredStudents = [...this.allStudents];
      
      this.studentTotalItems = this.allStudents.length;
      this.studentTotalPages = Math.ceil(this.studentTotalItems / this.itemsPerPage);
      
      if (this.studentCurrentPage > this.studentTotalPages && this.studentTotalPages > 0) {
        this.studentCurrentPage = this.studentTotalPages;
      }
      
      this.showAlert('Student record deleted successfully.', 'success');
      this.studentToDelete = null;
    }
  }

  exportTableToCSV(): void {
    let csv = [];
    
    const headers = ['Student ID', 'Name', 'Course', 'Year & Section', 'Email', 'Contact', 'RFID'];
    csv.push(headers.join(','));
    
    this.filteredStudents.forEach(student => {
      const row = [
        student.id,
        `"${student.name}"`,
        student.course,
        `"${student.yearSection}"`,
        student.email,
        student.contact,
        student.rfid
      ];
      csv.push(row.join(','));
    });
    
    this.downloadCSV(csv.join('\n'), 'student_list.csv');
    this.showAlert('CSV exported successfully!', 'success');
  }

  private downloadCSV(csv: string, filename: string): void {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  exportTableToExcel(): void {
    let tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8">
        <title>Student List</title>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
          th { background-color: #1a4b8c; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Year & Section</th>
              <th>Email</th>
              <th>Contact</th>
              <th>RFID</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    this.filteredStudents.forEach(student => {
      tableHTML += `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.course}</td>
          <td>${student.yearSection}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td>${student.rfid}</td>
        </tr>
      `;
    });
    
    tableHTML += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.download = 'student_list.xls';
    link.href = window.URL.createObjectURL(blob);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showAlert('Excel exported successfully!', 'success');
  }

  // ==================== SHARED/UTILITY METHODS ====================

  onFileSelected(event: Event, target: 'admin' | 'edit' | 'new' | 'editStudent'): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      
      switch(target) {
        case 'admin':
          this.adminForm.patchValue({ profilePic: imageUrl });
          break;
        case 'edit':
          this.editForm.patchValue({ profilePic: imageUrl });
          break;
        case 'new':
          this.newStudent.faceImage = file;
          break;
        case 'editStudent':
          this.editStudent.faceImage = file;
          break;
      }
    };
    
    if (target === 'new' || target === 'editStudent') {
      // For student face images, we might handle differently
      console.log('Student face image selected:', file.name);
    } else {
      reader.readAsDataURL(file);
    }
  }

  // Pagination methods for admin
  adminNextPage(): void {
    if (this.adminCurrentPage < this.adminTotalPages) {
      this.adminCurrentPage++;
    }
  }

  adminPreviousPage(): void {
    if (this.adminCurrentPage > 1) {
      this.adminCurrentPage--;
    }
  }

  // Pagination methods for student
  studentNextPage(): void {
    if (this.studentCurrentPage < this.studentTotalPages) {
      this.studentCurrentPage++;
    }
  }

  studentPreviousPage(): void {
    if (this.studentCurrentPage > 1) {
      this.studentCurrentPage--;
    }
  }

  togglePasswordVisibility(isEdit: boolean = false): void {
    if (isEdit) {
      this.showEditPassword = !this.showEditPassword;
    } else {
      this.showPassword = !this.showPassword;
    }
  }

  getRoleBadgeClass(role: string): string {
    switch(role) {
      case 'Super Admin': return 'role-super';
      case 'Moderator': return 'role-moderator';
      case 'Viewer': return 'role-viewer';
      default: return '';
    }
  }

  refreshAdmins(): void {
    this.adminCurrentPage = 1;
    this.loadAdmins();
    this.showAlert('Admin list refreshed.', 'info');
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  triggerFileInput(target: 'admin' | 'edit' | 'student'): void {
    switch(target) {
      case 'admin':
        if (this.fileInput) this.fileInput.nativeElement.click();
        break;
      case 'edit':
        if (this.editFileInput) this.editFileInput.nativeElement.click();
        break;
      case 'student':
        if (this.studentFileInput) this.studentFileInput.nativeElement.click();
        break;
    }
  }

  showNotifications(): void {
    this.showAlert('You have 3 new notifications', 'info');
  }

  getAlertClass(alert: any): string {
    return alert.show ? 'alert show' : 'alert';
  }

  // ==================== ALERT SYSTEM ====================

  showAlert(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', 
           duration: number = 5000, showConfirm: boolean = false): void {
    
    const alertId = 'alert-' + Date.now();
    
    const alertConfig = {
      success: {
        icon: 'fas fa-check-circle',
        title: 'Success',
        class: 'alert-success'
      },
      info: {
        icon: 'fas fa-info-circle',
        title: 'Information',
        class: 'alert-info'
      },
      warning: {
        icon: 'fas fa-exclamation-triangle',
        title: 'Warning',
        class: 'alert-warning'
      },
      error: {
        icon: 'fas fa-times-circle',
        title: 'Error',
        class: 'alert-error'
      }
    };
    
    const config = alertConfig[type] || alertConfig.info;
    
    const alert = {
      id: alertId,
      type: type,
      title: config.title,
      message: message,
      showConfirm: showConfirm,
      duration: duration,
      class: config.class,
      icon: config.icon,
      show: false
    };
    
    this.alerts.push(alert);
    
    setTimeout(() => {
      const alertIndex = this.alerts.findIndex(a => a.id === alertId);
      if (alertIndex !== -1) {
        this.alerts[alertIndex].show = true;
      }
    }, 10);
    
    if (duration > 0 && !showConfirm) {
      setTimeout(() => {
        this.removeAlert(alertId);
      }, duration);
    }
  }

  removeAlert(alertId: string): void {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.alerts[alertIndex].show = false;
      
      setTimeout(() => {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
      }, 400);
    }
  }

  onAlertConfirm(alert: any): void {
    if (alert.type === 'warning') {
      if (alert.message.includes('admin') && this.adminToDelete) {
        this.executeDelete();
      } else if (alert.message.includes('student') && this.studentToDelete) {
        this.executeStudentDelete();
      }
    }
    this.removeAlert(alert.id);
  }

  onAlertCancel(alert: any): void {
    this.removeAlert(alert.id);
    if (alert.message.includes('admin')) {
      this.adminToDelete = null;
    } else if (alert.message.includes('student')) {
      this.studentToDelete = null;
    }
  }

  // ==================== FORM GETTERS ====================

  // Admin form getters
  get fullName() { return this.adminForm.get('fullName'); }
  get email() { return this.adminForm.get('email'); }
  get username() { return this.adminForm.get('username'); }
  get password() { return this.adminForm.get('password'); }
  get role() { return this.adminForm.get('role'); }
  
  get editFullName() { return this.editForm.get('fullName'); }
  get editEmail() { return this.editForm.get('email'); }
  get editRole() { return this.editForm.get('role'); }
}