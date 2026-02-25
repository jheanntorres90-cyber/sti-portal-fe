import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Announcement {
  id: number;
  audience: string;
  course: string;
  subject: string;
  message: string;
  imageName: string;
  date: string;
  status: 'active' | 'inactive' | 'scheduled'; 
  attachments?: Attachment[];
}

interface Attachment {
  name: string;
  type: string;
  url: string;
  file?: File;
}

@Component({
  selector: 'app-admin-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './announcements.html',
})
export class AdminAnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];
  alerts: any[] = [];
  
  // Form models
  newAnnouncement = {
    audience: '',
    course: '',
    subject: '',
    message: '',
    priority: '',
    status: 'active', 
    attachments: [] as Attachment[]
  };
  
  editingAnnouncement: any = null;
  
  // Filter models
  filter = {
    subject: '',
    date: ''
  };
  
  // Modal state
  isModalOpen = false;
  
  constructor() {}
  
  ngOnInit(): void {
    this.loadSampleData();
    this.applyFilters();
  }
  
  loadSampleData(): void {
    this.announcements = [
      {
        id: 1,
        audience: 'General',
        course: '',
        subject: 'System Maintenance',
        message: 'System maintenance scheduled for September 15 from 10 PM to 2 AM.',
        imageName: '',
        date: 'Sept 7, 2025',
        status: 'active' 
      },
      {
        id: 2,
        audience: 'Students',
        course: 'BSIT',
        subject: 'Midterm Examinations',
        message: 'Midterm examinations will begin on October 15. Please check your schedule.',
        imageName: '',
        date: 'Sept 5, 2025',
        status: 'inactive'
      },
      {
        id: 3,
        audience: 'Teachers',
        course: '',
        subject: 'Faculty Meeting',
        message: 'There will be a faculty meeting this Friday at 3 PM in the conference room.',
        imageName: '',
        date: 'Sept 3, 2025',
        status: 'active'
      },
      {
        id: 4,
        audience: 'Parents',
        course: '',
        subject: 'Parent-Teacher Conference',
        message: 'The parent-teacher conference is scheduled for September 20. Please confirm your attendance.',
        imageName: '',
        date: 'Sept 1, 2025',
        status: 'active'
      }
    ];
    this.filteredAnnouncements = [...this.announcements];
  }
  
  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Accept only images for now (can be modified to accept other types)
      if (!file.type.startsWith('image/')) {
        continue;
      }

      this.newAnnouncement.attachments.push({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file
      });
    }

    event.target.value = '';
  }

  removeAttachment(index: number): void {
    this.newAnnouncement.attachments.splice(index, 1);
  }
  
createAnnouncement(): void {
  if (!this.newAnnouncement.audience || !this.newAnnouncement.message) {
    this.showAlert('Please fill in all required fields', 'error');
    return;
  }

  const newId = this.announcements.length > 0
    ? Math.max(...this.announcements.map(a => a.id)) + 1
    : 1;
    
    const newAnnouncement: Announcement = {
    id: newId,
    audience: this.newAnnouncement.audience,
    course: this.newAnnouncement.course || '',
    subject: this.newAnnouncement.subject || '',
    message: this.newAnnouncement.message,
    imageName: this.newAnnouncement.attachments.length > 0
      ? this.newAnnouncement.attachments[0].name
      : '',
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    status: this.newAnnouncement.status as 'active' | 'inactive' | 'scheduled',
    attachments: [...this.newAnnouncement.attachments]
  };

  this.announcements.unshift(newAnnouncement);
  this.filteredAnnouncements = [...this.announcements];

  this.resetForm();
  this.showAlert('Announcement posted successfully!', 'success');
}
  resetForm(): void {
    this.newAnnouncement = {
      audience: '',
      course: '',
      subject: '',
      message: '',
      priority: 'normal',
      status: 'active', 
      attachments: []
    };
  }
  onEditFilesSelected(event: any): void {
  const files: FileList = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    this.editingAnnouncement.attachments.push({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file
    });
  }

  event.target.value = '';
}

removeEditAttachment(index: number): void {
  this.editingAnnouncement.attachments.splice(index, 1);
}
  
