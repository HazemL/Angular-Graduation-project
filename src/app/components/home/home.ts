import { Component, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GovernorateCitiesService } from '../../services/governorate-cities.service';
import { CraftsmanServicesService, Service } from '../../services/craftsman-services.service';
import { Testimonial } from '../../../model/testimonial';
import { WorkStep } from '../../../model/work-step';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink,AsyncPipe  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private governorateCitiesService = inject(GovernorateCitiesService);
  private craftsmanServicesService = inject(CraftsmanServicesService);
  private router = inject(Router);

  selectedService = signal<string>('سباك');
  selectedLocation = signal<string>('');
  selectedCity = signal<string>('');
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Initialize dark mode from current theme
    const currentTheme = document.body.getAttribute('data-bs-theme');
    if (currentTheme === 'dark' || document.documentElement.classList.contains('dark')) {
      this.isDarkMode.set(true);
    }
  }

  filteredCities = signal<string[]>([]);

  // Get data from services
  services: Service[] = this.craftsmanServicesService.getAllServices();

 governorates = this.governorateCitiesService.getGovernorateNames();


  // Bindable properties for template `ngModel` to work with signals
  get selectedServiceValue(): string {
    return this.selectedService();
  }
  set selectedServiceValue(v: string) {
    this.selectedService.set(v);
  }

  get selectedLocationValue(): string {
    return this.selectedLocation();
  }
  set selectedLocationValue(v: string) {
    this.selectedLocation.set(v);
    // keep cities in sync when location changes via template
    this.onGovernorateChange();
  }

  get selectedCityValue(): string {
    return this.selectedCity();
  }
  set selectedCityValue(v: string) {
    this.selectedCity.set(v);
  }

  workSteps: WorkStep[] = [
    {
      icon: 'search',
      step: '1',
      title: 'ابحث عن صنايعي',
      description: 'حدد الخدمة التي تحتاجها ومنطقتك للعثور على الحرفيين المتاحين.'
    },
    {
      icon: 'person_search',
      step: '2',
      title: 'قارن واختر',
      description: 'تصفح ملفات الحرفيين، اقرأ التقييمات، واختر الأنسب لك.'
    },
    {
      icon: 'task_alt',
      step: '3',
      title: 'أنجز عملك',
      description: 'تواصل مع الحرفي، اتفق على التفاصيل، وأنجز عملك بكفاءة.'
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'أحمد محمود',
      rating: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHu_9zGKfoJPcp1AOoIZPPgZuwCNPR6Z7srzfiTqIfjFTv7cBi_GW4YiANot2WZeHDREkrFR3e7_iDPcMD5aKWmiNM3Xv0S67UHSKwzX9S0JjNfdXs1c9djIe2u4IBi8y1VeazIRqzHZrNKFmORqdAS5UrmzclVgeXGKzKpbdeXNZkK0kmNa6BZuuQ_uPEbnd4LAMfVTtWaYggeuJ-ZkcFDlu8WbQn1BPRX69cq0lp5SLF5g5XHloac5liZ1bV55gwC6IXfDoMWJXU',
      text: '"خدمة ممتازة وسريعة. وجدت سباك محترف في أقل من ساعة وحل المشكلة بكفاءة عالية. أنصح به بشدة."'
    },
    {
      name: 'فاطمة علي',
      rating: 4.5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIvGnOLsDajEeF239D-pL6V7zY4C1awCFhVXbpQfNvufslKwRNsHa2nQ0a7nGjaj1WWFd9TGQlV7QiV1CvPnqKyHcI-iN8qpvIa2bsErIZHOXNdvXlsq3f7ri3liC0bbe58GmgDD1XhHQQSv4k3XGyqFwstr8czIPqdTOBUJcZJQbgN5tdO_M8h580p0U-7MTeeRlDO85-BtodNYqIHFNPJ3HPohr68QMPYG-0LA52VD7nBZ_RG0DZCZrSakUjoHAMGVkbPyWbU42m',
      text: '"التطبيق سهل الاستخدام جداً والكهربائي كان محترم ومواعيده دقيقة. تجربة رائعة بالتأكيد سأكررها."'
    },
    {
      name: 'محمد حسن',
      rating: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUIhQL6FlHtihrr8ECEeNPfGNZfU9GNRh0F8Chk86Bp7UvczokoTTpN2n6dXwdiU8fWnFMsKoMff4d-89Skm80ccuHwT3NzPg5KK9s2mngoH4kfILlYQ6Ny26p9kEsh0DnNX8KX0T42SOyfmty3Zp1LMOqUgpJLd5HXr1UKFhFeno4FwV-fTmrDth2xcCjH35Ng3_GLcYnmewW5P5fo2Jxgi0rfEpYnpV_5tjnMKy7VAIMCK5twJD3eYQ-s3nHGMU5l6bkZ0Yoh9go',
      text: '"أخيراً منصة موثوقة للصنايعية في مصر. الأسعار كانت واضحة ولا يوجد أي مصاريف خفية."'
    }
  ];

  statistics = [
    { value: '1000+', label: 'صنايعي معتمد' },
    { value: '5000+', label: 'عميل راضٍ' },
    { value: '15+', label: 'مدينة متاحة' }
  ];

  // Service title to route mapping
  private serviceRoutes: { [key: string]: string } = {
    'سباك': '/plumber',
    'كهربائي': '/electrician',
    'نجار': '/carpenter',
    'فني تكييف': '/ac-technician',
    'نقاش': '/painter',
    'فني ألوميتال': '/aluminum-technician',
    'فني غاز': '/gas-technician',
    'إصلاح أجهزة': '/device-repair'
  };

  onGovernorateChange(): void {
    const selectedGov = this.selectedLocation();
    if (selectedGov) {
      this.governorateCitiesService.getCityNamesByGovernorate(selectedGov).subscribe(names => {
        this.filteredCities.set(names);
      });
      this.selectedCity.set('');
    } else {
      this.filteredCities.set([]);
      this.selectedCity.set('');
    }
  }

  // onSearch(): void {
  //   console.log('Searching for:', {
  //     service: this.selectedService(),
  //     governorate: this.selectedLocation(),
  //     city: this.selectedCity()
  //   });
  //   const location = this.selectedCity() || this.selectedLocation() || 'جميع المناطق';
    
  //   // Navigate to the service page
  //   const route = this.serviceRoutes[this.selectedService()];
  //   if (route) {
  //     this.router.navigate([route]);
  //   }
  // }

  onServiceClick(service: Service): void {
    console.log('Service clicked:', service.title);
    this.selectedService.set(service.title);
    
    // Navigate to the corresponding service page
    const route = this.serviceRoutes[service.title];
    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn('No route found for service:', service.title);
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(value => !value);
    const html = document.documentElement;
    if (this.isDarkMode()) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  getStarArray(rating: number): boolean[] {
    const stars: boolean[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(true);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(false);
      } else {
        stars.push(false);
      }
    }
    return stars;
  }

  hasHalfStar(rating: number, index: number): boolean {
    return index === Math.floor(rating) && rating % 1 !== 0;
  }










  //////////////////
  // Add these methods to home.component.ts

onSearch(): void {
  const selectedGov = this.selectedLocation();
  const selectedCityName = this.selectedCity();
  
  console.log('Searching for:', {
    service: this.selectedService(),
    governorate: selectedGov,
    city: selectedCityName
  });

  // Get IDs from names
  this.governorateCitiesService.getGovernorateIdByName(selectedGov).subscribe(govId => {
    let cityId: number | undefined;
    
    if (selectedCityName) {
      this.governorateCitiesService.getCityIdByName(selectedCityName, selectedGov).subscribe(cId => {
        cityId = cId;
        this.navigateToService(govId, cityId);
      });
    } else {
      this.navigateToService(govId, undefined);
    }
  });
}

private navigateToService(governorateId?: number, cityId?: number): void {
  const route = this.serviceRoutes[this.selectedService()];
  if (route) {
    this.router.navigate([route], {
      queryParams: {
        governorateId: governorateId,
        cityId: cityId
      }
    });
  }
}
}