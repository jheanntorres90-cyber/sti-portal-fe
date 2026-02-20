// landing.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/service/auth.service'; // adjust path kung iba
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  // ---------- FAQ Data (from faq.component.ts) ----------
  faqItems = [
    {
      question: 'How do I use my RFID tag for attendance?',
      answer:
        'Simply tap your student ID card on the RFID reader located at the classroom entrance. The system will record your attendance in real-time and notify your instructor. Ensure the card is within 2-3cm of the reader for a successful scan.',
      isOpen: false,
    },
    {
      question: 'What should I do if I lose my Student ID?',
      answer:
        'Report lost ID cards immediately to the Registrar or Security Office. Once reported, the old RFID tag will be deactivated to prevent unauthorized gate entry, and a replacement card with a new unique ID will be issued.',
      isOpen: false,
    },
    {
      question: 'How do parents receive attendance notifications?',
      answer:
        'Notifications are automatically sent via the Semaphore SMS gateway and email as soon as a student taps their ID at the main gate. Parents can update their contact information through the Parent Portal to ensure they receive these alerts.',
      isOpen: false,
    },
    {
      question: 'Why can’t I view my grades in the portal?',
      answer:
        'Grade viewing is enabled once the accounting office clears your tuition balance. If your balance is settled and you still cannot see your grades, please contact the Registrar for system access assistance.',
      isOpen: false,
    },
    {
      question: 'Is the facial recognition at the gate mandatory?',
      answer:
        'Yes, the identity verification system at the gate uses facial recognition alongside your ID scan for enhanced campus security. This ensures that the person entering the campus is the actual owner of the ID being used.',
      isOpen: false,
    },
  ];

  // ---------- Gallery Data (from school-showcase.component.ts) ----------
  campusImages = [
    {
      src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      alt: 'Gate Entry Terminal',
      title: 'Gate Entry Verification',
      description:
        'Facial recognition and RFID integration at the STI Bacoor main entrance.',
    },
    {
      src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      alt: 'Real-time Attendance',
      title: 'RFID Attendance Logs',
      description:
        'Automated classroom logging system with sub-second processing speed.',
    },
    {
      src: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      alt: 'SMS Notification System',
      title: 'Parent Alert System',
      description:
        'Real-time SMS notifications sent via Semaphore API for student security.',
    },
    {
      src: 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      alt: 'Admin Control Center',
      title: 'Centralized Dashboard',
      description:
        'Master control panel for administrators to manage student and faculty records.',
    },
    {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      alt: 'Student Grade Portal',
      title: 'Academic Grade Portal',
      description:
        'Secure access for students to view preliminary and final grades.',
    },
    {
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
      alt: 'System Security',
      title: 'Security & Audit Logs',
      description:
        'Complete transparency of all gate and portal activity for campus safety.',
    },
  ];

  isLoading = false;
  loginError: string | null = null;

  // ---------- Gallery State ----------
  currentImageIndex = 0;
  touchStartX = 0;
  private autoSlideInterval: any;

  // ---------- Mobile Menu State (from header) ----------
  isMobileMenuOpen = false;

  // ---------- Login Modal State (from login-modal & auth service simulation) ----------
  isLoginModalOpen = false;
  loginForm: FormGroup;
  roles = ['Student', 'Parent', 'Teacher', 'Admin'];

  // ---------- Scroll Animation (from landing & service) ----------
  private scrollObserver: IntersectionObserver | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['Student', Validators.required],
    });
  }

  ngOnInit() {
    // Start auto-slide for gallery
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 4000);

    // Initialize scroll animations after a short delay (to ensure DOM is ready)
    setTimeout(() => this.initScrollAnimations(), 100);
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
    if (this.scrollObserver) this.scrollObserver.disconnect();
  }

  // ---------- FAQ Methods (from faq.component.ts) ----------
  toggleFaq(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
  }

  getQuestionIcon(question: string): string {
    if (question.includes('RFID') || question.includes('attendance'))
      return 'fa-id-badge';
    if (question.includes('lost') || question.includes('ID'))
      return 'fa-exclamation-triangle';
    if (question.includes('parents') || question.includes('notifications'))
      return 'fa-sms';
    if (question.includes('grades') || question.includes('portal'))
      return 'fa-graduation-cap';
    if (question.includes('facial') || question.includes('security'))
      return 'fa-user-shield';
    return 'fa-question-circle';
  }

  getProTip(question: string): string {
    if (question.includes('RFID'))
      return 'Avoid bending your ID card, as it might damage the internal RFID antenna.';
    if (question.includes('lost'))
      return 'A temporary gate pass can be requested at the guard house while waiting for a replacement.';
    if (question.includes('parents'))
      return 'Standard network rates may apply for SMS alerts depending on your service provider.';
    if (question.includes('grades'))
      return 'You can download a PDF copy of your unofficial grade slip directly from the portal.';
    if (question.includes('facial'))
      return 'Remove hats or heavy tinted glasses when approaching the gate camera for faster verification.';
    return 'Contact the ICT department for technical issues regarding your portal account.';
  }

  getResources(question: string): string {
    if (question.includes('RFID'))
      return 'Attendance Manual • RFID Scanner Locations';
    if (question.includes('lost')) return 'Replacement Form • ID Fee Schedule';
    if (question.includes('parents'))
      return 'SMS Setup Guide • Parent Portal Login';
    if (question.includes('grades'))
      return 'Accounting Clearance • Registrar Contacts';
    if (question.includes('facial'))
      return 'Campus Security Policy • Privacy Guidelines';
    return 'User Handbook • Support Ticket • Office Directory';
  }

  // ---------- Gallery Methods (from school-showcase) ----------
  get visibleImages() {
    const images = [];
    for (let i = 0; i < 4; i++) {
      const index = (this.currentImageIndex + i) % this.campusImages.length;
      images.push({
        ...this.campusImages[index],
        position: i,
        isFeatured: i === 0,
      });
    }
    return images;
  }

  nextImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.campusImages.length;
  }

  prevImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.campusImages.length) %
      this.campusImages.length;
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }

  getBackgroundClass(position: number): string {
    switch (position) {
      case 2:
        return 'pos-2';
      case 3:
        return 'pos-3';
      default:
        return '';
    }
  }

  // Touch events for mobile swipe
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const diff = touchEndX - this.touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.prevImage();
      else this.nextImage();
    }
  }

  // ---------- Mobile Menu (from header) ----------
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // ---------- Login Modal (from header + login-modal) ----------
  openLoginModal() {
    this.isLoginModalOpen = true;
  }

  closeModal() {
    this.isLoginModalOpen = false;
    this.loginForm.reset({ role: 'STUDENT' });
  }

onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.loginError = null;

  const { email, password, role } = this.loginForm.value;

  // ✅ backend expects lowercase: admin / student / teacher / parent
  const roleParam = String(role).toLowerCase();

  // ✅ backend expects username + password
  this.authService.login(roleParam, { username: email, password }).subscribe({
    next: (sessionUser) => {
      this.isLoading = false;
      this.closeModal();

      const roleName = (sessionUser.role_name || '').toLowerCase();
      if (roleName === 'admin') this.router.navigate(['/attendance/admin-dashboard']);
      else if (roleName === 'student') this.router.navigate(['/attendance/student-dashboard']);
      else if (roleName === 'teacher') this.router.navigate(['/attendance/teacher-dashboard']);
      else if (roleName === 'parent') this.router.navigate(['/grades/parent-dashboard']);
      else this.router.navigate(['/']);
    },
    error: (err) => {
      this.isLoading = false;
      this.loginError = err?.error?.message ?? 'Login failed. Please try again.';
    },
  });
}

  // ---------- Smooth Scroll (from header & hero) ----------
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.isMobileMenuOpen = false; // close mobile menu after click
  }

  // ---------- Scroll Animations (from landing & service) ----------
  private initScrollAnimations() {
    this.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      this.scrollObserver?.observe(el);
    });
  }
}
