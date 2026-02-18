import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  course: string;
  avatar: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  isRead?: boolean;
}

interface SummaryStat {
  label: string;
  value: number;
  icon: string;
  color: 'blue' | 'purple' | 'yellow' | 'green';
}

interface Filters {
  category: string;
  priority: string;
  dateRange: string;
}

@Component({
  selector: 'app-parent-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './announcements.component.html'
})
export class ParentAnnouncementsComponent implements OnInit {
  // Student Data
  students: Student[] = [
    { id: 'hadassa', name: 'Hadassa Yap', course: 'BS Information Technology', avatar: 'HY' },
    { id: 'john', name: 'John Yap', course: 'BS Computer Science', avatar: 'JY' },
    { id: 'sarah', name: 'Sarah Yap', course: 'Senior High School', avatar: 'SY' }
  ];

  selectedStudentId: string = 'hadassa';
  selectedStudentName: string = 'Hadassa Yap';
  selectedStudentDetails: string = 'IT Student - BS Information Technology';
  selectedStudentAvatar: string = 'HY';

  // Filter Options
  categoryOptions: string[] = ['All Categories', 'Important', 'Academic', 'Events', 'General'];
  priorityOptions: string[] = ['All Priorities', 'High', 'Medium', 'Low'];
  dateRangeOptions: string[] = ['Last 30 Days', 'Last Week', 'Last 3 Months', 'All Time'];

  // Filters
filters: Filters = {
  category: 'All Categories',
  priority: 'All Priorities',
  dateRange: 'All Time'
};

  // Announcements Data
  allAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'School Suspension - Typhoon Warning',
      content: 'Due to the approaching typhoon, classes are suspended tomorrow, June 20, 2025. All students are advised to stay safe and monitor official announcements. Online classes will be conducted asynchronously. Please check your email for assignments and activities from your professors.',
     date: new Date('2026-06-19T08:00:00'),
      priority: 'High',
      category: 'Important',
      attachments: [
        { name: 'typhoon_advisory.pdf', type: 'application/pdf', url: '#' },
        { name: 'safety_tips.jpg', type: 'image/jpeg', url: '#' }
      ]
    },
    {
      id: '2',
      title: 'Midterm Examination Schedule',
      content: 'The midterm examination schedule for the 1st Semester AY 2025-2026 has been released. Please check the attached file for the complete schedule. Exams will run from July 10-20, 2025. Make sure to review your exam rooms and report any conflicts to the Registrar\'s Office immediately.',
      date: new Date('2025-06-18T10:30:00'),
      priority: 'High',
      category: 'Academic',
      attachments: [
        { name: 'midterm_schedule.pdf', type: 'application/pdf', url: '#' }
      ]
    },
    {
      id: '3',
      title: 'Parent-Teacher Conference',
      content: 'We are pleased to invite you to the upcoming Parent-Teacher Conference on June 25, 2025, from 9:00 AM to 4:00 PM. This is a great opportunity to discuss your child\'s academic progress with their instructors. Please sign up for a slot through the Parent Portal.',
      date: new Date('2025-06-17T14:15:00'),
      priority: 'Medium',
      category: 'Events'
    },
    {
      id: '4',
      title: 'New Library Resources Available',
      content: 'The Learning Resource Center has acquired new digital resources including e-books, journals, and research databases. Students can now access these materials remotely using their school credentials. A webinar on how to use these resources will be held on June 22.',
      date: new Date('2025-06-16T09:45:00'),
      priority: 'Low',
      category: 'General'
    },
    {
      id: '5',
      title: 'Scholarship Application Deadline',
      content: 'Reminder: The deadline for academic scholarship applications is fast approaching. Submit your requirements to the Scholarship Office on or before June 30, 2025. Eligibility requirements and application forms are available at the Student Services Office.',
      date: new Date('2025-06-15T11:20:00'),
      priority: 'High',
      category: 'Important'
    }
  ];

  filteredAnnouncements: Announcement[] = [];
  selectedAnnouncement: Announcement | null = null;

  // Summary Stats
  summaryStats: SummaryStat[] = [
    { label: 'Total Announcements', value: 12, icon: 'fas fa-bullhorn', color: 'blue' },
    { label: 'High Priority', value: 3, icon: 'fas fa-exclamation-circle', color: 'purple' },
    { label: 'Unread', value: 5, icon: 'fas fa-envelope', color: 'yellow' },
    { label: 'This Week', value: 2, icon: 'fas fa-calendar-week', color: 'green' }
  ];

  ngOnInit(): void {
    this.applyFilters();
    this.updateSummaryStats();
  }

  onStudentChange(studentId: string): void {
    const selected = this.students.find(s => s.id === studentId);
    if (selected) {
      this.selectedStudentName = selected.name;
      this.selectedStudentDetails = `${selected.course.split(' ')[0]} Student - ${selected.course}`;
      this.selectedStudentAvatar = selected.avatar;
      // Here you would typically fetch announcements for the selected student
      this.applyFilters();
    }
  }

  applyFilters(): void {
    this.filteredAnnouncements = this.allAnnouncements.filter(announcement => {
      // Category filter
      if (this.filters.category !== 'All Categories' && announcement.category !== this.filters.category) {
        return false;
      }

      // Priority filter
      if (this.filters.priority !== 'All Priorities' && announcement.priority !== this.filters.priority) {
        return false;
      }

      // Date range filter
      const now = new Date();
      const announcementDate = new Date(announcement.date);
      
      switch (this.filters.dateRange) {
        case 'Last Week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          if (announcementDate < weekAgo) return false;
          break;
        case 'Last 30 Days':
         const monthAgo = new Date();monthAgo.setDate(monthAgo.getDate() - 30);
          if (announcementDate < monthAgo) return false;
          break;
        case 'Last 3 Months':
          const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
          if (announcementDate < threeMonthsAgo) return false;
          break;
        // 'All Time' shows everything
      }

      return true;
    });

    // Sort by date (newest first)
    this.filteredAnnouncements.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  resetFilters(): void {
    this.filters = {
      category: 'All Categories',
      priority: 'All Priorities',
      dateRange: 'Last 30 Days'
    };
    this.applyFilters();
  }

  openAnnouncement(announcement: Announcement): void {
    this.selectedAnnouncement = announcement;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedAnnouncement = null;
    document.body.style.overflow = 'auto';
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType.startsWith('video/')) return 'fas fa-video';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'fas fa-file-excel';
    return 'fas fa-file';
  }

  private updateSummaryStats(): void {
    // Calculate dynamic stats based on actual announcements
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    this.summaryStats = [
      { label: 'Total Announcements', value: this.allAnnouncements.length, icon: 'fas fa-bullhorn', color: 'blue' },
      { label: 'High Priority', value: this.allAnnouncements.filter(a => a.priority === 'High').length, icon: 'fas fa-exclamation-circle', color: 'purple' },
      { label: 'Unread', value: this.allAnnouncements.filter(a => !a.isRead).length, icon: 'fas fa-envelope', color: 'yellow' },
      { label: 'This Week', value: this.allAnnouncements.filter(a => new Date(a.date) >= weekAgo).length, icon: 'fas fa-calendar-week', color: 'green' }
    ];
  }
}