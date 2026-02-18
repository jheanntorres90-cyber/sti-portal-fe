// header.component.ts
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CampusImage {
  src: string;
  alt: string;
  title: string;
  description: string;
  position: number;
}

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  isMobileMenuOpen = false;
  currentImageIndex = 0;
  isScrolled = false;

  // Campus Images Data
  campusImages: CampusImage[] = [
    {
      src: 'assets/images/ai-lab.jpg',
      alt: 'AI Innovation Lab',
      title: 'AI Innovation Laboratory',
      description: 'State-of-the-art artificial intelligence research facility with real-time data processing',
      position: 1
    },
    {
      src: 'assets/images/cloud-center.jpg',
      alt: 'Cloud Computing Center',
      title: 'Cloud Infrastructure Hub',
      description: 'Enterprise-grade cloud computing environment with AWS and Azure integration',
      position: 2
    },
    {
      src: 'assets/images/dev-space.jpg',
      alt: 'Developer Space',
      title: 'Collaborative Developer Studio',
      description: 'Modern development environment with pair programming capabilities',
      position: 3
    },
    {
      src: 'assets/images/iot-lab.jpg',
      alt: 'IoT Innovation Lab',
      title: 'Internet of Things Laboratory',
      description: 'Connected devices and smart technology innovation space',
      position: 4
    },
    {
      src: 'assets/images/robotics.jpg',
      alt: 'Robotics Center',
      title: 'Advanced Robotics Center',
      description: 'Cutting-edge robotics development and testing facility',
      position: 5
    },
    {
      src: 'assets/images/ar-vr-lab.jpg',
      alt: 'AR/VR Studio',
      title: 'Immersive Technology Studio',
      description: 'Virtual and augmented reality development workspace',
      position: 6
    }
  ];

  // FAQ Items Data
  faqItems: FaqItem[] = [
    {
      question: 'How do I access the developer portal?',
      answer: 'Access the developer portal using your STI credentials through single sign-on (SSO). First-time users will need to complete the multi-factor authentication setup for enhanced security. The portal supports OAuth 2.0, biometric verification, and hardware security keys.',
      isOpen: false
    },
    {
      question: 'What development tools are available?',
      answer: 'Our platform provides a comprehensive suite of development tools including VS Code integration, Docker containers, Git repositories, CI/CD pipelines, and cloud deployment options. You can customize your workspace with pre-configured toolchains for various tech stacks.',
      isOpen: false
    },
    {
      question: 'How do I deploy my projects?',
      answer: 'Projects can be deployed with one-click deployment to our cloud infrastructure. We support Kubernetes orchestration, auto-scaling, and provide comprehensive monitoring tools. You can choose between staging and production environments.',
      isOpen: false
    },
    {
      question: 'Is there 24/7 technical support?',
      answer: 'Yes, our developer support team is available 24/7 through live chat, email, and dedicated Discord channels. Enterprise customers also get access to priority support and direct Slack integration with our engineering team.',
      isOpen: false
    },
    {
      question: 'How can I collaborate with other developers?',
      answer: 'The platform includes real-time collaboration features including pair programming sessions, code reviews, shared workspaces, and team analytics. You can create project teams, manage permissions, and track contributions.',
      isOpen: false
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScroll();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScroll();
    }
  }

  private checkScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Mobile menu toggle
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }

  // Smooth scroll to section