editAnnouncement(announcement: Announcement): void {
  this.editingAnnouncement = {
    ...announcement,
    attachments: announcement.attachments
      ? [...announcement.attachments]
      : []
  };

  this.isModalOpen = true;
}
  
  updateAnnouncement(): void {
    if (!this.editingAnnouncement) return;
    
    const index = this.announcements.findIndex((a: Announcement) => a.id === this.editingAnnouncement!.id);
    if (index !== -1) {
      this.announcements[index] = { ...this.editingAnnouncement };
      this.applyFilters();
    }
    
    this.closeModal();
    this.showAlert('Announcement updated successfully!', 'success');
  }
  
  deleteAnnouncement(id: number): void {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    
    this.announcements = this.announcements.filter((a: Announcement) => a.id !== id);
    this.applyFilters();
    this.showAlert('Announcement deleted successfully!', 'success');
  }
  
  applyFilters(): void {
    let filtered = [...this.announcements];

    if (this.filter.subject) {
      const term = this.filter.subject.toLowerCase();
      filtered = filtered.filter(a => 
        a.subject.toLowerCase().includes(term) ||
        a.message.toLowerCase().includes(term)
      );
    }

    if (this.filter.date) {
      filtered = filtered.filter(a => 
        a.date.includes(this.filter.date)
      );
    }

    this.filteredAnnouncements = filtered;
  }
  
  clearFilters(): void {
    this.filter = {
      subject: '',
      date: ''
    };
    this.applyFilters();
  }
  
  closeModal(): void {
    this.isModalOpen = false;
    this.editingAnnouncement = null;
  }
  
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }
  
  exportToCSV(): void {
    const headers = ['Audience', 'Course', 'Subject', 'Message', 'Image', 'Date'];
    const csvData = this.filteredAnnouncements.map(announcement => [
      announcement.audience,
      announcement.course || '-',
      announcement.subject,
      announcement.message,
      announcement.imageName || 'No Image',
      announcement.date
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');
    
    this.downloadFile(csvContent, 'announcements.csv', 'text/csv');
    this.showAlert('CSV exported successfully!', 'success');
  }
  
  exportToExcel(): void {
    // Create a simple HTML table for export
    let tableHtml = '<table border="1">';
    tableHtml += '<thead><tr><th>Audience</th><th>Course</th><th>Subject</th><th>Message</th><th>Image</th><th>Date</th></tr></thead>';
    tableHtml += '<tbody>';
    
    this.filteredAnnouncements.forEach(ann => {
      tableHtml += '<tr>';
      tableHtml += `<td>${ann.audience}</td>`;
      tableHtml += `<td>${ann.course || '-'}</td>`;
      tableHtml += `<td>${ann.subject}</td>`;
      tableHtml += `<td>${ann.message}</td>`;
      tableHtml += `<td>${ann.imageName || 'No Image'}</td>`;
      tableHtml += `<td>${ann.date}</td>`;
      tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Announcements</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body>
          ${tableHtml}
        </body>
      </html>
    `;
    
    this.downloadFile(html, 'announcements.xls', 'application/vnd.ms-excel');
    this.showAlert('Excel file exported successfully!', 'success');
  }
  
  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  
  showAlert(message: string, type: string = 'info', duration: number = 5000): void {
    const alertConfig: any = {
      success: { icon: 'fas fa-check-circle', title: 'Success' },
      info: { icon: 'fas fa-info-circle', title: 'Information' },
      warning: { icon: 'fas fa-exclamation-triangle', title: 'Warning' },
      error: { icon: 'fas fa-times-circle', title: 'Error' }
    };
    
    const config = alertConfig[type];
    const id = 'alert-' + Date.now();
    
    const alert = {
      id,
      type,
      title: config.title,
      message,
      icon: config.icon,
      duration
    };
    
    this.alerts.push(alert);
    
    if (duration > 0) {
      setTimeout(() => {
        this.removeAlert(id);
      }, duration);
    }
  }
  
  removeAlert(id: string): void {
    const alertIndex = this.alerts.findIndex((alert: any) => alert.id === id);
    if (alertIndex !== -1) {
      this.alerts.splice(alertIndex, 1);
    }
  }
  
  formatDate(date: string): string {
    return date;
  }
  
  getAudienceBadgeClass(audience: string): string {
    return `audience-badge audience-${audience.toLowerCase()}`;
  }
  
  showNotifications(): void {
    this.showAlert('You have 3 new notifications', 'info');
  }
}