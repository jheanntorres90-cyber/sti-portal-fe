import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  course: string;
  section: string;
  subject: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: string;
  method: string;
}

@Component({
  selector: 'app-ats-attendance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    CardModule, ButtonModule, TableModule, TagModule, 
    TooltipModule, DialogModule, DropdownModule, 
    InputTextModule, InputTextareaModule, CalendarModule,
    ToastModule
  ],
  providers: [MessageService],
    templateUrl: './attendance.component.html',
    styleUrls: ['./attendance.component.scss']
})
export class AdminAttendanceComponent implements OnInit {
  attendanceRecords: AttendanceRecord[] = [];
  filteredRecords: AttendanceRecord[] = [];
  
  filterForm!: FormGroup;
  editForm!: FormGroup;

  currentPage: number = 1;
  recordsPerPage: number = 10;
  
  summary = {
    present: 0,
    late: 0,
    absent: 0,
    attendanceRate: '0%'
  };
  
  // Modal
  showEditModal: boolean = false;
  selectedRecord: AttendanceRecord | null = null;
  
  // Dropdown Options
  courseOptions = ['BSIT', 'BSED', 'BSCS', 'BSBA'].map(c => ({ label: c, value: c }));
  sectionOptions = ['A', 'B', 'C', 'D'].map(s => ({ label: `Section ${s}`, value: s }));
  subjectOptions = ['Mathematics', 'Science', 'English', 'Programming'].map(s => ({ label: s, value: s }));
  statusOptions = ['Present', 'Late', 'Absent', 'Excused'].map(s => ({ label: s, value: s }));
  methodOptions = ['RFID', 'Face Recognition', 'Manual'].map(m => ({ label: m, value: m }));

  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  ngOnInit(): void {
    this.initForms();
    this.loadSampleData();
    this.setDefaultDateRange();
    this.applyInitialFilters();
    this.updateSummary();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      course: ['', Validators.required],
      section: ['', Validators.required],
      subject: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      studentName: [''],
      studentId: [''],
      date: ['', Validators.required],
      timeIn: ['', Validators.required],
      timeOut: ['', Validators.required],
      status: ['', Validators.required],
      method: ['', Validators.required],
      remarks: ['']
    });
  }

  loadSampleData(): void {
    this.attendanceRecords = [
      {
        id: "ATT001",
        studentId: "2025-001",
        name: "John Michael Doe",
        course: "BSIT",
        section: "A",
        subject: "Mathematics",
        date: "2023-09-11",
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT002",
        studentId: "2025-002",
        name: "Jane Marie Smith",
        course: "BSED",
        section: "B",
        subject: "Science",
        date: "2023-09-11",
        timeIn: "08:15",
        timeOut: "17:00",
        status: "Late",
        method: "Face Recognition"
      },
      {
        id: "ATT003",
        studentId: "2025-003",
        name: "Robert James Johnson",
        course: "BSCS",
        section: "C",
        subject: "Programming",
        date: "2023-09-11",
        timeIn: "",
        timeOut: "",
        status: "Absent",
        method: "Manual"
      },
      {
        id: "ATT004",
        studentId: "2025-004",
        name: "Maria Santos Garcia",
        course: "BSBA",
        section: "A",
        subject: "English",
        date: "2023-09-10",
        timeIn: "08:05",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT005",
        studentId: "2025-005",
        name: "Carlos David Reyes",
        course: "BSIT",
        section: "B",
        subject: "Mathematics",
        date: "2023-09-10",
        timeIn: "08:20",
        timeOut: "17:00",
        status: "Late",
        method: "Face Recognition"
      },
      {
        id: "ATT006",
        studentId: "2025-006",
        name: "Sarah Lynn Tan",
        course: "BSED",
        section: "C",
        subject: "Science",
        date: "2023-09-09",
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT007",
        studentId: "2025-007",
        name: "Michael Anthony Cruz",
        course: "BSCS",
        section: "A",
        subject: "Programming",
        date: "2023-09-09",
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT008",
        studentId: "2025-008",
        name: "Andrea Nicole Lim",
        course: "BSBA",
        section: "B",
        subject: "English",
        date: "2023-09-08",
        timeIn: "",
        timeOut: "",
        status: "Absent",
        method: "Manual"
      },
      {
        id: "ATT009",
        studentId: "2025-009",
        name: "Daniel Patrick Ong",
        course: "BSIT",
        section: "C",
        subject: "Mathematics",
        date: "2023-09-08",
        timeIn: "08:10",
        timeOut: "17:00",
        status: "Present",
        method: "Face Recognition"
      },
      {
        id: "ATT010",
        studentId: "2025-010",
        name: "Christine Ann Torres",
        course: "BSED",
        section: "A",
        subject: "Science",
        date: "2023-09-07",
        timeIn: "08:25",
        timeOut: "17:00",
        status: "Late",
        method: "RFID"
      }
    ];
    
    this.filteredRecords = [...this.attendanceRecords];
  }

  setDefaultDateRange(): void {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    this.filterForm.patchValue({
      fromDate: new Date(oneWeekAgo),
      toDate: new Date(today)
    });
  }

  applyInitialFilters(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.filterForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    const formValues = this.filterForm.value;
    const fromDate = new Date(formValues.fromDate);
    const toDate = new Date(formValues.toDate);
    
    if (fromDate > toDate) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'To date cannot be before from date' });
      return;
    }

    this.filteredRecords = this.attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      
      const inDateRange = recordDate >= fromDate && recordDate <= toDate;
      const matchesCourse = !formValues.course || record.course === formValues.course;
      const matchesSection = !formValues.section || record.section === formValues.section;
      const matchesSubject = !formValues.subject || record.subject === formValues.subject;
      
      return inDateRange && matchesCourse && matchesSection && matchesSubject;
    });

    this.currentPage = 1;
    this.updateSummary();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Filters applied successfully' });
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.setDefaultDateRange();
    this.filteredRecords = [...this.attendanceRecords];
    this.currentPage = 1;
    this.updateSummary();
    this.messageService.add({ severity: 'info', summary: 'Reset', detail: 'Filters reset successfully' });
  }

  updateSummary(): void {
    const present = this.filteredRecords.filter(r => r.status === 'Present').length;
    const late = this.filteredRecords.filter(r => r.status === 'Late').length;
    const absent = this.filteredRecords.filter(r => r.status === 'Absent').length;
    const total = this.filteredRecords.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    this.summary = {
      present,
      late,
      absent,
      attendanceRate: `${rate}%`
    };
  }

  get paginatedRecords(): AttendanceRecord[] {
    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;
    return this.filteredRecords.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.recordsPerPage);
  }

  get showingCount(): number {
    return Math.min(
      this.recordsPerPage,
      this.filteredRecords.length - (this.currentPage - 1) * this.recordsPerPage
    );
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusSeverity(status: string): string {
    switch(status.toLowerCase()) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'danger';
      case 'excused': return 'info';
      default: return 'info';
    }
  }

  getMethodSeverity(method: string): string {
    switch(method.toLowerCase()) {
      case 'rfid': return 'info';
      case 'face recognition': return 'info';
      case 'manual': return 'info';
      default: return 'info';
    }
  }

  openEditModal(record: AttendanceRecord): void {
    this.selectedRecord = record;
    this.editForm.patchValue({
      studentName: record.name,
      studentId: record.studentId,
      date: new Date(record.date),
      timeIn: record.timeIn ? new Date(`2000-01-01T${record.timeIn}:00`) : null,
      timeOut: record.timeOut ? new Date(`2000-01-01T${record.timeOut}:00`) : null,
      status: record.status,
      method: record.method,
      remarks: ''
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedRecord = null;
    this.editForm.reset();
  }

  updateAttendance(): void {
    if (this.editForm.valid && this.selectedRecord) {
      const updatedData = this.editForm.value;
      
      // Format time values
      const timeIn = updatedData.timeIn instanceof Date 
        ? updatedData.timeIn.toTimeString().slice(0, 5) 
        : updatedData.timeIn;
      const timeOut = updatedData.timeOut instanceof Date 
        ? updatedData.timeOut.toTimeString().slice(0, 5) 
        : updatedData.timeOut;
      
      const formattedData = {
        ...updatedData,
        date: updatedData.date instanceof Date 
          ? updatedData.date.toISOString().split('T')[0] 
          : updatedData.date,
        timeIn,
        timeOut
      };
      
      // Update in main records
      const index = this.attendanceRecords.findIndex(r => r.id === this.selectedRecord!.id);
      if (index !== -1) {
        this.attendanceRecords[index] = {
          ...this.attendanceRecords[index],
          ...formattedData
        };
      }
      
      // Update in filtered records
      const filteredIndex = this.filteredRecords.findIndex(r => r.id === this.selectedRecord!.id);
      if (filteredIndex !== -1) {
        this.filteredRecords[filteredIndex] = {
          ...this.filteredRecords[filteredIndex],
          ...formattedData
        };
      }
      
      this.updateSummary();
      this.closeEditModal();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Attendance record updated successfully' });
    }
  }

  deleteRecord(record: AttendanceRecord): void {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      this.attendanceRecords = this.attendanceRecords.filter(r => r.id !== record.id);
      this.filteredRecords = this.filteredRecords.filter(r => r.id !== record.id);
      this.updateSummary();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Attendance record deleted successfully' });
    }
  }

  viewRecord(record: AttendanceRecord): void {
    this.messageService.add({ 
      severity: 'info', 
      summary: 'Record Details', 
      detail: `${record.name} - ${record.status} on ${this.formatDate(record.date)}` 
    });
  }
  exportToCSV(): void {
  if (this.filteredRecords.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'No records to export'
    });
    return;
  }

  this.messageService.add({
    severity: 'info',
    summary: 'CSV Export',
    detail: 'CSV export feature coming soon'
  });
}
exportToExcel(): void {
  if (this.filteredRecords.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'No records to export'
    });
    return;
  }

  this.messageService.add({
    severity: 'info',
    summary: 'Excel Export',
    detail: 'Excel export feature coming soon'
  });
}
generateReport(): void {
  if (this.filteredRecords.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'No records available for report'
    });
    return;
  }

  this.messageService.add({
    severity: 'success',
    summary: 'Report Generated',
    detail: 'Attendance report generated successfully'
  });

 }
 }