scrollToSection(sectionId: string) {
  if (!isPlatformBrowser(this.platformId)) return;

  const element = document.getElementById(sectionId);
  if (!element) return;

  const header = document.querySelector('header');
  const headerHeight = header ? header.clientHeight : 0;

  const elementTop =
    element.getBoundingClientRect().top + window.pageYOffset;

  const offsetPosition = elementTop - headerHeight - 20;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });

  if (this.isMobileMenuOpen) {
    this.toggleMobileMenu();
  }
}


  // Image gallery selection
  selectImage(index: number) {
    this.currentImageIndex = index;
    // Ensure index wraps around
    if (this.currentImageIndex >= this.campusImages.length) {
      this.currentImageIndex = 0;
    }
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.campusImages.length - 1;
    }
  }

  // Get visible images for gallery
  get visibleImages(): CampusImage[] {
    const visibleImages: CampusImage[] = [];
    const totalImages = this.campusImages.length;
    
    // Add current image first
    visibleImages.push(this.campusImages[this.currentImageIndex]);
    
    // Add next 5 images with wrapping
    for (let i = 1; i < 6; i++) {
      const nextIndex = (this.currentImageIndex + i) % totalImages;
      const image = { ...this.campusImages[nextIndex] };
      image.position = i;
      visibleImages.push(image);
    }
    
    return visibleImages;
  }

  // Get background class based on position
  getBackgroundClass(position: number): string {
    const baseClasses = 'tech-image-card ';
    switch(position) {
      case 1:
        return baseClasses + 'col-span-1 md:col-span-1';
      case 2:
        return baseClasses + 'col-span-1 md:col-span-1';
      case 3:
        return baseClasses + 'col-span-1 md:col-span-1';
      case 4:
        return baseClasses + 'col-span-1 md:col-span-1 hidden md:block';
      case 5:
        return baseClasses + 'col-span-1 md:col-span-1 hidden md:block';
      default:
        return baseClasses + 'col-span-1 md:col-span-1 hidden md:block';
    }
  }

  // FAQ toggle
  toggleFaq(index: number) {
    this.faqItems[index].isOpen = !this.faqItems[index].isOpen;
    
    // Close other FAQs (optional)
    // this.faqItems.forEach((item, i) => {
    //   if (i !== index) {
    //     item.isOpen = false;
    //   }
    // });
  }

  // Get icon for FAQ question
  getQuestionIcon(question: string): string {
    const icons: { [key: string]: string } = {
      'access': 'fa-key',
      'tools': 'fa-tools',
      'deploy': 'fa-cloud-upload-alt',
      'support': 'fa-headset',
      'collaborate': 'fa-users-cog'
    };
    
    for (const key in icons) {
      if (question.toLowerCase().includes(key)) {
        return icons[key];
      }
    }
    return 'fa-question-circle';
  }

  // Get pro tip based on question
  getProTip(question: string): string {
    const tips: { [key: string]: string } = {
      'access': 'Enable biometric authentication for faster logins while maintaining security',
      'tools': 'Use our VS Code extension for seamless integration with the platform',
      'deploy': 'Set up auto-scaling policies before deployment for optimal performance',
      'support': 'Join our Discord for instant community support and developer updates',
      'collaborate': 'Use pair programming sessions for complex problem solving'
    };
    
    for (const key in tips) {
      if (question.toLowerCase().includes(key)) {
        return tips[key];
      }
    }
    return 'Check our documentation for detailed guides and best practices';
  }

  // Get resources based on question
  getResources(question: string): string {
    const resources: { [key: string]: string } = {
      'access': 'Authentication Guide · Security Best Practices · API Keys',
      'tools': 'Toolchain Documentation · IDE Setup · Docker Images',
      'deploy': 'Deployment Guide · Kubernetes Docs · Monitoring Setup',
      'support': 'Knowledge Base · Video Tutorials · Community Forum',
      'collaborate': 'Team Guide · Code Review Standards · Git Workflow'
    };
    
    for (const key in resources) {
      if (question.toLowerCase().includes(key)) {
        return resources[key];
      }
    }
    return 'Documentation · Tutorials · Code Samples · Community';
  }

  // Handle scroll to top
  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Handle button clicks
  onLaunchPortal() {
    console.log('Launching portal...');
    // Add your portal launch logic here
  }

  onExploreTech() {
    console.log('Exploring tech stack...');
    // Add your tech exploration logic here
  }

  onWatchDemo() {
    console.log('Watching demo...');
    // Add your demo video logic here
  }

  // Clean up on destroy
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }
}