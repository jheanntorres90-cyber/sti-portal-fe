import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  avatar: string;
  educationLevel: string;
  course: string;
  yearLevel: string;
  status: string;
  balance: number;
  enrollmentDate: Date;
  dateOfBirth?: Date;
  gender?: string;
  civilStatus?: string;
  address?: string;
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
  emergencyEmail?: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  avatar: string;
  employmentType: string;
  specialization: string;
  designation: string;
  status: string;
  hireDate: Date;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
}

interface TrashItem {
  id: string;
  type: 'Student' | 'Teacher';
  name: string;
  deletedDate: Date;
  originalData: Student | Teacher;
}

interface Alert {
  show: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  activeStudents: number;
  deletedRecords: number;
}

interface PaginationInfo {
  start: number;
  end: number;
  total: number;
}

interface QuickAction {
  icon: string;
  label: string;
  action: string;
  color: string;
}

interface Activity {
  icon: string;
  time: string;
  text: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './records.component.html',

})
export class AdminDashboardComponent implements OnInit {
  // Alert
  alert: Alert = {
    show: false,
    type: 'info',
    message: ''
  };

  // Stats
  stats: Stats = {
    totalStudents: 0,
    totalTeachers: 0,
    activeStudents: 0,
    deletedRecords: 0
  };


  quickActions: QuickAction[] = [
    { icon: 'fas fa-user-plus', label: 'Add Student', action: 'addStudent', color: 'blue' },
    { icon: 'fas fa-chalkboard-teacher', label: 'Add Teacher', action: 'addTeacher', color: 'green' },
    { icon: 'fas fa-upload', label: 'Bulk Import', action: 'bulkImport', color: 'purple' },
    { icon: 'fas fa-download', label: 'Export Data', action: 'export', color: 'orange' }
  ];

  // Activities
  activities: Activity[] = [
    { icon: 'fas fa-user-plus', time: '2 minutes ago', text: 'New student enrolled: John Doe' },
    { icon: 'fas fa-edit', time: '15 minutes ago', text: 'Teacher record updated: Dr. Smith' },
    { icon: 'fas fa-trash', time: '1 hour ago', text: '3 records moved to trash' },
    { icon: 'fas fa-undo', time: '2 hours ago', text: 'Student record restored from trash' }
  ];

  // Tab Management
  activeTab: 'students' | 'teachers' | 'trash' = 'students';

  // Students Data
  allStudents: Student[] = [];
  displayedStudents: Student[] = [];
  selectedStudents: string[] = [];
  isAllStudentsSelected = false;
  
  // Students Search and Filters
  studentSearch = '';
  showStudentFilters = false;
  studentFilters = {
    educationLevel: 'All Levels',
    course: 'All Courses',
    year: 'All Years',
    status: 'All Status'
  };

  // Students Pagination
  currentStudentPage = 1;
  studentsPerPage = 10;
  studentTotalPages = 1;
  studentPaginationInfo: PaginationInfo = { start: 0, end: 0, total: 0 };

  // Teachers Data
  allTeachers: Teacher[] = [];
  displayedTeachers: Teacher[] = [];
  selectedTeachers: string[] = [];
  isAllTeachersSelected = false;
  
  // Teachers Search and Filters
  teacherSearch = '';
  showTeacherFilters = false;
  teacherFilters = {
    employmentType: 'All Types',
    specialization: 'All Specializations',
    designation: 'All Designations',
    status: 'All Status'
  };

  // Teachers Pagination
  currentTeacherPage = 1;
  teachersPerPage = 10;
  teacherTotalPages = 1;
  teacherPaginationInfo: PaginationInfo = { start: 0, end: 0, total: 0 };

  // Trash Data
  trashData: TrashItem[] = [];

  // Modal States
  showAddStudentModal = false;
  showAddTeacherModal = false;
  showEditStudentModal = false;
  showEditTeacherModal = false;
  showStudentDetailsModal = false;
  showTeacherDetailsModal = false;
  showBulkActionsModal = false;

