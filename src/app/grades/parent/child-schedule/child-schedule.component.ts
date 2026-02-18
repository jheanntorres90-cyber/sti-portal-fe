import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  course: string;
  avatar: string;
}

interface ClassSummary {
  totalSubjects: number;
  weeklyHours: number;
  classesToday: number;
  daysWithClasses: string;
}

interface ClassItem {
  code: string;
  name: string;
  professor: string;
  room: string;
  schedule: string;
  time?: string;
  units?: number;
  grade?: string;
}

interface ScheduleSlot {
  time: string;
  [key: string]: any;
}

interface ListScheduleDay {
  day: string;
  classes: string[];
}

@Component({
  selector: 'app-child-schedule',
  templateUrl: './child-schedule.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChildScheduleComponent implements OnInit {
  // Students data
  students: Student[] = [
    { id: 'hadassa', name: 'Hadassa Yap', course: 'BS Information Technology', avatar: 'HY' },
    { id: 'john', name: 'John Yap', course: 'BS Computer Science', avatar: 'JY' },
    { id: 'sarah', name: 'Sarah Yap', course: 'Senior High School', avatar: 'SY' }
  ];

  selectedStudentId = 'hadassa';
  selectedStudentName = 'Hadassa Yap';
  selectedStudentCourse = 'BS Information Technology';
  selectedStudentAvatar = 'HY';

  // Filter options
  terms: string[] = [
    '2024-2025 2nd Term Tertiary',
    '2024-2025 1st Term Tertiary',
    '2023-2024 2nd Term Tertiary',
    '2023-2024 1st Term Tertiary'
  ];
  
  days: { value: string; label: string }[] = [
    { value: 'all', label: 'Entire Week' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' }
  ];

  selectedTerm = '2024-2025 2nd Term Tertiary';
  viewMode: 'weekly' | 'list' = 'weekly';
  selectedDay = 'all';

  // Week days
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weekDaysLower = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Summary data
  summary: ClassSummary = {
    totalSubjects: 6,
    weeklyHours: 18,
    classesToday: 2,
    daysWithClasses: '5/6'
  };

  // Today's date
  todayDate: string = '';

  // Class data
  classData: { [key: string]: ClassItem } = {
    'cc104': {
      code: 'CC104',
      name: 'Information Management',
      professor: 'Prof. Santos',
      room: 'Room 301',
      schedule: 'Mon/Wed 10:00 AM - 11:30 AM',
      time: '10:00 AM - 11:30 AM',
      units: 3,
      grade: '1.5'
    },
    'cs107': {
      code: 'CS107',
      name: 'Web Development',
      professor: 'Prof. Reyes',
      room: 'Lab 204',
      schedule: 'Mon/Wed 1:00 PM - 2:30 PM',
      time: '1:00 PM - 2:30 PM',
      units: 3,
      grade: '1.2'
    },
    'it105': {
      code: 'IT105',
      name: 'Networking Fundamentals',
      professor: 'Prof. Cruz',
      room: 'Lab 205',
      schedule: 'Tue/Thu 9:00 AM - 10:30 AM',
      time: '9:00 AM - 10:30 AM',
      units: 3,
      grade: '1.8'
    },
    'cs108': {
      code: 'CS108',
      name: 'Object-Oriented Programming',
      professor: 'Prof. Villanueva',
      room: 'Lab 202',
      schedule: 'Tue/Thu 1:00 PM - 2:30 PM',
      time: '1:00 PM - 2:30 PM',
      units: 3,
      grade: '1.4'
    },
    'ge106': {
      code: 'GE106',
      name: 'Art Appreciation',
      professor: 'Prof. Dimagiba',
      room: 'Room 105',
      schedule: 'Wed 3:00 PM - 6:00 PM',
      time: '3:00 PM - 6:00 PM',
      units: 3,
      grade: '1.7'
    },
    'pe104': {
      code: 'PE104',
      name: 'Team Sports',
      professor: 'Prof. Mercado',
      room: 'Gymnasium',
      schedule: 'Sat 9:00 AM - 12:00 PM',
      time: '9:00 AM - 12:00 PM',
      units: 2,
      grade: '1.0'
    }
  };

  // Schedule table data
  scheduleTable: ScheduleSlot[] = [
    {
      time: '9:00 AM - 10:30 AM',
      monday: '',
      tuesday: 'it105',
      wednesday: '',
      thursday: 'it105',
      friday: '',
      saturday: ''
    },
    {
      time: '10:00 AM - 11:30 AM',
      monday: 'cc104',
      tuesday: '',
      wednesday: 'cc104',
      thursday: '',
      friday: '',
      saturday: ''
    },
    {
      time: '1:00 PM - 2:30 PM',
      monday: 'cs107',
      tuesday: 'cs108',
      wednesday: 'cs107',
      thursday: 'cs108',
      friday: '',
      saturday: ''
    },
    {
      time: '3:00 PM - 6:00 PM',
      monday: '',
      tuesday: '',
      wednesday: 'ge106',
      thursday: '',
      friday: '',
      saturday: ''
    },
    {
      time: '9:00 AM - 12:00 PM',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: 'pe104'
    }
  ];

  // List view data
  listScheduleData: ListScheduleDay[] = [
    {
      day: 'Monday',
      classes: ['cc104', 'cs107']
    },
    {
      day: 'Tuesday',
      classes: ['it105', 'cs108']
    },
    {
      day: 'Wednesday',
      classes: ['cc104', 'cs107', 'ge106']
    },
    {
      day: 'Thursday',
      classes: ['it105', 'cs108']
    },
    {
      day: 'Friday',
      classes: []
    },
    {
      day: 'Saturday',
      classes: ['pe104']
    }
  ];

  // Today's classes
  todayClasses: any[] = [];

  // Modal
  isModalOpen = false;
  selectedClass: ClassItem | null = null;

  ngOnInit(): void {
    this.updateTodayDate();
    this.loadTodayClasses();
  }

  updateTodayDate(): void {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.todayDate = today.toLocaleDateString('en-US', options);
  }

  loadTodayClasses(): void {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    if (today === 'Saturday') {
      this.todayClasses = [
        {
          time: '9:00 AM - 12:00 PM',
          course: 'PE104 - Team Sports',
          section: 'Section A',
          professor: 'Prof. Mercado',
          room: 'Gymnasium'
        }
      ];
      this.summary.classesToday = 1;
    } else {
      this.todayClasses = [
        {
          time: '10:00 AM - 11:30 AM',
          course: 'CC104 - Information Management',
          section: 'Section B',
          professor: 'Prof. Santos',
          room: 'Room 301'
        },
        {
          time: '1:00 PM - 2:30 PM',
          course: 'CS107 - Web Development',
          section: 'Section A',
          professor: 'Prof. Reyes',
          room: 'Lab 204'
        }
      ];
      this.summary.classesToday = 2;
    }
  }

  onStudentChange(studentId: string): void {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      this.selectedStudentName = student.name;
      this.selectedStudentCourse = student.course;
      this.selectedStudentAvatar = student.avatar;
      // Here you would load the student's schedule data
      this.loadTodayClasses();
    }
  }

  onFilterChange(): void {
    // Implement filter logic here
    console.log('Filters changed:', this.selectedTerm, this.selectedDay);
  }

  onViewModeChange(mode: string): void {
    this.viewMode = mode as 'weekly' | 'list';
  }

  openClassDetails(classKey: string): void {
    this.selectedClass = this.classData[classKey];
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedClass = null;
  }

  hasConflict(classKey: string): boolean {
    // Implement conflict checking logic
    return false;
  }
}