import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Student {
  id: string;
  name: string;
  course: string;
  details: string;
}

interface Grade {
  id: string;
  subject: string;
  subjectCode: string;
  professor: string;
  prelim: string;
  midterm: string;
  finals: string;
  finalGrade: string;
  status: 'Passed' | 'In Progress' | 'Failed';
  schedule?: string;
  room?: string;
  units?: string;
}

interface Stat {
  label: string;
  value: string;
  icon: string;
  color: 'blue' | 'purple' | 'green';
}

interface GradeBreakdown {
  component: string;
  percentage: number;
  score: string;
}

@Component({
  selector: 'app-child-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './child-grades.component.html',

})
export class ChildGradesComponent implements OnInit {
  // Student data
  students: Student[] = [
    { id: 'hadassa', name: 'Hadassa Yap', course: 'IT Student', details: 'BS Information Technology' },
    { id: 'john', name: 'John Yap', course: 'BS Computer Science', details: '3rd Year' },
    { id: 'sarah', name: 'Sarah Yap', course: 'Senior High School', details: 'Grade 12 - STEM' }
  ];
  
  selectedStudent: string = 'hadassa';
  selectedStudentName: string = 'Hadassa Yap';
  selectedStudentDetails: string = 'IT Student - BS Information Technology';

  // Filter options
  terms: string[] = [
    '2024-2025 2nd Term Tertiary',
    '2024-2025 1st Term Tertiary',
    '2023-2024 2nd Term Tertiary',
    '2023-2024 1st Term Tertiary'
  ];
  
  gradeLevels: string[] = ['All Levels', '1st Year', '2nd Year', '3rd Year', '4th Year'];
  statuses: string[] = ['All Status', 'Passed', 'In Progress', 'Failed'];
  
  selectedTerm: string = '2024-2025 2nd Term Tertiary';
  selectedGradeLevel: string = 'All Levels';
  selectedStatus: string = 'All Status';

  // Table headers
  tableHeaders: string[] = ['Subject', 'Professor', 'Prelim', 'Midterm', 'Finals', 'Final Grade', 'Status', 'Actions'];

  // Academic stats
  academicStats: Stat[] = [
    { label: 'Current GPA', value: '3.25', icon: 'fas fa-chart-line', color: 'blue' },
    { label: 'Average Grade', value: '85.5%', icon: 'fas fa-percent', color: 'purple' },
    { label: 'Subjects This Term', value: '6', icon: 'fas fa-book-open', color: 'green' }
  ];

  // Grades data
  currentGrades: Grade[] = [];
  previousGrades: Grade[] = [];

  // Modal
  showGradeModal: boolean = false;
  selectedGrade: Grade | null = null;
  gradeBreakdown: GradeBreakdown[] = [];

  ngOnInit(): void {
    this.loadGrades();
  }

  onStudentChange(studentId: string): void {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      this.selectedStudentName = student.name;
      this.selectedStudentDetails = `${student.course} - ${student.details}`;
      this.loadGrades();
    }
  }

  onFilterChange(): void {
    this.loadGrades();
  }

  clearFilters(): void {
    this.selectedTerm = this.terms[0];
    this.selectedGradeLevel = 'All Levels';
    this.selectedStatus = 'All Status';
    this.loadGrades();
  }

  loadGrades(): void {
    // Mock data - replace with actual API call
    this.currentGrades = this.generateMockGrades('current');
    this.previousGrades = this.generateMockGrades('previous');
  }

  generateMockGrades(type: 'current' | 'previous'): Grade[] {
    const currentSubjects = [
      { 
        subject: 'Web Development', 
        code: 'IT304', 
        professor: 'Prof. Santos',
        prelim: '1.5',
        midterm: '1.75',
        finals: '1.5',
        final: '1.5',
        status: 'In Progress' as const
      },
      { 
        subject: 'Database Management', 
        code: 'IT302', 
        professor: 'Prof. Reyes',
        prelim: '2.0',
        midterm: '2.25',
        finals: '2.0',
        final: '2.0',
        status: 'In Progress' as const
      },
      { 
        subject: 'Network Security', 
        code: 'IT401', 
        professor: 'Prof. Villanueva',
        prelim: '2.5',
        midterm: '2.5',
        finals: '2.25',
        final: '2.5',
        status: 'In Progress' as const
      }
    ];

    const previousSubjects = [
      { 
        subject: 'Programming Fundamentals', 
        code: 'IT101', 
        professor: 'Prof. Garcia',
        prelim: '1.75',
        midterm: '1.5',
        finals: '1.5',
        final: '1.5',
        status: 'Passed' as const
      },
      { 
        subject: 'Computer Organization', 
        code: 'IT102', 
        professor: 'Prof. Mendoza',
        prelim: '2.0',
        midterm: '2.25',
        finals: '2.5',
        final: '2.25',
        status: 'Passed' as const
      },
      { 
        subject: 'Discrete Mathematics', 
        code: 'IT103', 
        professor: 'Prof. Fernandez',
        prelim: '2.5',
        midterm: '2.75',
        finals: '3.0',
        final: '2.75',
        status: 'Failed' as const
      }
    ];

    const subjects = type === 'current' ? currentSubjects : previousSubjects;

    return subjects.map((subj, index) => ({
      id: `${type}-${index}`,
      subject: subj.subject,
      subjectCode: subj.code,
      professor: subj.professor,
      prelim: subj.prelim,
      midterm: subj.midterm,
      finals: subj.finals,
      finalGrade: subj.final,
      status: subj.status,
      schedule: 'MWF 10:00 AM - 11:30 AM',
      room: 'RM 204',
      units: '3.0'
    }));
  }

  viewGradeDetails(grade: Grade): void {
    this.selectedGrade = grade;
    this.loadGradeBreakdown(grade);
    this.showGradeModal = true;
  }

  loadGradeBreakdown(grade: Grade): void {
    // Mock grade breakdown data
    this.gradeBreakdown = [
      { component: 'Quizzes', percentage: 30, score: '85/100' },
      { component: 'Assignments', percentage: 20, score: '90/100' },
      { component: 'Recitation', percentage: 15, score: '88/100' },
      { component: 'Prelim Exam', percentage: 35, score: '82/100' }
    ];
  }

  closeModal(): void {
    this.showGradeModal = false;
    this.selectedGrade = null;
    this.gradeBreakdown = [];
  }

  exportGrades(): void {
    console.log('Exporting grades...');
    // Implement export functionality
  }
}