  // Current Editing/Viewing Items
  editingStudent: Student | null = null;
  editingTeacher: Teacher | null = null;
  viewingStudent: Student | null = null;
  viewingTeacher: Teacher | null = null;

  // New Item Forms
  newStudent: Partial<Student> = {};
  newTeacher: Partial<Teacher> = {};

  // Bulk Actions
  bulkActionType = '';
  bulkActionDetails: any = {};
  showBulkActionDetails = false;

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
    this.calculateStats();
    this.updateStudentDisplay();
    this.updateTeacherDisplay();
  }

  // Utility Methods
  encodeURI(str: string): string {
    return encodeURIComponent(str);
  }

  // Alert Methods
  showAlert(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    this.alert = { show: true, type, message };
    setTimeout(() => {
      this.alert.show = false;
    }, 5000);
  }

  // Stats Methods
  calculateStats(): void {
    this.stats = {
      totalStudents: this.allStudents.length,
      totalTeachers: this.allTeachers.length,
      activeStudents: this.allStudents.filter(s => s.status === 'Active').length,
      deletedRecords: this.trashData.length
    };
  }

  // Stat Click Handler
  handleStatClick(stat: any): void {
    if (stat.label === 'Total Students') {
      this.switchTab('students');
    } else if (stat.label === 'Total Teachers') {
      this.switchTab('teachers');
    } else if (stat.label === 'Deleted Records') {
      this.switchTab('trash');
    }
  }

  // Quick Action Handler
  handleQuickAction(action: string): void {
    switch(action) {
      case 'addStudent':
        this.openAddStudentModal();
        break;
      case 'addTeacher':
        this.openAddTeacherModal();
        break;
      case 'bulkImport':
        this.showAlert('info', 'Bulk import feature coming soon!');
        break;
      case 'export':
        this.showAlert('info', 'Export feature coming soon!');
        break;
    }
  }

  // Tab Management
  switchTab(tab: 'students' | 'teachers' | 'trash'): void {
    this.activeTab = tab;
  }

  // Status Badge Class
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'Graduated': 'status-graduated',
      'Dropped': 'status-dropped',
      'On Leave': 'status-on-leave'
    };
    return statusMap[status] || 'status-default';
  }

  // ==================== STUDENT METHODS ====================

  // Load Mock Students Data
  loadMockStudents(): Student[] {
    return [
      {
        id: 'STU-2024-001',
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Michael',
        email: 'john.doe@email.com',
        phone: '+63 912 345 6789',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=1a4b8c&color=fff',
        educationLevel: 'College',
        course: 'Computer Science',
        yearLevel: '3rd Year',
        status: 'Active',
        balance: 25000,
        enrollmentDate: new Date('2024-01-15'),
        dateOfBirth: new Date('2002-05-15'),
        gender: 'male',
        civilStatus: 'single',
        address: '123 Main St, Manila',
        emergencyName: 'Jane Doe',
        emergencyRelationship: 'Mother',
        emergencyPhone: '+63 923 456 7890',
        emergencyEmail: 'jane.doe@email.com'
      },
      {
        id: 'STU-2024-002',
        firstName: 'Maria',
        lastName: 'Santos',
        middleName: 'Cruz',
        email: 'maria.santos@email.com',
        phone: '+63 927 891 2345',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=1a4b8c&color=fff',
        educationLevel: 'College',
        course: 'Information Technology',
        yearLevel: '2nd Year',
        status: 'Active',
        balance: 0,
        enrollmentDate: new Date('2024-01-20'),
        dateOfBirth: new Date('2003-08-22'),
        gender: 'female',
        civilStatus: 'single',
        address: '456 Oak St, Quezon City',
        emergencyName: 'Pedro Santos',
        emergencyRelationship: 'Father',
        emergencyPhone: '+63 918 765 4321',
        emergencyEmail: 'pedro.santos@email.com'
      },
      {
        id: 'STU-2024-003',
        firstName: 'James',
        lastName: 'Wilson',
        middleName: 'Robert',
        email: 'james.wilson@email.com',
        phone: '+63 915 678 1234',
        avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=1a4b8c&color=fff',
        educationLevel: 'College',
        course: 'Business Administration',
        yearLevel: '4th Year',
        status: 'Active',
        balance: 15000,
        enrollmentDate: new Date('2023-08-10'),
        dateOfBirth: new Date('2001-11-30'),
        gender: 'male',
        civilStatus: 'single',
        address: '789 Pine St, Makati',
        emergencyName: 'Sarah Wilson',
        emergencyRelationship: 'Mother',
        emergencyPhone: '+63 926 543 2109',
        emergencyEmail: 'sarah.wilson@email.com'
      },
      {
        id: 'STU-2024-004',
        firstName: 'Anna',
        lastName: 'Reyes',
        middleName: 'Luna',
        email: 'anna.reyes@email.com',
        phone: '+63 919 234 5678',
        avatar: 'https://ui-avatars.com/api/?name=Anna+Reyes&background=1a4b8c&color=fff',
        educationLevel: 'College',
        course: 'Engineering',
        yearLevel: '1st Year',
        status: 'Inactive',
        balance: 5000,
        enrollmentDate: new Date('2024-02-01'),
        dateOfBirth: new Date('2004-03-10'),
        gender: 'female',
        civilStatus: 'single',
        address: '321 Cedar St, Pasig',
        emergencyName: 'Mark Reyes',
        emergencyRelationship: 'Brother',
        emergencyPhone: '+63 917 890 1234',
        emergencyEmail: 'mark.reyes@email.com'
      },
      {
        id: 'STU-2023-105',
        firstName: 'Michael',
        lastName: 'Tan',
        middleName: 'Sy',
        email: 'michael.tan@email.com',
        phone: '+63 922 345 6781',
        avatar: 'https://ui-avatars.com/api/?name=Michael+Tan&background=1a4b8c&color=fff',
        educationLevel: 'College',
        course: 'Computer Science',
        yearLevel: '4th Year',
        status: 'Graduated',
        balance: 0,
        enrollmentDate: new Date('2023-06-15'),
        dateOfBirth: new Date('2001-12-05'),
        gender: 'male',
        civilStatus: 'single',
        address: '654 Maple St, Mandaluyong',
        emergencyName: 'Lisa Tan',
        emergencyRelationship: 'Mother',
        emergencyPhone: '+63 928 765 4321',
        emergencyEmail: 'lisa.tan@email.com'
      }
    ];
  }

  // Student Search
  onStudentSearchChange(): void {
    this.currentStudentPage = 1;
    this.updateStudentDisplay();
  }

  // Student Filters
  applyStudentFilters(): void {
    this.currentStudentPage = 1;
    this.updateStudentDisplay();
    this.showAlert('success', 'Filters applied successfully');
  }

  clearStudentFilters(): void {
    this.studentFilters = {
      educationLevel: 'All Levels',
      course: 'All Courses',
      year: 'All Years',
      status: 'All Status'
    };
    this.currentStudentPage = 1;
    this.updateStudentDisplay();
    this.showAlert('info', 'Filters cleared');
  }

  // Student Selection
  toggleAllStudents(): void {
    if (this.isAllStudentsSelected) {
      this.selectedStudents = this.displayedStudents.map(s => s.id);
    } else {
      this.selectedStudents = [];
    }
  }

  toggleStudentSelection(studentId: string): void {
    const index = this.selectedStudents.indexOf(studentId);
    if (index === -1) {
      this.selectedStudents.push(studentId);
    } else {
      this.selectedStudents.splice(index, 1);
    }
    this.isAllStudentsSelected = this.displayedStudents.every(s => this.selectedStudents.includes(s.id));
  }

  // Student Display Update with Pagination
  updateStudentDisplay(): void {
    let filtered = [...this.allStudents];

    // Apply search
    if (this.studentSearch) {
      const searchLower = this.studentSearch.toLowerCase();
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.id.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (this.studentFilters.educationLevel !== 'All Levels') {
      filtered = filtered.filter(s => s.educationLevel === this.studentFilters.educationLevel);
    }
    if (this.studentFilters.course !== 'All Courses') {
      filtered = filtered.filter(s => s.course === this.studentFilters.course);
    }
    if (this.studentFilters.year !== 'All Years') {
      filtered = filtered.filter(s => s.yearLevel === this.studentFilters.year);
    }
    if (this.studentFilters.status !== 'All Status') {
      filtered = filtered.filter(s => s.status === this.studentFilters.status);
    }

    // Update pagination
    this.studentTotalPages = Math.ceil(filtered.length / this.studentsPerPage);
    const start = (this.currentStudentPage - 1) * this.studentsPerPage;
    const end = Math.min(start + this.studentsPerPage, filtered.length);
    
    this.displayedStudents = filtered.slice(start, end);
    this.studentPaginationInfo = {
      start: filtered.length > 0 ? start + 1 : 0,
      end: end,
      total: filtered.length
    };
  }

  // Student Pagination
  previousStudentPage(): void {
    if (this.currentStudentPage > 1) {
      this.currentStudentPage--;
      this.updateStudentDisplay();
    }
  }

  nextStudentPage(): void {
    if (this.currentStudentPage < this.studentTotalPages) {
      this.currentStudentPage++;
      this.updateStudentDisplay();
    }
  }

  goToStudentPage(page: number): void {
    this.currentStudentPage = page;
    this.updateStudentDisplay();
  }

  // Student CRUD Operations
  openAddStudentModal(): void {
    this.newStudent = {};
    this.showAddStudentModal = true;
  }

  closeAddStudentModal(): void {
    this.showAddStudentModal = false;
    this.newStudent = {};
  }

  addStudent(): void {
    // Generate a new student ID
    const newId = `STU-${new Date().getFullYear()}-${String(this.allStudents.length + 1).padStart(3, '0')}`;
    
    const student: Student = {
      id: newId,
      firstName: this.newStudent.firstName || '',
      lastName: this.newStudent.lastName || '',
      middleName: this.newStudent.middleName || '',
      email: this.newStudent.email || '',
      phone: this.newStudent.phone || '',
      avatar: `https://ui-avatars.com/api/?name=${this.newStudent.firstName}+${this.newStudent.lastName}&background=1a4b8c&color=fff`,
      educationLevel: this.newStudent.educationLevel || '',
      course: this.newStudent.course || '',
      yearLevel: this.newStudent.yearLevel || '',
      status: 'Active',
      balance: 0,
      enrollmentDate: new Date(),
      dateOfBirth: this.newStudent.dateOfBirth,
      gender: this.newStudent.gender,
      civilStatus: this.newStudent.civilStatus || 'single',
      address: this.newStudent.address,
      emergencyName: this.newStudent.emergencyName,
      emergencyRelationship: this.newStudent.emergencyRelationship,
      emergencyPhone: this.newStudent.emergencyPhone,
      emergencyEmail: this.newStudent.emergencyEmail
    };

    this.allStudents.push(student);
    this.calculateStats();
    this.updateStudentDisplay();
    this.closeAddStudentModal();
    this.showAlert('success', 'Student added successfully');
  }

  viewStudent(student: Student): void {
    this.viewingStudent = { ...student };
    this.showStudentDetailsModal = true;
  }

  closeStudentDetailsModal(): void {
    this.showStudentDetailsModal = false;
    this.viewingStudent = null;
  }

  editStudent(student: Student): void {
    this.editingStudent = { ...student };
    this.showEditStudentModal = true;
  }

  closeEditStudentModal(): void {
    this.showEditStudentModal = false;
    this.editingStudent = null;
  }

  updateStudent(): void {
    if (this.editingStudent) {
      const index = this.allStudents.findIndex(s => s.id === this.editingStudent?.id);
      if (index !== -1) {
        this.allStudents[index] = { ...this.editingStudent };
        this.updateStudentDisplay();
        this.closeEditStudentModal();
        this.showAlert('success', 'Student updated successfully');
      }
    }
  }

  softDeleteStudent(student: Student): void {
    // Move to trash
    const trashItem: TrashItem = {
      id: student.id,
      type: 'Student',
      name: `${student.firstName} ${student.lastName}`,
      deletedDate: new Date(),
      originalData: { ...student }
    };
    
    this.trashData.push(trashItem);
    
    // Remove from active students
    this.allStudents = this.allStudents.filter(s => s.id !== student.id);
    this.selectedStudents = this.selectedStudents.filter(id => id !== student.id);
    
    this.calculateStats();
    this.updateStudentDisplay();
    this.showAlert('warning', 'Student moved to trash');
  }

  // ==================== TEACHER METHODS ====================

  // Load Mock Teachers Data
  loadMockTeachers(): Teacher[] {
    return [
      {
        id: 'TCH-2024-001',
        firstName: 'Robert',
        lastName: 'Smith',
        middleName: 'James',
        email: 'robert.smith@email.com',
        phone: '+63 917 123 4567',
        avatar: 'https://ui-avatars.com/api/?name=Robert+Smith&background=1a4b8c&color=fff',
        employmentType: 'Full-time',
        specialization: 'Computer Science',
        designation: 'Professor',
        status: 'Active',
        hireDate: new Date('2020-08-15'),
        dateOfBirth: new Date('1980-03-12'),
        gender: 'male',
        address: '123 Academic Ave, Manila'
      },
      {
        id: 'TCH-2024-002',
        firstName: 'Elizabeth',
        lastName: 'Johnson',
        middleName: 'Marie',
        email: 'elizabeth.johnson@email.com',
        phone: '+63 918 234 5678',
        avatar: 'https://ui-avatars.com/api/?name=Elizabeth+Johnson&background=1a4b8c&color=fff',
        employmentType: 'Full-time',
        specialization: 'Information Technology',
        designation: 'Associate Professor',
        status: 'Active',
        hireDate: new Date('2019-01-10'),
        dateOfBirth: new Date('1982-07-25'),
        gender: 'female',
        address: '456 Teacher Lane, Quezon City'
      },
      {
        id: 'TCH-2024-003',
        firstName: 'David',
        lastName: 'Brown',
        middleName: 'William',
        email: 'david.brown@email.com',
        phone: '+63 919 345 6789',
        avatar: 'https://ui-avatars.com/api/?name=David+Brown&background=1a4b8c&color=fff',
        employmentType: 'Part-time',
        specialization: 'Engineering',
        designation: 'Instructor',
        status: 'Active',
        hireDate: new Date('2021-11-20'),
        dateOfBirth: new Date('1985-09-18'),
        gender: 'male',
        address: '789 Faculty Drive, Makati'
      },
      {
        id: 'TCH-2024-004',
        firstName: 'Sarah',
        lastName: 'Davis',
        middleName: 'Anne',
        email: 'sarah.davis@email.com',
        phone: '+63 920 456 7890',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Davis&background=1a4b8c&color=fff',
        employmentType: 'Contractual',
        specialization: 'Business Administration',
        designation: 'Lecturer',
        status: 'On Leave',
        hireDate: new Date('2022-03-01'),
        dateOfBirth: new Date('1988-12-03'),
        gender: 'female',
        address: '321 Education Road, Pasig'
      }
    ];
  }

  // Teacher Search
  onTeacherSearchChange(): void {
    this.currentTeacherPage = 1;
    this.updateTeacherDisplay();
  }

  // Teacher Filters
  applyTeacherFilters(): void {
    this.currentTeacherPage = 1;
    this.updateTeacherDisplay();
    this.showAlert('success', 'Filters applied successfully');
  }

  clearTeacherFilters(): void {
    this.teacherFilters = {
      employmentType: 'All Types',
      specialization: 'All Specializations',
      designation: 'All Designations',
      status: 'All Status'
    };
    this.currentTeacherPage = 1;
    this.updateTeacherDisplay();
    this.showAlert('info', 'Filters cleared');
  }

  // Teacher Selection
  toggleAllTeachers(): void {
    if (this.isAllTeachersSelected) {
      this.selectedTeachers = this.displayedTeachers.map(t => t.id);
    } else {
      this.selectedTeachers = [];
    }
  }

  toggleTeacherSelection(teacherId: string): void {
    const index = this.selectedTeachers.indexOf(teacherId);
    if (index === -1) {
      this.selectedTeachers.push(teacherId);
    } else {
      this.selectedTeachers.splice(index, 1);
    }
    this.isAllTeachersSelected = this.displayedTeachers.every(t => this.selectedTeachers.includes(t.id));
  }

  // Teacher Display Update with Pagination
  updateTeacherDisplay(): void {
    let filtered = [...this.allTeachers];

    // Apply search
    if (this.teacherSearch) {
      const searchLower = this.teacherSearch.toLowerCase();
      filtered = filtered.filter(teacher =>
        teacher.firstName.toLowerCase().includes(searchLower) ||
        teacher.lastName.toLowerCase().includes(searchLower) ||
        teacher.id.toLowerCase().includes(searchLower) ||
        teacher.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (this.teacherFilters.employmentType !== 'All Types') {
      filtered = filtered.filter(t => t.employmentType === this.teacherFilters.employmentType);
    }
    if (this.teacherFilters.specialization !== 'All Specializations') {
      filtered = filtered.filter(t => t.specialization === this.teacherFilters.specialization);
    }
    if (this.teacherFilters.designation !== 'All Designations') {
      filtered = filtered.filter(t => t.designation === this.teacherFilters.designation);
    }
    if (this.teacherFilters.status !== 'All Status') {
      filtered = filtered.filter(t => t.status === this.teacherFilters.status);
    }

    // Update pagination
    this.teacherTotalPages = Math.ceil(filtered.length / this.teachersPerPage);
    const start = (this.currentTeacherPage - 1) * this.teachersPerPage;
    const end = Math.min(start + this.teachersPerPage, filtered.length);
    
    this.displayedTeachers = filtered.slice(start, end);
    this.teacherPaginationInfo = {
      start: filtered.length > 0 ? start + 1 : 0,
      end: end,
      total: filtered.length
    };
  }

  // Teacher Pagination
  previousTeacherPage(): void {
    if (this.currentTeacherPage > 1) {
      this.currentTeacherPage--;
      this.updateTeacherDisplay();
    }
  }

  nextTeacherPage(): void {
    if (this.currentTeacherPage < this.teacherTotalPages) {
      this.currentTeacherPage++;
      this.updateTeacherDisplay();
    }
  }

  goToTeacherPage(page: number): void {
    this.currentTeacherPage = page;
    this.updateTeacherDisplay();
  }

  // Teacher CRUD Operations
  openAddTeacherModal(): void {
    this.newTeacher = {};
    this.showAddTeacherModal = true;
  }

  closeAddTeacherModal(): void {
    this.showAddTeacherModal = false;
    this.newTeacher = {};
  }

  addTeacher(): void {
    // Generate a new teacher ID
    const newId = `TCH-${new Date().getFullYear()}-${String(this.allTeachers.length + 1).padStart(3, '0')}`;
    
    const teacher: Teacher = {
      id: newId,
      firstName: this.newTeacher.firstName || '',
      lastName: this.newTeacher.lastName || '',
      middleName: this.newTeacher.middleName || '',
      email: this.newTeacher.email || '',
      phone: this.newTeacher.phone || '',
      avatar: `https://ui-avatars.com/api/?name=${this.newTeacher.firstName}+${this.newTeacher.lastName}&background=1a4b8c&color=fff`,
      employmentType: this.newTeacher.employmentType || 'Full-time',
      specialization: this.newTeacher.specialization || '',
      designation: this.newTeacher.designation || 'Instructor',
      status: this.newTeacher.status || 'Active',
      hireDate: new Date(),
      dateOfBirth: this.newTeacher.dateOfBirth,
      gender: this.newTeacher.gender,
      address: this.newTeacher.address
    };

    this.allTeachers.push(teacher);
    this.calculateStats();
    this.updateTeacherDisplay();
    this.closeAddTeacherModal();
    this.showAlert('success', 'Teacher added successfully');
  }

  viewTeacher(teacher: Teacher): void {
    this.viewingTeacher = { ...teacher };
    this.showTeacherDetailsModal = true;
  }

  closeTeacherDetailsModal(): void {
    this.showTeacherDetailsModal = false;
    this.viewingTeacher = null;
  }

  editTeacher(teacher: Teacher): void {
    this.editingTeacher = { ...teacher };
    this.showEditTeacherModal = true;
  }

  closeEditTeacherModal(): void {
    this.showEditTeacherModal = false;
    this.editingTeacher = null;
  }

  updateTeacher(): void {
    if (this.editingTeacher) {
      const index = this.allTeachers.findIndex(t => t.id === this.editingTeacher?.id);
      if (index !== -1) {
        this.allTeachers[index] = { ...this.editingTeacher };
        this.updateTeacherDisplay();
        this.closeEditTeacherModal();
        this.showAlert('success', 'Teacher updated successfully');
      }
    }
  }

  softDeleteTeacher(teacher: Teacher): void {
    // Move to trash
    const trashItem: TrashItem = {
      id: teacher.id,
      type: 'Teacher',
      name: `${teacher.firstName} ${teacher.lastName}`,
      deletedDate: new Date(),
      originalData: { ...teacher }
    };
    
    this.trashData.push(trashItem);
    
    // Remove from active teachers
    this.allTeachers = this.allTeachers.filter(t => t.id !== teacher.id);
    this.selectedTeachers = this.selectedTeachers.filter(id => id !== teacher.id);
    
    this.calculateStats();
    this.updateTeacherDisplay();
    this.showAlert('warning', 'Teacher moved to trash');
  }

  // ==================== TRASH METHODS ====================

  restoreRecord(item: TrashItem): void {
    if (item.type === 'Student') {
      const student = item.originalData as Student;
      this.allStudents.push(student);
    } else {
      const teacher = item.originalData as Teacher;
      this.allTeachers.push(teacher);
    }
    
    // Remove from trash
    this.trashData = this.trashData.filter(t => t.id !== item.id);
    
    this.calculateStats();
    this.updateStudentDisplay();
    this.updateTeacherDisplay();
    this.showAlert('success', 'Record restored successfully');
  }

  permanentlyDeleteRecord(item: TrashItem): void {
    if (confirm('Are you sure you want to permanently delete this record? This action cannot be undone.')) {
      this.trashData = this.trashData.filter(t => t.id !== item.id);
      this.calculateStats();
      this.showAlert('error', 'Record permanently deleted');
    }
  }

  emptyTrash(): void {
    if (confirm('Are you sure you want to permanently delete all items in trash? This action cannot be undone.')) {
      this.trashData = [];
      this.calculateStats();
      this.showAlert('error', 'Trash emptied');
    }
  }

  // ==================== BULK ACTIONS METHODS ====================

  openBulkActionsModal(): void {
    this.bulkActionType = '';
    this.bulkActionDetails = {};
    this.showBulkActionDetails = false;
    this.showBulkActionsModal = true;
  }

  closeBulkActionsModal(): void {
    this.showBulkActionsModal = false;
    this.bulkActionType = '';
    this.bulkActionDetails = {};
    this.showBulkActionDetails = false;
  }

  onBulkActionTypeChange(): void {
    this.showBulkActionDetails = !!this.bulkActionType;
    this.bulkActionDetails = {};
  }

  processBulkAction(): void {
    const selectedIds = this.activeTab === 'students' ? this.selectedStudents : this.selectedTeachers;
    
    if (selectedIds.length === 0) {
      this.showAlert('error', 'No items selected');
      return;
    }

    switch(this.bulkActionType) {
      case 'status':
        this.processBulkStatusUpdate();
        break;
      case 'course':
        this.processBulkCourseUpdate();
        break;
      case 'year':
        this.processBulkYearUpdate();
        break;
      case 'export':
        this.processBulkExport();
        break;
      case 'delete':
        this.processBulkDelete();
        break;
      default:
        this.showAlert('error', 'Please select an action');
    }
    
    this.closeBulkActionsModal();
  }

  processBulkStatusUpdate(): void {
    if (this.activeTab === 'students') {
      this.allStudents = this.allStudents.map(student => {
        if (this.selectedStudents.includes(student.id)) {
          return { ...student, status: this.bulkActionDetails.newStatus };
        }
        return student;
      });
      this.showAlert('success', `Updated ${this.selectedStudents.length} students' status`);
    } else {
      this.allTeachers = this.allTeachers.map(teacher => {
        if (this.selectedTeachers.includes(teacher.id)) {
          return { ...teacher, status: this.bulkActionDetails.newStatus };
        }
        return teacher;
      });
      this.showAlert('success', `Updated ${this.selectedTeachers.length} teachers' status`);
    }
    
    this.selectedStudents = [];
    this.selectedTeachers = [];
    this.updateStudentDisplay();
    this.updateTeacherDisplay();
  }

  processBulkCourseUpdate(): void {
    if (this.activeTab === 'students') {
      this.allStudents = this.allStudents.map(student => {
        if (this.selectedStudents.includes(student.id)) {
          return { ...student, course: this.bulkActionDetails.newCourse };
        }
        return student;
      });
      this.showAlert('success', `Updated ${this.selectedStudents.length} students' courses`);
    } else {
      this.allTeachers = this.allTeachers.map(teacher => {
        if (this.selectedTeachers.includes(teacher.id)) {
          return { ...teacher, specialization: this.bulkActionDetails.newSpecialization };
        }
        return teacher;
      });
      this.showAlert('success', `Updated ${this.selectedTeachers.length} teachers' specializations`);
    }
    
    this.selectedStudents = [];
    this.selectedTeachers = [];
    this.updateStudentDisplay();
    this.updateTeacherDisplay();
  }

  processBulkYearUpdate(): void {
    if (this.activeTab === 'students') {
      this.allStudents = this.allStudents.map(student => {
        if (this.selectedStudents.includes(student.id)) {
          return { ...student, yearLevel: this.bulkActionDetails.newYear };
        }
        return student;
      });
      this.showAlert('success', `Updated ${this.selectedStudents.length} students' year levels`);
    }
    
    this.selectedStudents = [];
    this.updateStudentDisplay();
  }

  processBulkExport(): void {
    let dataToExport = [];
    
    if (this.activeTab === 'students') {
      dataToExport = this.allStudents.filter(s => this.selectedStudents.includes(s.id));
      this.showAlert('success', `Exporting ${dataToExport.length} students as ${this.bulkActionDetails.exportFormat}`);
    } else {
      dataToExport = this.allTeachers.filter(t => this.selectedTeachers.includes(t.id));
      this.showAlert('success', `Exporting ${dataToExport.length} teachers as ${this.bulkActionDetails.exportFormat}`);
    }
    
    // Here you would implement actual export logic
    console.log('Exporting:', dataToExport);
  }

  processBulkDelete(): void {
    if (this.activeTab === 'students') {
      this.selectedStudents.forEach(studentId => {
        const student = this.allStudents.find(s => s.id === studentId);
        if (student) {
          this.softDeleteStudent(student);
        }
      });
    } else {
      this.selectedTeachers.forEach(teacherId => {
        const teacher = this.allTeachers.find(t => t.id === teacherId);
        if (teacher) {
          this.softDeleteTeacher(teacher);
        }
      });
    }
    
    this.selectedStudents = [];
    this.selectedTeachers = [];
    this.showAlert('warning', `${this.activeTab === 'students' ? this.selectedStudents.length : this.selectedTeachers.length} items moved to trash`);
  }

  // ==================== DATA INITIALIZATION ====================

  loadMockData(): void {
    this.allStudents = this.loadMockStudents();
    this.allTeachers = this.loadMockTeachers();
    this.trashData = [];
    
    // Add some sample trash items
    this.trashData.push({
      id: 'STU-2023-999',
      type: 'Student',
      name: 'Test Student',
      deletedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      originalData: {} as Student
    });
    
    this.trashData.push({
      id: 'TCH-2023-999',
      type: 'Teacher',
      name: 'Test Teacher',
      deletedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      originalData: {} as Teacher
    });
  }
}